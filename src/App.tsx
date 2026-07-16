import { useState, useEffect, useRef } from 'react';
import { TimerMode, TimerConfig, FocusSession, AlarmSound } from './types';
import { DurationSettings } from './components/DurationSettings';
import { SessionHistory } from './components/SessionHistory';
import { AudioConfig } from './components/AudioConfig';
import { FocusTask } from './components/FocusTask';
import { playZenChime, playDigitalBeep } from './utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Flame,
  Sparkles,
  Coffee,
  BrainCircuit,
  VolumeX,
  Volume2,
  Sun,
  Moon
} from 'lucide-react';

export default function App() {
  // --- Theme State ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('focus-theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('focus-theme', theme);
  }, [theme]);

  const isDark = theme === 'dark';

  // --- 1. Configuration & Initial States ---
  const [config, setConfig] = useState<TimerConfig>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
  });

  const [mode, setMode] = useState<TimerMode>('WORK');
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<string>('General Focus');
  const [history, setHistory] = useState<FocusSession[]>([]);
  
  // Audio Preferences
  const [alarmSound, setAlarmSound] = useState<AlarmSound>('zen');
  const [volume, setVolume] = useState<number>(80);

  // Ref to track expected end time to completely prevent background tab throttling drift.
  const expectedEndTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // --- 2. Timer Calculation Hook ---
  // Calculates expected end time when toggling play/pause or changing durations
  useEffect(() => {
    if (isRunning) {
      const now = Date.now();
      expectedEndTimeRef.current = now + secondsLeft * 1000;

      const tick = () => {
        const remainingMs = (expectedEndTimeRef.current ?? 0) - Date.now();
        const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
        
        if (remainingSeconds <= 0) {
          handleTimerComplete();
        } else {
          setSecondsLeft(remainingSeconds);
        }
      };

      timerIntervalRef.current = window.setInterval(tick, 200) as unknown as number;
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      expectedEndTimeRef.current = null;
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning]);

  // Handle duration config changes when not running
  useEffect(() => {
    if (!isRunning) {
      const activeDuration =
        mode === 'WORK'
          ? config.workDuration
          : mode === 'SHORT_BREAK'
          ? config.shortBreakDuration
          : config.longBreakDuration;
      setSecondsLeft(activeDuration * 60);
    }
  }, [config, mode]);

  // --- 3. Dynamic Page Title Updates ---
  useEffect(() => {
    const min = Math.floor(secondsLeft / 60);
    const sec = secondsLeft % 60;
    const formattedTime = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    
    let prefix = 'Focus';
    if (mode === 'SHORT_BREAK') prefix = 'Short Break ☕';
    if (mode === 'LONG_BREAK') prefix = 'Long Break 🌴';

    document.title = `${formattedTime} | ${prefix}`;
  }, [secondsLeft, mode]);

  // --- 4. Timer State Handlers ---
  const togglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const activeDuration =
      mode === 'WORK'
        ? config.workDuration
        : mode === 'SHORT_BREAK'
        ? config.shortBreakDuration
        : config.longBreakDuration;
    setSecondsLeft(activeDuration * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    determineNextMode();
  };

  const selectModeManually = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    const activeDuration =
      newMode === 'WORK'
        ? config.workDuration
        : newMode === 'SHORT_BREAK'
        ? config.shortBreakDuration
        : config.longBreakDuration;
    setSecondsLeft(activeDuration * 60);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play alert sound
    if (alarmSound === 'zen') {
      playZenChime(volume);
    } else if (alarmSound === 'digital') {
      playDigitalBeep(volume);
    }

    // Add completed session log
    const completedDuration =
      mode === 'WORK'
        ? config.workDuration
        : mode === 'SHORT_BREAK'
        ? config.shortBreakDuration
        : config.longBreakDuration;

    const newSession: FocusSession = {
      id: Math.random().toString(36).substring(2, 11),
      mode,
      durationMinutes: completedDuration,
      completedAt: new Date(),
      taskTitle: mode === 'WORK' ? currentTask : undefined,
    };

    setHistory((prev) => [newSession, ...prev]);

    // Transition to next state
    determineNextMode();
  };

  const determineNextMode = () => {
    if (mode === 'WORK') {
      // Calculate how many WORK sessions completed so far
      const workSessionsCompleted = history.filter((s) => s.mode === 'WORK').length + 1;
      
      if (workSessionsCompleted % config.longBreakInterval === 0) {
        setMode('LONG_BREAK');
      } else {
        setMode('SHORT_BREAK');
      }
    } else {
      // Finished break, return to focus mode
      setMode('WORK');
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // --- 5. Helper Calculations (SVG progress) ---
  const activeTotalMinutes =
    mode === 'WORK'
      ? config.workDuration
      : mode === 'SHORT_BREAK'
      ? config.shortBreakDuration
      : config.longBreakDuration;
  
  const totalDurationSeconds = activeTotalMinutes * 60;
  const progressRatio = secondsLeft / totalDurationSeconds;

  // Circle stroke offset math: Radius of 135px -> Circumference is ~848.23px
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Color configurations based on active state
  const colors = {
    WORK: {
      accent: 'stroke-[#E11D48] text-[#E11D48]',
      progress: 'stroke-[#E11D48]',
      badge: isDark
        ? 'bg-[#E11D48]/25 text-rose-200 border-[#E11D48]/40'
        : 'bg-rose-50 text-rose-700 border-rose-100',
    },
    SHORT_BREAK: {
      accent: isDark ? 'stroke-emerald-400 text-emerald-400' : 'stroke-emerald-600 text-emerald-600',
      progress: isDark ? 'stroke-emerald-400' : 'stroke-emerald-600',
      badge: isDark
        ? 'bg-emerald-500/25 text-emerald-200 border-emerald-500/40'
        : 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    LONG_BREAK: {
      accent: isDark ? 'stroke-sky-400 text-sky-400' : 'stroke-sky-600 text-sky-600',
      progress: isDark ? 'stroke-sky-400' : 'stroke-sky-600',
      badge: isDark
        ? 'bg-sky-500/25 text-sky-200 border-sky-500/40'
        : 'bg-sky-50 text-sky-700 border-sky-100',
    }
  };

  const activeColor = colors[mode];

  return (
    <div className={`min-h-screen transition-colors duration-1000 p-4 md:p-8 font-sans flex flex-col justify-between relative overflow-hidden ${
      isDark ? 'bg-[#0A1128] text-[#F1F5F9]' : 'bg-[#FAFAF9] text-[#1C1917]'
    }`}>
      
      {/* Background Graphic Decor (Minimalist) */}
      <div className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none transition-all duration-1000 ${
        isDark ? 'bg-[#1E3A8A] opacity-35' : 'bg-[#FCE7F3] opacity-20'
      }`}></div>
      <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none transition-all duration-1000 ${
        isDark ? 'bg-[#0EA5E9] opacity-30' : 'bg-[#E0F2FE] opacity-20'
      }`}></div>

      {/* Top Header Row */}
      <header className={`max-w-6xl mx-auto w-full flex justify-between items-center py-4 px-2 relative z-10 border-b transition-colors duration-1000 ${
        isDark ? 'border-[#1E294B]' : 'border-[#E7E5E4]/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#E11D48] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold font-mono">F</span>
          </div>
          <div>
            <h1 className={`text-lg font-bold tracking-tight font-display transition-colors duration-1000 ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}>FocusFlow</h1>
            <span className={`text-[9px] uppercase tracking-widest font-mono transition-colors duration-1000 ${
              isDark ? 'text-[#94A3B8]' : 'text-[#78716C]'
            }`}>Pomodoro Sandbox</span>
          </div>
        </div>

        {/* Navigation tabs - Decorative Clean Minimalism navigation links */}
        <div className={`hidden md:flex gap-6 text-sm font-medium transition-colors duration-1000 ${
          isDark ? 'text-[#94A3B8]' : 'text-[#78716C]'
        }`}>
          <span className={`border-b-2 pb-1 cursor-default transition-colors duration-1000 ${
            isDark ? 'border-[#E11D48] text-white' : 'border-[#E11D48] text-[#1C1917]'
          }`}>Timer</span>
          <span className={`pb-1 transition-colors duration-1000 cursor-pointer ${
            isDark ? 'hover:text-white' : 'hover:text-[#1C1917]'
          }`}>Analytics</span>
          <span className={`pb-1 transition-colors duration-1000 cursor-pointer ${
            isDark ? 'hover:text-white' : 'hover:text-[#1C1917]'
          }`}>Settings</span>
        </div>

        {/* Right Header Side: Theme Switcher & Streak Counter */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center ${
              isDark
                ? 'bg-[#131C35] border-[#1E294B] text-yellow-400 hover:bg-[#1E294B] hover:scale-105 active:scale-95'
                : 'bg-white border-[#E7E5E4] text-[#44403C] hover:bg-[#F5F5F4] hover:scale-105 active:scale-95'
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Deep Sea Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Dynamic Streak Indicator */}
          <div className={`flex items-center gap-1.5 shadow-sm px-3 py-1.5 rounded-xl border transition-all duration-1000 ${
            isDark
              ? 'bg-[#131C35] border-[#1E294B]'
              : 'bg-white border-[#E7E5E4]'
          }`}>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className={`text-xs font-bold font-mono transition-colors duration-1000 ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}>
              {history.filter((s) => s.mode === 'WORK').length} Streak
            </span>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-6xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start my-6 md:my-10 relative z-10">
        
        {/* LEFT COLUMN: FOCUS TIMER CARD (Spans 7 of 12 columns on large) */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          
          {/* Main Focus Control Container */}
          <div className={`rounded-3xl p-8 flex flex-col items-center relative overflow-hidden shadow-sm transition-all duration-1000 ${
            isDark ? 'bg-[#111A36] border border-[#1E294B]' : 'bg-white border border-[#E7E5E4]'
          }`}>
            
            {/* Sub-Header Mode Selectors */}
            <div className={`flex gap-1 p-1 rounded-2xl mb-8 w-full max-w-sm transition-all duration-1000 ${
              isDark ? 'bg-[#1E294B] border border-[#24335C]' : 'bg-[#F5F5F4] border border-[#E7E5E4]'
            }`}>
              {(['WORK', 'SHORT_BREAK', 'LONG_BREAK'] as TimerMode[]).map((tabMode) => (
                <button
                  id={`mode-tab-${tabMode}`}
                  key={tabMode}
                  type="button"
                  onClick={() => selectModeManually(tabMode)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === tabMode
                      ? isDark
                        ? 'bg-[#111A36] text-white shadow-sm'
                        : 'bg-white text-[#1C1917] shadow-sm'
                      : isDark
                        ? 'text-[#94A3B8] hover:text-white'
                        : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  {tabMode === 'WORK' ? 'Focus' : tabMode === 'SHORT_BREAK' ? 'Short Break' : 'Long Break'}
                </button>
              ))}
            </div>

            {/* Circular SVG Timer Container */}
            <div className="relative w-[300px] h-[300px] flex items-center justify-center select-none">
              
              {/* Animated Progress Ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
                {/* Underlay Track */}
                <circle
                  cx="150"
                  cy="150"
                  r={radius}
                  className={`fill-none transition-colors duration-1000 ${
                    isDark ? 'stroke-[#1E294B]' : 'stroke-[#F5F5F4]'
                  }`}
                  strokeWidth="4"
                />
                {/* Active Progress Overlay */}
                <motion.circle
                  cx="150"
                  cy="150"
                  r={radius}
                  className={`fill-none stroke-linecap-round ${activeColor.progress}`}
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ ease: 'linear', duration: 0.2 }}
                />
              </svg>

              {/* Central Time Typography Content */}
              <div className="absolute text-center flex flex-col items-center">
                {/* Active Interval Badge */}
                <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border mb-1.5 transition-colors duration-1000 ${activeColor.badge}`}>
                  {mode === 'WORK' ? 'FOCUS BLOCK' : mode === 'SHORT_BREAK' ? 'SHORT BREAK' : 'LONG BREAK'}
                </span>

                {/* Massive Timer Clock */}
                <span className={`text-6xl font-extrabold tracking-tight font-mono leading-none py-1 tabular-nums transition-colors duration-1000 ${
                  isDark ? 'text-white' : 'text-[#1C1917]'
                }`}>
                  {formatTime(secondsLeft)}
                </span>

                {/* Current Target indicator inside loop */}
                <div className="max-w-[180px] mt-1 text-center">
                  <span className={`text-[11px] font-bold uppercase tracking-wide block line-clamp-1 transition-colors duration-1000 ${
                    isDark ? 'text-[#94A3B8]' : 'text-[#78716C]'
                  }`}>
                    {mode === 'WORK' ? `${currentTask}` : 'Relax & Recharge'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Tag Label */}
            <div className={`mt-4 text-[10px] uppercase tracking-[0.4em] font-bold transition-colors duration-1000 ${
              isDark ? 'text-[#94A3B8]' : 'text-[#78716C]'
            }`}>
              {mode === 'WORK' ? 'Focus Phase' : mode === 'SHORT_BREAK' ? 'Short Break' : 'Long Break'}
            </div>

            {/* Dynamic Pause / Play Controls */}
            <div className="flex items-center gap-6 mt-8">
              {/* Reset button */}
              <button
                id="reset-timer-btn"
                type="button"
                onClick={handleReset}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isDark
                    ? 'border border-[#24335C] bg-[#131C35] hover:bg-[#1E294B] text-[#94A3B8] hover:text-white'
                    : 'border border-[#D6D3D1] hover:bg-[#F5F5F4] text-[#44403C]'
                }`}
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Main Play Toggle Button */}
              <button
                id="toggle-timer-btn"
                type="button"
                onClick={togglePlay}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-[#F1F5F9] text-[#0A1128] hover:bg-white hover:shadow-[#F1F5F9]/10'
                    : 'bg-[#1C1917] text-white hover:bg-[#44403C]'
                }`}
                title={isRunning ? 'Pause' : 'Start'}
              >
                {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
              </button>

              {/* Fast-forward Skip Mode button */}
              <button
                id="skip-timer-btn"
                type="button"
                onClick={handleSkip}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isDark
                    ? 'border border-[#24335C] bg-[#131C35] hover:bg-[#1E294B] text-[#94A3B8] hover:text-white'
                    : 'border border-[#D6D3D1] hover:bg-[#F5F5F4] text-[#44403C]'
                }`}
                title="Skip Interval"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Current focus target tracker widget */}
          <FocusTask currentTask={currentTask} setCurrentTask={setCurrentTask} isDark={isDark} />
        </div>

        {/* RIGHT COLUMN: CUSTOMIZATION & CONFIGURATIONS (Spans 5 of 12 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          {/* Custom Duration Intervals Settings Panel */}
          <DurationSettings
            config={config}
            onUpdateConfig={setConfig}
            disabled={isRunning}
            isDark={isDark}
          />

          {/* Sound, Test tones and Volume Control Settings Panel */}
          <AudioConfig
            alarmSound={alarmSound}
            setAlarmSound={setAlarmSound}
            volume={volume}
            setVolume={setVolume}
            isDark={isDark}
          />

          {/* Session logs log history */}
          <SessionHistory
            history={history}
            onClearHistory={handleClearHistory}
            isDark={isDark}
          />
        </div>
      </main>

      {/* Modern Compact Footer */}
      <footer className={`max-w-6xl mx-auto w-full text-center py-6 text-[10px] font-mono border-t mt-6 flex flex-col md:flex-row justify-between items-center gap-2 px-2 relative z-10 transition-colors duration-1000 ${
        isDark ? 'border-[#1E294B] text-[#94A3B8]' : 'border-[#E7E5E4]/50 text-[#78716C]'
      }`}>
        <span>© 2026 FocusFlow. Clean Minimalist Pomodoro Workspace.</span>
        <div className="flex gap-4">
          <span>Local Storage Persistence</span>
          <span>•</span>
          <span>Web Audio Alerts</span>
        </div>
      </footer>
    </div>
  );
}
