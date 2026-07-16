import React from 'react';
import { FocusSession } from '../types';
import { ClipboardList, Trash2, Calendar, Target, Award } from 'lucide-react';

interface SessionHistoryProps {
  history: FocusSession[];
  onClearHistory: () => void;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  // Group by mode to count total work done
  const totalWorkSessions = history.filter(s => s.mode === 'WORK').length;
  const totalWorkMinutes = history
    .filter(s => s.mode === 'WORK')
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#1C1917]" />
          <h2 className="text-sm font-semibold tracking-tight text-[#1C1917] font-display">Completed Sessions</h2>
        </div>
        {history.length > 0 && (
          <button
            id="clear-history-btn"
            type="button"
            onClick={onClearHistory}
            className="text-xs text-[#1C1917] bg-[#F5F5F4] hover:bg-[#E7E5E4] px-2.5 py-1.5 rounded-xl border border-[#E7E5E4] flex items-center gap-1.5 font-bold transition-all cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#F5F5F4] rounded-xl p-3 text-center border border-[#E7E5E4]/50">
          <Target className="w-4 h-4 mx-auto text-[#1C1917] mb-1" />
          <span className="block text-[9px] text-[#78716C] font-bold uppercase tracking-wider">Completed</span>
          <span className="text-base font-extrabold text-[#1C1917] font-mono">{totalWorkSessions}</span>
        </div>
        <div className="bg-[#F5F5F4] rounded-xl p-3 text-center border border-[#E7E5E4]/50">
          <Calendar className="w-4 h-4 mx-auto text-[#1C1917] mb-1" />
          <span className="block text-[9px] text-[#78716C] font-bold uppercase tracking-wider">Total Time</span>
          <span className="text-base font-extrabold text-[#1C1917] font-mono">{totalWorkMinutes}m</span>
        </div>
        <div className="bg-[#F5F5F4] rounded-xl p-3 text-center border border-[#E7E5E4]/50">
          <Award className="w-4 h-4 mx-auto text-[#1C1917] mb-1" />
          <span className="block text-[9px] text-[#78716C] font-bold uppercase tracking-wider">Streak</span>
          <span className="text-base font-extrabold text-[#1C1917] font-mono">{totalWorkSessions > 0 ? `${totalWorkSessions} 🔥` : '0'}</span>
        </div>
      </div>

      {/* History log */}
      {history.length === 0 ? (
        <div className="text-center py-8 px-4 bg-[#F5F5F4]/40 border border-dashed border-[#E7E5E4] rounded-xl">
          <p className="text-xs text-[#78716C]">Completed focus blocks will appear here to track your progress.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {history.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F4]/70 border border-[#E7E5E4]/30 text-xs transition-all hover:bg-[#F5F5F4]"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-[#1C1917] block">
                  {session.mode === 'WORK' ? 'Focus Block' : session.mode === 'SHORT_BREAK' ? 'Short Break' : 'Long Break'}
                </span>
                {session.taskTitle && (
                  <span className="text-[11px] text-[#78716C] line-clamp-1">
                    🎯 Objective: {session.taskTitle}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="font-mono text-[11px] font-bold text-[#1C1917] block">
                  {session.durationMinutes}m
                </span>
                <span className="text-[10px] text-[#78716C] font-mono">
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
