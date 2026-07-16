import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Edit2 } from 'lucide-react';

interface FocusTaskProps {
  currentTask: string;
  setCurrentTask: (task: string) => void;
  isDark?: boolean;
}

export const FocusTask: React.FC<FocusTaskProps> = ({
  currentTask,
  setCurrentTask,
  isDark = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(currentTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanVal = inputValue.trim();
    setCurrentTask(cleanVal || 'General Focus');
    setIsEditing(false);
  };

  const handleClear = () => {
    setCurrentTask('General Focus');
    setInputValue('');
  };

  return (
    <div className={`transition-all duration-1000 border rounded-2xl p-5 space-y-3 ${
      isDark ? 'bg-[#111A36] border-[#1E294B]' : 'bg-white border-[#E7E5E4]'
    }`}>
      <div className="flex items-center gap-2">
        <Target className={`w-4 h-4 transition-colors duration-1000 ${isDark ? 'text-white' : 'text-[#1C1917]'}`} />
        <span className={`text-[10px] uppercase tracking-wider font-bold font-display transition-colors duration-1000 ${
          isDark ? 'text-[#94A3B8]' : 'text-[#78716C]'
        }`}>
          Current Focus Goal
        </span>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            id="focus-goal-input"
            type="text"
            placeholder="e.g., Design UI prototype..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`flex-1 text-sm rounded-xl px-3 py-2 transition-all font-sans focus:outline-none focus:ring-2 ${
              isDark
                ? 'bg-[#131C35] border border-[#1E294B] text-white placeholder:text-[#64748B] focus:ring-[#E11D48]/10 focus:border-[#E11D48]'
                : 'bg-[#F5F5F4] border border-[#E7E5E4] text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-[#1C1917]/5 focus:border-[#1C1917]'
            }`}
            autoFocus
          />
          <button
            id="submit-goal-btn"
            type="submit"
            className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer ${
              isDark
                ? 'bg-white text-[#0A1128] hover:bg-slate-200'
                : 'bg-[#1C1917] text-white hover:bg-[#44403C]'
            }`}
          >
            Save
          </button>
        </form>
      ) : (
        <div className={`flex items-center justify-between border rounded-xl p-3 transition-colors duration-1000 ${
          isDark ? 'bg-[#131C35] border-[#1E294B]' : 'bg-[#F5F5F4] border border-[#E7E5E4]/55'
        }`}>
          <div className="flex items-center gap-2.5">
            {currentTask === 'General Focus' ? (
              <Circle className={`w-4 h-4 transition-colors duration-1000 ${isDark ? 'text-[#334155]' : 'text-[#D6D3D1]'}`} />
            ) : (
              <CheckCircle2 className={`w-4 h-4 transition-colors duration-1000 ${isDark ? 'text-emerald-400' : 'text-[#1C1917]'}`} />
            )}
            <span
              className={`text-sm font-medium transition-colors duration-1000 ${
                currentTask === 'General Focus'
                  ? isDark ? 'text-[#64748B] italic' : 'text-[#78716C] italic'
                  : isDark ? 'text-white' : 'text-[#1C1917]'
              }`}
            >
              {currentTask}
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              id="edit-goal-btn"
              type="button"
              onClick={() => {
                setInputValue(currentTask === 'General Focus' ? '' : currentTask);
                setIsEditing(true);
              }}
              className={`p-1.5 rounded-lg transition-all border cursor-pointer ${
                isDark
                  ? 'text-[#94A3B8] hover:text-white hover:bg-[#1E294B] border-transparent hover:border-[#24335C]'
                  : 'text-[#78716C] hover:text-[#1C1917] hover:bg-white border-transparent hover:border-[#E7E5E4]'
              }`}
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {currentTask !== 'General Focus' && (
              <button
                id="clear-goal-btn"
                type="button"
                onClick={handleClear}
                className={`text-[10px] font-bold px-2 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? 'text-[#94A3B8] hover:text-rose-400 hover:bg-[#E11D48]/10'
                    : 'text-[#78716C] hover:text-rose-600 hover:bg-rose-50'
                }`}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
