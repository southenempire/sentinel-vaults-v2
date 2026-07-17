import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LogResult = 'approved' | 'blocked' | 'info';

export interface LogEntry {
  id: string;
  time: string;
  vault: string;
  action: string;
  result: LogResult;
  reason: string;
}

interface LogContextType {
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, 'id' | 'time'>) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (entry: Omit<LogEntry, 'id' | 'time'>) => {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    
    setLogs(prev => [{ ...entry, id, time }, ...prev]);
  };

  const clearLogs = () => setLogs([]);

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
}
