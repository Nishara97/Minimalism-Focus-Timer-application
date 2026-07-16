import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Edit2 } from 'lucide-react';

interface FocusTaskProps {
  currentTask: string;
  setCurrentTask: (task: string) => void;
}

export const FocusTask: React.FC<FocusTaskProps> = ({
  currentTask,
  setCurrentTask,
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
    <div className="bg-white border border-[#E7E5E4] rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-[#1C1917]" />
        <span className="text-[10px] uppercase tracking-wider font-bold text-[#78716C] font-display">
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
            className="flex-1 bg-[#F5F5F4] border border-[#E7E5E4] text-sm rounded-xl px-3 py-2 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/5 focus:border-[#1C1917] transition-all font-sans"
            autoFocus
          />
          <button
            id="submit-goal-btn"
            type="submit"
            className="bg-[#1C1917] text-white hover:bg-[#44403C] px-4 py-2 text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Save
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between bg-[#F5F5F4] border border-[#E7E5E4]/55 rounded-xl p-3">
          <div className="flex items-center gap-2.5">
            {currentTask === 'General Focus' ? (
              <Circle className="w-4 h-4 text-[#D6D3D1]" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#1C1917]" />
            )}
            <span
              className={`text-sm font-medium ${
                currentTask === 'General Focus' ? 'text-[#78716C] italic' : 'text-[#1C1917]'
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
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-white rounded-lg transition-all border border-transparent hover:border-[#E7E5E4] cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {currentTask !== 'General Focus' && (
              <button
                id="clear-goal-btn"
                type="button"
                onClick={handleClear}
                className="text-[10px] text-[#78716C] hover:text-rose-600 font-bold px-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
