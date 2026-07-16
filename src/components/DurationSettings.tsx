import React from 'react';
import { TimerConfig } from '../types';
import { Sliders, Clock, Coffee, Sparkles } from 'lucide-react';

interface DurationSettingsProps {
  config: TimerConfig;
  onUpdateConfig: (newConfig: TimerConfig) => void;
  disabled?: boolean;
  isDark?: boolean;
}

export const DurationSettings: React.FC<DurationSettingsProps> = ({
  config,
  onUpdateConfig,
  disabled = false,
  isDark = false,
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
    <div className={`transition-all duration-1000 border rounded-2xl p-6 space-y-6 ${
      isDark ? 'bg-[#111A36] border-[#1E294B]' : 'bg-white border-[#E7E5E4]'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className={`w-4 h-4 transition-colors duration-1000 ${isDark ? 'text-[#94A3B8]' : 'text-[#1C1917]'}`} />
          <h2 className={`text-sm font-semibold tracking-tight font-display transition-colors duration-1000 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>Configure Intervals</h2>
        </div>
        {disabled && (
          <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold transition-all duration-1000 ${
            isDark ? 'text-rose-400 bg-rose-950/50 border border-rose-900/30' : 'text-rose-600 bg-rose-50'
          }`}>
            Running
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Work Duration Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className={`flex items-center gap-1.5 font-medium transition-colors duration-1000 ${
              isDark ? 'text-[#94A3B8]' : 'text-[#44403C]'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              Work Period
            </span>
            <span className={`font-mono px-1.5 py-0.5 rounded text-xs font-bold transition-all duration-1000 ${
              isDark ? 'text-white bg-[#1E294B]' : 'text-[#1C1917] bg-[#F5F5F4]'
            }`}>
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
            className={`w-full h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-50 transition-all duration-1000 ${
              isDark ? 'bg-[#1E294B] accent-white' : 'bg-[#E7E5E4] accent-[#1C1917]'
            }`}
          />
          <div className={`flex justify-between text-[10px] font-mono transition-colors duration-1000 ${
            isDark ? 'text-[#64748B]' : 'text-[#A8A29E]'
          }`}>
            <span>1m</span>
            <span>25m</span>
            <span>60m</span>
            <span>120m</span>
          </div>
        </div>

        {/* Short Break Duration */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className={`flex items-center gap-1.5 font-medium transition-colors duration-1000 ${
              isDark ? 'text-[#94A3B8]' : 'text-[#44403C]'
            }`}>
              <Coffee className="w-3.5 h-3.5" />
              Short Break
            </span>
            <span className={`font-mono px-1.5 py-0.5 rounded text-xs font-bold transition-all duration-1000 ${
              isDark ? 'text-white bg-[#1E294B]' : 'text-[#1C1917] bg-[#F5F5F4]'
            }`}>
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
            className={`w-full h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-50 transition-all duration-1000 ${
              isDark ? 'bg-[#1E294B] accent-white' : 'bg-[#E7E5E4] accent-[#1C1917]'
            }`}
          />
          <div className={`flex justify-between text-[10px] font-mono transition-colors duration-1000 ${
            isDark ? 'text-[#64748B]' : 'text-[#A8A29E]'
          }`}>
            <span>1m</span>
            <span>5m</span>
            <span>15m</span>
            <span>30m</span>
          </div>
        </div>

        {/* Long Break Duration */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className={`flex items-center gap-1.5 font-medium transition-colors duration-1000 ${
              isDark ? 'text-[#94A3B8]' : 'text-[#44403C]'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              Long Break
            </span>
            <span className={`font-mono px-1.5 py-0.5 rounded text-xs font-bold transition-all duration-1000 ${
              isDark ? 'text-white bg-[#1E294B]' : 'text-[#1C1917] bg-[#F5F5F4]'
            }`}>
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
            className={`w-full h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-50 transition-all duration-1000 ${
              isDark ? 'bg-[#1E294B] accent-white' : 'bg-[#E7E5E4] accent-[#1C1917]'
            }`}
          />
          <div className={`flex justify-between text-[10px] font-mono transition-colors duration-1000 ${
            isDark ? 'text-[#64748B]' : 'text-[#A8A29E]'
          }`}>
            <span>1m</span>
            <span>15m</span>
            <span>30m</span>
            <span>45m</span>
          </div>
        </div>

        {/* Long Break Interval */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className={`transition-colors duration-1000 ${isDark ? 'text-[#94A3B8]' : 'text-[#44403C]'}`}>Long Break Frequency</span>
            <span className={`font-mono px-1.5 py-0.5 rounded text-xs font-bold transition-all duration-1000 ${
              isDark ? 'text-white bg-[#1E294B]' : 'text-[#1C1917] bg-[#F5F5F4]'
            }`}>
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
                    ? isDark
                      ? 'bg-white text-[#0A1128]'
                      : 'bg-[#1C1917] text-white'
                    : isDark
                      ? 'bg-[#1E294B] hover:bg-[#24335C] text-[#94A3B8] disabled:opacity-50'
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
      <div className={`pt-4 border-t transition-colors duration-1000 ${isDark ? 'border-[#1E294B]' : 'border-[#E7E5E4]'}`}>
        <span className={`block text-[10px] uppercase tracking-widest font-bold mb-2 transition-colors duration-1000 ${
          isDark ? 'text-[#64748B]' : 'text-[#A8A29E]'
        }`}>Preset Formats</span>
        <div className="flex flex-wrap gap-2">
          <button
            id="preset-classic"
            type="button"
            disabled={disabled}
            onClick={() => loadPreset(25, 5, 15)}
            className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
              isDark
                ? 'bg-[#131C35] hover:bg-[#1E294B] text-[#94A3B8] border-[#1E294B] hover:text-white disabled:opacity-50'
                : 'bg-white hover:bg-[#F5F5F4] text-[#44403C] border-[#E7E5E4] disabled:opacity-50'
            }`}
          >
            Classic 25/5
          </button>
          <button
            id="preset-short"
            type="button"
            disabled={disabled}
            onClick={() => loadPreset(15, 3, 10)}
            className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
              isDark
                ? 'bg-[#131C35] hover:bg-[#1E294B] text-[#94A3B8] border-[#1E294B] hover:text-white disabled:opacity-50'
                : 'bg-white hover:bg-[#F5F5F4] text-[#44403C] border-[#E7E5E4] disabled:opacity-50'
            }`}
          >
            Sprint 15/3
          </button>
          <button
            id="preset-ultradian"
            type="button"
            disabled={disabled}
            onClick={() => loadPreset(50, 10, 20)}
            className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
              isDark
                ? 'bg-[#131C35] hover:bg-[#1E294B] text-[#94A3B8] border-[#1E294B] hover:text-white disabled:opacity-50'
                : 'bg-white hover:bg-[#F5F5F4] text-[#44403C] border-[#E7E5E4] disabled:opacity-50'
            }`}
          >
            Ultradian 50/10
          </button>
        </div>
      </div>
    </div>
  );
};
