import React from 'react';
import { AlarmSound } from '../types';
import { playZenChime, playDigitalBeep } from '../utils/audio';
import { Volume2, Music, Check, Sparkles } from 'lucide-react';

interface AudioConfigProps {
  alarmSound: AlarmSound;
  setAlarmSound: (sound: AlarmSound) => void;
  volume: number;
  setVolume: (vol: number) => void;
  isDark?: boolean;
}

export const AudioConfig: React.FC<AudioConfigProps> = ({
  alarmSound,
  setAlarmSound,
  volume,
  setVolume,
  isDark = false,
}) => {
  const triggerTestSound = (sound: AlarmSound) => {
    if (sound === 'zen') {
      playZenChime(volume);
    } else if (sound === 'digital') {
      playDigitalBeep(volume);
    }
  };

  const handleSoundSelect = (sound: AlarmSound) => {
    setAlarmSound(sound);
    triggerTestSound(sound);
  };

  return (
    <div className={`transition-all duration-1000 border rounded-2xl p-6 space-y-5 ${
      isDark ? 'bg-[#111A36] border-[#1E294B]' : 'bg-white border-[#E7E5E4]'
    }`}>
      <div className="flex items-center gap-2">
        <Volume2 className={`w-4 h-4 transition-colors duration-1000 ${isDark ? 'text-[#94A3B8]' : 'text-[#1C1917]'}`} />
        <h2 className={`text-sm font-semibold tracking-tight font-display transition-colors duration-1000 ${
          isDark ? 'text-white' : 'text-[#1C1917]'
        }`}>Alert Notification Sound</h2>
      </div>

      <div className="space-y-4">
        {/* Sound Selection Grid */}
        <div className="grid grid-cols-3 gap-2">
          {(['zen', 'digital', 'none'] as AlarmSound[]).map((sound) => (
            <button
              id={`sound-btn-${sound}`}
              key={sound}
              type="button"
              onClick={() => handleSoundSelect(sound)}
              className={`relative py-3 px-2 rounded-xl text-center border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                alarmSound === sound
                  ? isDark
                    ? 'border-white bg-[#1E294B] text-white'
                    : 'border-[#1C1917] bg-[#F5F5F4] text-[#1C1917]'
                  : isDark
                    ? 'border-[#1E294B] bg-[#131C35] hover:bg-[#1E294B] text-[#94A3B8]'
                    : 'border-[#E7E5E4] bg-white hover:bg-[#F5F5F4] text-[#44403C]'
              }`}
            >
              {alarmSound === sound && (
                <span className={`absolute top-1 right-1 rounded-full p-0.5 transition-colors duration-1000 ${
                  isDark ? 'bg-white text-[#0A1128]' : 'bg-[#1C1917] text-white'
                }`}>
                  <Check className="w-2 h-2" />
                </span>
              )}
              <Music className={`w-3.5 h-3.5 transition-colors duration-1000 ${
                alarmSound === sound
                  ? isDark ? 'text-white' : 'text-[#1C1917]'
                  : isDark ? 'text-[#64748B]' : 'text-[#78716C]'
              }`} />
              <span className="capitalize font-medium text-[11px]">
                {sound === 'none' ? 'Mute' : sound + ' Chime'}
              </span>
            </button>
          ))}
        </div>

        {/* Volume Controls */}
        {alarmSound !== 'none' && (
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs font-medium">
              <span className={`transition-colors duration-1000 ${isDark ? 'text-[#94A3B8]' : 'text-[#78716C]'}`}>Alert Volume</span>
              <span className={`font-mono font-bold transition-colors duration-1000 ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>{volume}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="alarm-volume-slider"
                type="range"
                min="10"
                max="100"
                step="5"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value) || 80)}
                className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer transition-all duration-1000 ${
                  isDark ? 'bg-[#1E294B] accent-white' : 'bg-[#E7E5E4] accent-[#1C1917]'
                }`}
              />
              <button
                id="test-alarm-btn"
                type="button"
                onClick={() => triggerTestSound(alarmSound)}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white text-[#0A1128] hover:bg-slate-200'
                    : 'bg-[#1C1917] text-white hover:bg-[#44403C]'
                }`}
              >
                Test Sound
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
