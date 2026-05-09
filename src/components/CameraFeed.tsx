import React from 'react';
import { Camera, Maximize2, Settings, Wifi } from 'lucide-react';
import { motion } from 'motion/react';

export function CameraFeed() {
  return (
    <div className="w-full h-full relative bg-slate-900">
      {/* Simulation overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 p-3">
        <div className="flex justify-between items-start">
          <div className="bg-red-600 px-2 py-1 rounded-md text-[8px] font-bold uppercase flex items-center text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span> 
            LIVE - FRONT PORCH
          </div>
          <div className="flex gap-2">
            <div className="bg-black/50 backdrop-blur p-1.5 rounded-lg border border-white/10">
              <Wifi className="w-3.5 h-3.5 text-emerald-400 font-bold" />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-3 right-3 flex gap-2 pointer-events-auto">
          <button className="p-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors text-white/70">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
          <span className="text-[9px] font-mono text-white/60 tracking-wider">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Placeholder Feed */}
      <div 
        className="w-full h-full bg-slate-800 flex items-center justify-center"
      >
        <div className="relative group/cam">
          <Camera className="w-12 h-12 text-slate-600 group-hover/cam:text-slate-500 transition-colors" />
          <motion.div
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
