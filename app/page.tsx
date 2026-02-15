'use client';

import { useState, useEffect } from 'react';
import TodayTab from './components/TodayTab';
import HistoryTab from './components/HistoryTab';
import { GratitudeEntry, loadData, saveData, calculateStreak } from './lib/storage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    const data = loadData();
    setEntries(data.entries);
    const streak = calculateStreak(data.entries);
    setCurrentStreak(streak);
  }, []);

  const handleSaveEntry = (entry: GratitudeEntry) => {
    const updatedEntries = [...entries.filter(e => e.date !== entry.date), entry];
    setEntries(updatedEntries);
    saveData({ entries: updatedEntries });
    const streak = calculateStreak(updatedEntries);
    setCurrentStreak(streak);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-lavender-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daily Gratitude</h1>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })} ☀️
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-purple-600">{currentStreak}</div>
            <div className="text-sm text-gray-600">day streak 🔥</div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex border-b-2 border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-3 font-medium text-lg transition-colors ${
              activeTab === 'today'
                ? 'text-purple-600 border-b-3 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === 'today' ? { borderBottom: '3px solid #9333ea' } : {}}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 font-medium text-lg transition-colors ${
              activeTab === 'history'
                ? 'text-purple-600 border-b-3 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === 'history' ? { borderBottom: '3px solid #9333ea' } : {}}
          >
            History
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'today' ? (
          <TodayTab 
            entries={entries}
            onSave={handleSaveEntry}
          />
        ) : (
          <HistoryTab entries={entries} />
        )}
      </div>
    </div>
  );
}
