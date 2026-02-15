'use client';

import { useState } from 'react';
import { GratitudeEntry, createEntry } from '../lib/storage';

interface TodayTabProps {
  todayEntry?: GratitudeEntry;
  onSave: (entry: GratitudeEntry) => void;
}

export default function TodayTab({ todayEntry, onSave }: TodayTabProps) {
  const [gratitude1, setGratitude1] = useState(todayEntry?.gratitude1 ?? '');
  const [gratitude2, setGratitude2] = useState(todayEntry?.gratitude2 ?? '');
  const [gratitude3, setGratitude3] = useState(todayEntry?.gratitude3 ?? '');
  const [intention, setIntention] = useState(todayEntry?.intention ?? '');
  const [affirmation, setAffirmation] = useState(todayEntry?.affirmation ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

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
      setTimeout(() => setShowSuccess(false), 1800);
    }, 350);
  };

  const textAreaClassName =
    'w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none transition resize-y text-gray-900 placeholder-gray-400';

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">I am grateful for...</h2>
        <div className="space-y-3">
          <textarea
            value={gratitude1}
            onChange={(e) => setGratitude1(e.target.value)}
            placeholder="1."
            rows={3}
            className={textAreaClassName}
          />
          <textarea
            value={gratitude2}
            onChange={(e) => setGratitude2(e.target.value)}
            placeholder="2."
            rows={3}
            className={textAreaClassName}
          />
          <textarea
            value={gratitude3}
            onChange={(e) => setGratitude3(e.target.value)}
            placeholder="3."
            rows={3}
            className={textAreaClassName}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">What would make today great?</h2>
        <textarea
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="Write what would make this day meaningful."
          rows={5}
          className={textAreaClassName}
        />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Daily affirmation</h2>
        <textarea
          value={affirmation}
          onChange={(e) => setAffirmation(e.target.value)}
          placeholder="I am..."
          rows={5}
          className={textAreaClassName}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full rounded-xl bg-purple-600 px-5 py-4 text-base font-semibold text-white transition hover:bg-purple-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSaving ? 'Saving...' : showSuccess ? 'Saved!' : 'Save Entry'}
      </button>
    </div>
  );
}
