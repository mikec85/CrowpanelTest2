import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAISuggestions, HomeState } from '../services/geminiService';
import { cn } from '../lib/utils';

interface AISuggestionsProps {
  homeState: HomeState;
}

export function AISuggestions({ homeState }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAISuggestions(homeState);
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [homeState]);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="h-full bg-gradient-to-br from-indigo-900/40 to-slate-900/50 p-4 flex items-center space-x-4 border-l-4 border-indigo-500/50">
      <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-indigo-300 tracking-[0.1em]">Intelligence Suggestion</p>
        <AnimatePresence mode="wait">
          {loading ? (
             <div className="w-20 h-4 bg-slate-700/50 animate-pulse rounded mt-1" />
          ) : (
            <motion.p 
              key={suggestions[0]}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-white leading-tight font-medium"
            >
              {suggestions[0] || "Ready for voice command..."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
