import React from 'react';
import { FocusSession } from '../types';
import { ClipboardList, Trash2, Calendar, Target, Award } from 'lucide-react';

interface SessionHistoryProps {
  history: FocusSession[];
  onClearHistory: () => void;
  isDark?: boolean;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  history,
  onClearHistory,
  isDark = false,
}) => {
  // Group by mode to count total work done
  const totalWorkSessions = history.filter(s => s.mode === 'WORK').length;
  const totalWorkMinutes = history
    .filter(s => s.mode === 'WORK')
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className={`transition-all duration-1000 border rounded-2xl p-6 space-y-6 ${
      isDark ? 'bg-[#111A36] border-[#1E294B]' : 'bg-white border-[#E7E5E4]'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className={`w-4 h-4 transition-colors duration-1000 ${isDark ? 'text-[#94A3B8]' : 'text-[#1C1917]'}`} />
          <h2 className={`text-sm font-semibold tracking-tight font-display transition-colors duration-1000 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>Completed Sessions</h2>
        </div>
        {history.length > 0 && (
          <button
            id="clear-history-btn"
            type="button"
            onClick={onClearHistory}
            className={`text-xs px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
              isDark
                ? 'text-[#94A3B8] bg-[#1E294B] hover:bg-[#24335C] border-[#1E294B] hover:text-rose-400'
                : 'text-[#1C1917] bg-[#F5F5F4] hover:bg-[#E7E5E4] border-[#E7E5E4]'
            }`}
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-xl p-3 text-center border transition-all duration-1000 ${
          isDark ? 'bg-[#131C35] border-[#1E294B]' : 'bg-[#F5F5F4] border border-[#E7E5E4]/50'
        }`}>
          <Target className={`w-4 h-4 mx-auto mb-1 transition-colors duration-1000 ${isDark ? 'text-white' : 'text-[#1C1917]'}`} />
          <span className={`block text-[9px] font-bold uppercase tracking-wider transition-colors duration-1000 ${
            isDark ? 'text-[#94A3B8]' : 'text-[#78716C]'
          }`}>Completed</span>
          <span className={`text-base font-extrabold font-mono transition-colors duration-1000 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>{totalWorkSessions}</span>
        </div>
        <div className={`rounded-xl p-3 text-center border transition-all duration-1000 ${
          isDark ? 'bg-[#131C35] border-[#1E294B]' : 'bg-[#F5F5F4] border border-[#E7E5E4]/50'
        }`}>
          <Calendar className={`w-4 h-4 mx-auto mb-1 transition-colors duration-1000 ${isDark ? 'text-white' : 'text-[#1C1917]'}`} />
          <span className={`block text-[9px] font-bold uppercase tracking-wider transition-colors duration-1000 ${
            isDark ? 'text-[#94A3B8]' : 'text-[#78716C]'
          }`}>Total Time</span>
          <span className={`text-base font-extrabold font-mono transition-colors duration-1000 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>{totalWorkMinutes}m</span>
        </div>
        <div className={`rounded-xl p-3 text-center border transition-all duration-1000 ${
          isDark ? 'bg-[#131C35] border-[#1E294B]' : 'bg-[#F5F5F4] border border-[#E7E5E4]/50'
        }`}>
          <Award className={`w-4 h-4 mx-auto mb-1 transition-colors duration-1000 ${isDark ? 'text-white' : 'text-[#1C1917]'}`} />
          <span className={`block text-[9px] font-bold uppercase tracking-wider transition-colors duration-1000 ${
            isDark ? 'text-[#94A3B8]' : 'text-[#78716C]'
          }`}>Streak</span>
          <span className={`text-base font-extrabold font-mono transition-colors duration-1000 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>{totalWorkSessions > 0 ? `${totalWorkSessions} 🔥` : '0'}</span>
        </div>
      </div>

      {/* History log */}
      {history.length === 0 ? (
        <div className={`text-center py-8 px-4 border border-dashed rounded-xl transition-all duration-1000 ${
          isDark ? 'bg-[#131C35]/40 border-[#1E294B]' : 'bg-[#F5F5F4]/40 border-[#E7E5E4]'
        }`}>
          <p className={`text-xs transition-colors duration-1000 ${isDark ? 'text-[#64748B]' : 'text-[#78716C]'}`}>
            Completed focus blocks will appear here to track your progress.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {history.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                isDark
                  ? 'bg-[#131C35] border-[#1E294B] hover:bg-[#1E294B]'
                  : 'bg-[#F5F5F4]/70 border border-[#E7E5E4]/30 hover:bg-[#F5F5F4]'
              }`}
            >
              <div className="space-y-0.5">
                <span className={`font-bold block transition-colors duration-1000 ${
                  isDark ? 'text-white' : 'text-[#1C1917]'
                }`}>
                  {session.mode === 'WORK' ? 'Focus Block' : session.mode === 'SHORT_BREAK' ? 'Short Break' : 'Long Break'}
                </span>
                {session.taskTitle && (
                  <span className={`text-[11px] line-clamp-1 transition-colors duration-1000 ${
                    isDark ? 'text-[#94A3B8]' : 'text-[#78716C]'
                  }`}>
                    🎯 Objective: {session.taskTitle}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className={`font-mono text-[11px] font-bold block transition-colors duration-1000 ${
                  isDark ? 'text-white' : 'text-[#1C1917]'
                }`}>
                  {session.durationMinutes}m
                </span>
                <span className={`text-[10px] font-mono transition-colors duration-1000 ${
                  isDark ? 'text-[#64748B]' : 'text-[#78716C]'
                }`}>
                  {session.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
