'use client';

import { useState, useEffect } from 'react';
import { GratitudeEntry, getTodayEntry, createEntry } from '../lib/storage';

interface TodayTabProps {
  entries: GratitudeEntry[];
  onSave: (entry: GratitudeEntry) => void;
}

export default function TodayTab({ entries, onSave }: TodayTabProps) {
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [intention, setIntention] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const todayEntry = getTodayEntry(entries);
    if (todayEntry) {
      setGratitude1(todayEntry.gratitude1);
      setGratitude2(todayEntry.gratitude2);
      setGratitude3(todayEntry.gratitude3);
      setIntention(todayEntry.intention);
      setAffirmation(todayEntry.affirmation);
    }
  }, [entries]);

  const handleSave = () => {
    setIsSaving(true);
    
    const todayEntry = getTodayEntry(entries);
    const entry = createEntry({
      id: todayEntry?.id,
      gratitude1,
      gratitude2,
      gratitude3,
      intention,
      affirmation,
    });
    
    onSave(entry);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Card 1: Gratitude */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">🙏 I am grateful for...</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={gratitude1}
            onChange={(e) => setGratitude1(e.target.value)}
            placeholder="1. Something you're grateful for"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
          />
          <input
            type="text"
            value={gratitude2}
            onChange={(e) => setGratitude2(e.target.value)}
            placeholder="2. Another thing you're grateful for"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
          />
          <input
            type="text"
            value={gratitude3}
            onChange={(e) => setGratitude3(e.target.value)}
            placeholder="3. One more thing you're grateful for"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Card 2: Intention */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">✨ What would make today great?</h2>
        <textarea
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="What are you looking forward to today?"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors resize-none text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Card 3: Affirmation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">💜 Daily affirmation</h2>
        <textarea
          value={affirmation}
          onChange={(e) => setAffirmation(e.target.value)}
          placeholder="A positive affirmation for yourself"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors resize-none text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : showSuccess ? (
          <span className="flex items-center justify-center">
            ✓ Saved!
          </span>
        ) : (
          'Save Entry'
        )}
      </button>
    </div>
  );
}
