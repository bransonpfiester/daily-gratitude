'use client';

import { useMemo, useState } from 'react';
import TodayTab from './components/TodayTab';
import HistoryTab from './components/HistoryTab';
import { GratitudeEntry, getTodayEntry, loadData, saveData, calculateStreak } from './lib/storage';

function getInitialEntries(): GratitudeEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  return loadData().entries;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [entries, setEntries] = useState<GratitudeEntry[]>(getInitialEntries);

  const currentStreak = useMemo(() => calculateStreak(entries), [entries]);
  const todayEntry = useMemo(() => getTodayEntry(entries), [entries]);

  const handleSaveEntry = (entry: GratitudeEntry) => {
    const updatedEntries = [...entries.filter((savedEntry) => savedEntry.date !== entry.date), entry];
    setEntries(updatedEntries);
    saveData({ entries: updatedEntries });
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#E9D5FF_0%,#FBE0FF_100%)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Gratitude Journal</h1>
              <p className="mt-1 text-sm text-gray-600 sm:text-base">{todayDate}</p>
            </div>
            <div className="rounded-xl bg-purple-50 px-4 py-2 text-right">
              <p className="text-2xl font-bold text-purple-700 sm:text-3xl">{currentStreak}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-purple-700 sm:text-sm">Day Streak</p>
            </div>
          </div>
        </header>

        <nav className="mb-5 flex rounded-xl bg-white p-1 shadow-sm" aria-label="Journal navigation tabs">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition sm:text-base ${
              activeTab === 'today' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-purple-50'
            }`}
            type="button"
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition sm:text-base ${
              activeTab === 'history' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-purple-50'
            }`}
            type="button"
          >
            History
          </button>
        </nav>

        {activeTab === 'today' ? (
          <TodayTab key={todayEntry?.id ?? 'today-empty'} todayEntry={todayEntry} onSave={handleSaveEntry} />
        ) : (
          <HistoryTab entries={entries} />
        )}
      </div>
    </main>
  );
}
