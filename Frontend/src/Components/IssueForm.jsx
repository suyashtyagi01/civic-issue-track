import React, { useState } from 'react';
import { MapPin, Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function IssueForm({ onIssueCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'pothole',
    imageUrl: '',
    lat: null,
    lng: null,
  });

  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Trigger HTML5 Geolocation API
  const handleGetLocation = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
          setLocating(false);
        },
        (error) => {
          alert(`GPS Error (${error.code}): ${error.message}`);
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.lat || !formData.lng) {
      alert("Please capture your GPS location before submitting!");
      return;
    }

    setSubmitting(true);

    try {
      // POST request to backend API
      const response = await axios.post('http://localhost:5000/api/issues', formData);

      if (response.data.success) {
        // Notify parent App.jsx to refresh map pins
        onIssueCreated(response.data.data);

        // Reset form
        setFormData({
          title: '',
          category: 'pothole',
          imageUrl: '',
          lat: null,
          lng: null,
        });

        alert("Issue reported successfully!");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert(error.response?.data?.message || "Failed to submit issue to server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 text-white space-y-4 shadow-xl backdrop-blur">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Report Civic Issue
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Submit potholes, broken lighting, or public hazards near you.
        </p>
      </div>

      {/* Title Field */}
      <div>
        <label className="text-xs text-slate-300 font-medium block mb-1.5">
          Issue Title <span className="text-emerald-400">*</span>
        </label>
        <input 
          type="text" 
          placeholder="e.g., Deep pothole at crossroad intersection"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
        />
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="text-xs text-slate-300 font-medium block mb-1.5">
          Category <span className="text-emerald-400">*</span>
        </label>
        <select 
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
        >
          <option value="pothole">Roads / Pothole</option>
          <option value="lighting">Street Lighting</option>
          <option value="sanitation">Garbage & Waste</option>
          <option value="water">Water Leakage</option>
        </select>
      </div>

      {/* Image URL Input */}
      <div>
        <label className="text-xs text-slate-300 font-medium block mb-1.5">
          Image Link (Optional)
        </label>
        <input 
          type="url" 
          placeholder="https://images.unsplash.com/..."
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
        />
      </div>

      {/* Location Button */}
      <div>
        <label className="text-xs text-slate-300 font-medium block mb-1.5">
          Location Coordinates <span className="text-emerald-400">*</span>
        </label>
        <button
          type="button"
          onClick={handleGetLocation}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold border transition cursor-pointer ${
            formData.lat 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
              : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
          }`}
        >
          {formData.lat ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>GPS Captured ({formData.lat.toFixed(4)}, {formData.lng.toFixed(4)})</span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{locating ? "Fetching GPS..." : "Detect Current GPS Location"}</span>
            </>
          )}
        </button>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-lg transition duration-150 cursor-pointer shadow-lg shadow-emerald-500/10"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting to Database...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Report
          </>
        )}
      </button>
    </form>
  );
}