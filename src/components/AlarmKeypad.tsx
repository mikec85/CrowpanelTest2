import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldAlert, ShieldCheck, X, Delete } from 'lucide-react';
import { cn } from '../lib/utils';

interface AlarmKeypadProps {
  status: 'armed' | 'disarmed' | 'pending';
  onArm: () => void;
  onDisarm: (code: string) => void;
  className?: string;
  embedded?: boolean;
}

export function AlarmKeypad({ status, onArm, onDisarm, className, embedded }: AlarmKeypadProps) {
  const [code, setCode] = useState('');

  const handleNumber = (num: string) => {
    if (code.length < 4) {
      const newCode = code + num;
      setCode(newCode);
      if (newCode.length === 4 && !embedded) {
        onDisarm(newCode);
        setTimeout(() => setCode(''), 500);
      }
    }
  };

  const handleClear = () => setCode('');

  if (embedded) {
    return (
      <div className="flex-1 flex flex-col h-full bg-slate-900/20">
         <div className="flex-1 grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'CLR', 0, 'DISARM'].map((val) => (
              <button
                key={val}
                onClick={() => {
                  if (val === 'CLR') handleClear();
                  else if (val === 'DISARM') {
                    onDisarm(code);
                    setCode('');
                  }
                  else handleNumber(val.toString());
                }}
                className={cn(
                    "rounded-2xl text-2xl font-medium border transition-all duration-200 active:scale-95",
                    val === 'CLR' ? "bg-red-500/20 text-red-400 border-red-500/30 text-sm font-bold" :
                    val === 'DISARM' ? "bg-emerald-500 text-slate-900 font-bold border-emerald-400 text-sm" :
                    "bg-slate-800/40 border-slate-700/50 text-slate-200 hover:bg-slate-700/50"
                )}
              >
                {val}
              </button>
            ))}
          </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full flex flex-col p-6 items-center justify-between", className)}>
      <div className="text-center flex flex-col items-center">
        <div className={cn(
            "w-32 h-32 rounded-full flex items-center justify-center border-4 mb-4 transition-all duration-500 hmi-glow-red",
            status === 'armed' ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20 hmi-glow-emerald"
        )}>
           {status === 'armed' ? (
                <ShieldAlert className="w-16 h-16 text-red-500" />
            ) : (
                <ShieldCheck className="w-16 h-16 text-emerald-500" />
            )}
        </div>
        <h2 className={cn(
            "text-3xl font-bold uppercase tracking-tight",
            status === 'armed' ? "text-white" : "text-emerald-400"
        )}>
            {status === 'armed' ? 'ARMED' : 'SECURE'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {status === 'armed' ? 'Front Door Locked' : 'All systems normal'} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
        </p>
      </div>
      
      <button 
        onClick={onArm}
        disabled={status === 'armed'}
        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {status === 'armed' ? 'SYSTEM ARMED' : 'ARM SYSTEM'}
      </button>
    </div>
  );
}
