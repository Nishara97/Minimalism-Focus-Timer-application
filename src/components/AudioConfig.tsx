import React from 'react';
import { AlarmSound } from '../types';
import { playZenChime, playDigitalBeep } from '../utils/audio';
import { Volume2, Music, Check, Sparkles } from 'lucide-react';

interface AudioConfigProps {
  alarmSound: AlarmSound;
  setAlarmSound: (sound: AlarmSound) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

export const AudioConfig: React.FC<AudioConfigProps> = ({
  alarmSound,
  setAlarmSound,
  volume,
  setVolume,
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
    <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-[#1C1917]" />
        <h2 className="text-sm font-semibold tracking-tight text-[#1C1917] font-display">Alert Notification Sound</h2>
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
                  ? 'border-[#1C1917] bg-[#F5F5F4] text-[#1C1917]'
                  : 'border-[#E7E5E4] bg-white hover:bg-[#F5F5F4] text-[#44403C]'
              }`}
            >
              {alarmSound === sound && (
                <span className="absolute top-1 right-1 bg-[#1C1917] text-white rounded-full p-0.5">
                  <Check className="w-2 h-2" />
                </span>
              )}
              <Music className={`w-3.5 h-3.5 ${alarmSound === sound ? 'text-[#1C1917]' : 'text-[#78716C]'}`} />
              <span className="capitalize font-medium text-[11px]">
                {sound === 'none' ? 'Mute' : sound + ' Chime'}
              </span>
            </button>
          ))}
        </div>

        {/* Volume Controls */}
        {alarmSound !== 'none' && (
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs text-[#78716C] font-medium">
              <span>Alert Volume</span>
              <span className="font-mono text-[#1C1917] font-bold">{volume}%</span>
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
                className="flex-1 h-1 bg-[#E7E5E4] rounded-lg appearance-none cursor-pointer accent-[#1C1917]"
              />
              <button
                id="test-alarm-btn"
                type="button"
                onClick={() => triggerTestSound(alarmSound)}
                className="text-xs bg-[#1C1917] text-white font-medium px-2.5 py-1.5 rounded-lg hover:bg-[#44403C] transition-all cursor-pointer"
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
