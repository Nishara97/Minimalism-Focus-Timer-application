export type TimerMode = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';

export interface TimerConfig {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // sessions before long break
}

export interface FocusSession {
  id: string;
  mode: TimerMode;
  durationMinutes: number;
  completedAt: Date;
  taskTitle?: string;
}

export type AlarmSound = 'zen' | 'digital' | 'none';
