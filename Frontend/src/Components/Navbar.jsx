import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

export default function Navbar({ issueCount = 0 }) {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-md">
      {/* Brand Identity */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <MapPin className="text-emerald-400 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wide leading-none text-white">
            CivicFix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hyper-Local Infrastructure Reporting
          </p>
        </div>
      </div>

      {/* Right Action/Status Indicators */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-slate-300">
          <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{issueCount} Nearby Active</span>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full font-semibold">
          Citizen Portal
        </span>
      </div>
    </nav>
  );
}