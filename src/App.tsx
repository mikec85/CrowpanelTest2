/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BentoGrid, BentoItem } from './components/BentoGrid';
import { AlarmKeypad } from './components/AlarmKeypad';
import { DeviceDashboard } from './components/DeviceDashboard';
import { CameraFeed } from './components/CameraFeed';
import { DataVisualizer } from './components/DataVisualizer';
import { AISuggestions } from './components/AISuggestions';
import { mqttService } from './services/mqttService';
import { HomeState } from './services/geminiService';
import { Monitor, Cpu, Clock, Bell } from 'lucide-react';

export default function App() {
  const [alarmStatus, setAlarmStatus] = useState<'armed' | 'disarmed' | 'pending'>('disarmed');
  const [devices, setDevices] = useState([
    { id: '1', name: 'Living Room Lights', status: 'off', type: 'light' },
    { id: '2', name: 'Kitchen Thermostat', status: 'on', type: 'hvac', value: '22°C' },
    { id: '3', name: 'Security Camera 1', status: 'on', type: 'media' },
    { id: '4', name: 'Office Lamp', status: 'off', type: 'light' },
    { id: '5', name: 'Garage Door', status: 'off', type: 'appliance' },
    { id: '6', name: 'Smart TV', status: 'off', type: 'media' },
  ] as any[]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Connect to MQTT
    mqttService.connect((topic, message) => {
      console.log(`MQTT: ${topic} -> ${message}`);
      if (topic === 'home/alarm/status') {
        setAlarmStatus(message as any);
      }
      // Handle other device updates here
    });

    return () => {
      clearInterval(timer);
      mqttService.disconnect();
    };
  }, []);

  const handleArm = () => {
    setAlarmStatus('armed');
    mqttService.publish('home/alarm/cmd', 'arm');
  };

  const handleDisarm = (code: string) => {
    if (code === '1234') { // Secure bypass for demo
      setAlarmStatus('disarmed');
      mqttService.publish('home/alarm/cmd', 'disarm');
    } else {
      // Handle wrong code
    }
  };

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => 
      d.id === id ? { ...d, status: d.status === 'on' ? 'off' : 'on' } : d
    ));
    const device = devices.find(d => d.id === id);
    mqttService.publish(`home/devices/${id}/set`, device?.status === 'on' ? 'off' : 'on');
  };

  const homeState: HomeState = {
    alarmStatus,
    devices: devices.map(d => ({ name: d.name, status: d.status, type: d.type })),
    temperature: 22.4
  };

  return (
    <div className="w-full h-screen p-6 bg-[#0a0a0b] overflow-hidden flex flex-col font-sans text-slate-200">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
            <Cpu className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">CROWPANEL HMI <span className="text-blue-500">PRO</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MQTT ACTIVE | ESP32-P4 CORE
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-2xl font-light">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              <span className="text-sm opacity-60 ml-1">
                {time.toLocaleTimeString([], { hour12: true }).slice(-2)}
              </span>
            </p>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
              {time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
            <div className="relative">
              <Monitor className="w-6 h-6 text-emerald-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse border-2 border-slate-800"></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 min-h-0">
        <BentoGrid className="gap-4">
          {/* Security & Alarm */}
          <BentoItem colSpan={4} rowSpan={3} title="Security Protocol">
            <AlarmKeypad 
              status={alarmStatus} 
              onArm={handleArm} 
              onDisarm={handleDisarm} 
            />
          </BentoItem>

          {/* Keypad Logic integrated into AlarmKeypad component but UI updated in sub-component */}
          <BentoItem colSpan={5} rowSpan={4} title="Security PIN Entry">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">DISARM INTERFACE</span>
                <div className="flex gap-2">
                  {[0,1,2,3].map(i => <div key={i} className="w-3 h-3 rounded-full bg-slate-700" />)}
                </div>
              </div>
              <AlarmKeypad 
                status={alarmStatus === 'armed' ? 'armed' : 'disarmed'}
                onArm={handleArm} 
                onDisarm={handleDisarm}
                embedded 
              />
            </div>
          </BentoItem>

          {/* Camera Feed */}
          <BentoItem colSpan={3} rowSpan={3} title="LIVE - FRONT PORCH">
            <CameraFeed />
          </BentoItem>

          {/* AI Suggestions */}
          <BentoItem colSpan={3} rowSpan={1} noBorder>
            <AISuggestions homeState={homeState} />
          </BentoItem>

          {/* Power Stats */}
          <BentoItem colSpan={4} rowSpan={3} title="ENERGY METRIC">
             <div className="p-6 flex items-center justify-between h-full bg-slate-900/30">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/40">
                        <Cpu className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Current Power</p>
                        <p className="text-2xl font-bold">1.24 <span className="text-sm font-normal text-slate-500">kW</span></p>
                    </div>
                </div>
                <div className="w-16 h-8 bg-slate-800 rounded-full flex items-center px-1">
                    <div className="w-6 h-6 bg-slate-300 rounded-full shadow-lg translate-x-8"></div>
                </div>
            </div>
          </BentoItem>

          {/* Quick Controls */}
          <BentoItem colSpan={8} rowSpan={2} title="SYSTEM PERIPHERALS">
             <DeviceDashboard devices={devices} onToggle={toggleDevice} />
          </BentoItem>
        </BentoGrid>
      </main>

      {/* Footer Area */}
      <footer className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-slate-500">
        <div className="flex gap-8 items-center">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">NETWORK: SECURE</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">ENCRYPTION: AES-256</span>
            </div>
        </div>
        <div className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-50 italic">
          ESP32-P4 CORE • HMI PRO SDK v4.2
        </div>
      </footer>
    </div>
  );
}
