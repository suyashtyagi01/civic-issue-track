import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for React Leaflet missing default marker asset URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapView({ issues = [] }) {
  // Default map position fallback (New Delhi / Global baseline)
  const defaultCenter = [28.6139, 77.2090]; 

  // If there are issues with coordinates, center on the latest issue
  const mapCenter = issues.length > 0 && issues[issues.length - 1].lat
    ? [issues[issues.length - 1].lat, issues[issues.length - 1].lng]
    : defaultCenter;

  return (
    <div className="w-full h-[550px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        className="w-full h-full z-0"
        scrollWheelZoom={true}
      >
        {/* Free OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic Pins */}
        {issues.map((item, index) => (
          <Marker key={index} position={[item.lat, item.lng]}>
            <Popup>
              <div className="p-1 min-w-[180px] max-w-[220px]">
                <h3 className="font-bold text-slate-900 text-sm leading-tight">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {item.category}
                  </span>
                </div>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-24 object-cover rounded mt-2 border border-slate-200" 
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}