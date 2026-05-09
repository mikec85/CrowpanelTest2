import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { time: '12:00', temp: 21, energy: 1.2 },
  { time: '13:00', temp: 22, energy: 1.5 },
  { time: '14:00', temp: 21.5, energy: 1.8 },
  { time: '15:00', temp: 23, energy: 2.1 },
  { time: '16:00', temp: 22.8, energy: 1.4 },
  { time: '17:00', temp: 22, energy: 1.1 },
];

export function DataVisualizer() {
  return (
    <div className="w-full h-full p-4 flex flex-col">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FB923C" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FB923C" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              hide 
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#151619', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#FB923C" 
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-mono uppercase text-[#8E9299]">Current Temperature</p>
          <p className="text-2xl font-mono text-white">22.4°C</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono uppercase text-[#8E9299]">Efficiency</p>
          <p className="text-sm font-mono text-emerald-400">94%</p>
        </div>
      </div>
    </div>
  );
}
