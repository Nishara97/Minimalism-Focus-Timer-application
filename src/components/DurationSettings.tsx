import React from 'react';
import { TimerConfig } from '../types';
import { Sliders, Clock, Coffee, Sparkles } from 'lucide-react';

interface DurationSettingsProps {
  config: TimerConfig;
  onUpdateConfig: (newConfig: TimerConfig) => void;
  disabled?: boolean;
}

export const DurationSettings: React.FC<DurationSettingsProps> = ({
  config,
  onUpdateConfig,
  disabled = false,
}) => {
  const handleChange = (key: keyof TimerConfig, val: number) => {
    let sanitizedVal = Math.max(1, Math.min(300, val));
    if (key === 'longBreakInterval') {
      sanitizedVal = Math.max(1, Math.min(12, val));
    }
    
    onUpdateConfig({
      ...config,
      [key]: sanitizedVal,
    });
  };

  const loadPreset = (work: number, short: number, long: number) => {
    if (disabled) return;
    onUpdateConfig({
      workDuration: work,
      shortBreakDuration: short,
      longBreakDuration: long,
      longBreakInterval: config.longBreakInterval,
    });
  };

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#1C1917]" />
          <h2 className="text-sm font-semibold tracking-tight text-[#1C1917] font-display">Configure Intervals</h2>
        </div>
        {disabled && (
          <span className="text-[10px] uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full font-bold">
            Running
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Work Duration Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-medium text-[#44403C]">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#78716C]" />
              Work Period
            </span>
            <span className="font-mono text-[#1C1917] bg-[#F5F5F4] px-1.5 py-0.5 rounded text-xs font-bold">
              {config.workDuration}m
            </span>
          </div>
          <input
            id="work-duration-slider"
            type="range"
            min="1"
            max="120"
            disabled={disabled}
            value={config.workDuration}
            onChange={(e) => handleChange('workDuration', parseInt(e.target.value) || 25)}
            className="w-full h-1 bg-[#E7E5E4] rounded-lg appearance-none cursor-pointer accent-[#1C1917] disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-[#A8A29E] font-mono">
            <span>1m</span>
            <span>25m</span>
            <span>60m</span>
            <span>120m</span>
          </div>
        </div>

        {/* Short Break Duration */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-medium text-[#44403C]">
            <span className="flex items-center gap-1.5 font-medium">
              <Coffee className="w-3.5 h-3.5 text-[#78716C]" />
              Short Break
            </span>
            <span className="font-mono text-[#1C1917] bg-[#F5F5F4] px-1.5 py-0.5 rounded text-xs font-bold">
              {config.shortBreakDuration}m
            </span>
          </div>
          <input
            id="short-break-slider"
            type="range"
            min="1"
            max="30"
            disabled={disabled}
            value={config.shortBreakDuration}
            onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value) || 5)}
            className="w-full h-1 bg-[#E7E5E4] rounded-lg appearance-none cursor-pointer accent-[#1C1917] disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-[#A8A29E] font-mono">
            <span>1m</span>
            <span>5m</span>
            <span>15m</span>
            <span>30m</span>
          </div>
        </div>

        {/* Long Break Duration */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-medium text-[#44403C]">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#78716C]" />
              Long Break
            </span>
            <span className="font-mono text-[#1C1917] bg-[#F5F5F4] px-1.5 py-0.5 rounded text-xs font-bold">
              {config.longBreakDuration}m
            </span>
          </div>
          <input
            id="long-break-slider"
            type="range"
            min="1"
            max="45"
            disabled={disabled}
            value={config.longBreakDuration}
            onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value) || 15)}
            className="w-full h-1 bg-[#E7E5E4] rounded-lg appearance-none cursor-pointer accent-[#1C1917] disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-[#A8A29E] font-mono">
            <span>1m</span>
            <span>15m</span>
            <span>30m</span>
            <span>45m</span>
          </div>
        </div>

        {/* Long Break Interval */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-medium text-[#44403C]">
            <span>Long Break Frequency</span>
            <span className="font-mono text-[#1C1917] bg-[#F5F5F4] px-1.5 py-0.5 rounded text-xs font-bold">
              Every {config.longBreakInterval} cycles
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                id={`break-interval-${num}`}
                key={num}
                type="button"
                disabled={disabled}
                onClick={() => handleChange('longBreakInterval', num)}
                className={`flex-1 py-1 text-xs rounded-lg font-bold transition-all font-mono ${
                  config.longBreakInterval === num
                    ? 'bg-[#1C1917] text-white'
                    : 'bg-[#F5F5F4] hover:bg-[#E7E5E4] text-[#44403C] disabled:opacity-50'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset shortcuts */}
      <div className="pt-4 border-t border-[#E7E5E4]">
        <span className="block text-[10px] uppercase tracking-widest font-bold text-[#A8A29E] mb-2">Preset Formats</span>
        <div className="flex flex-wrap gap-2">
          <button
            id="preset-classic"
            type="button"
            disabled={disabled}
            onClick={() => loadPreset(25, 5, 15)}
            className="text-xs bg-white hover:bg-[#F5F5F4] disabled:opacity-50 text-[#44403C] px-3 py-1.5 rounded-xl border border-[#E7E5E4] font-medium transition-all cursor-pointer"
          >
            Classic 25/5
          </button>
          <button
            id="preset-short"
            type="button"
            disabled={disabled}
            onClick={() => loadPreset(15, 3, 10)}
            className="text-xs bg-white hover:bg-[#F5F5F4] disabled:opacity-50 text-[#44403C] px-3 py-1.5 rounded-xl border border-[#E7E5E4] font-medium transition-all cursor-pointer"
          >
            Sprint 15/3
          </button>
          <button
            id="preset-ultradian"
            type="button"
            disabled={disabled}
            onClick={() => loadPreset(50, 10, 20)}
            className="text-xs bg-white hover:bg-[#F5F5F4] disabled:opacity-50 text-[#44403C] px-3 py-1.5 rounded-xl border border-[#E7E5E4] font-medium transition-all cursor-pointer"
          >
            Ultradian 50/10
          </button>
        </div>
      </div>
    </div>
  );
};
