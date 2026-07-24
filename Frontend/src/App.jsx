import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import IssueForm from './components/IssueForm.jsx';
import MapView from './components/MapView.jsx';

export default function App() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch nearby issues from Express backend
  const fetchNearbyIssues = async (lat = 28.6139, lng = 77.2090) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/issues/nearby', {
        params: { lat, lng, maxDistanceMeters: 50000 }
      });

      if (response.data?.success) {
        const formattedIssues = response.data.data.map(item => ({
          ...item,
          lat: item.location.coordinates[1],
          lng: item.location.coordinates[0],
        }));

        setIssues(formattedIssues);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchNearbyIssues(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchNearbyIssues();
        }
      );
    } else {
      fetchNearbyIssues();
    }
  }, []);

  const handleIssueCreated = (newRawIssue) => {
    const formattedNewIssue = {
      ...newRawIssue,
      lat: newRawIssue.location.coordinates[1],
      lng: newRawIssue.location.coordinates[0],
    };

    setIssues((prev) => [formattedNewIssue, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <Navbar issueCount={issues.length} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <IssueForm onIssueCreated={handleIssueCreated} />
        </div>
        <div className="lg:col-span-2">
          {loading ? (
            <div className="w-full h-[550px] bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400">
              Loading nearby map issues...
            </div>
          ) : (
            <MapView issues={issues} />
          )}
        </div>
      </main>
    </div>
  );
}