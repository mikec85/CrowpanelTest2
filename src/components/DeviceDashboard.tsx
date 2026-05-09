import React from 'react';
import { Lightbulb, Thermometer, Wind, Power, Droplets, Tv, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

interface Device {
  id: string;
  name: string;
  status: 'on' | 'off';
  type: 'light' | 'hvac' | 'media' | 'appliance';
  value?: string;
}

interface DeviceDashboardProps {
  devices: Device[];
  onToggle: (id: string) => void;
}

export function DeviceDashboard({ devices, onToggle }: DeviceDashboardProps) {
  const getIcon = (type: Device['type']) => {
    switch (type) {
      case 'light': return <Lightbulb className="w-5 h-5" />;
      case 'hvac': return <Wind className="w-5 h-5" />;
      case 'media': return <Tv className="w-5 h-5" />;
      default: return <Power className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-4 grid grid-cols-4 gap-4 h-full overflow-y-auto custom-scrollbar">
      {devices.map((device) => (
        <button
          key={device.id}
          onClick={() => onToggle(device.id)}
          className={cn(
            "p-5 rounded-3xl border flex flex-col justify-between transition-all duration-300 text-left h-full min-h-[120px]",
            device.status === 'on' 
              ? "bg-slate-900/80 border-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
              : "bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/50"
          )}
        >
          <div className="flex justify-between items-start w-full">
            <div className={cn(
              "p-2 rounded-xl",
              device.status === 'on' ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-500"
            )}>
              {getIcon(device.type)}
            </div>
            <div className={cn(
              "w-2 h-2 rounded-full",
              device.status === 'on' ? "bg-amber-500 animate-pulse" : "bg-slate-700"
            )} />
          </div>
          
          <div className="mt-auto">
            <p className="text-sm font-bold leading-tight">
              {device.name}
            </p>
            <p className="text-[10px] uppercase font-mono tracking-wider opacity-50 mt-1">
              {device.status === 'on' ? 'Active' : 'Standby'} {device.value ? `| ${device.value}` : ''}
            </p>
          </div>
        </button>
      ))}
      <div className="flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl p-5 hover:bg-slate-900/30 transition-colors cursor-pointer text-slate-700">
         <Cpu className="w-8 h-8" />
      </div>
    </div>
  );
}
