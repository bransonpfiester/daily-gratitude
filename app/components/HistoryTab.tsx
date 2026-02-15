'use client';

import { useState } from 'react';
import { GratitudeEntry } from '../lib/storage';

interface HistoryTabProps {
  entries: GratitudeEntry[];
}

export default function HistoryTab({ entries }: HistoryTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const visibleEntries = sortedEntries.filter((entry) =>
    Boolean(
      entry.gratitude1.trim() ||
        entry.gratitude2.trim() ||
        entry.gratitude3.trim() ||
        entry.intention.trim() ||
        entry.affirmation.trim(),
    ),
  );

  if (visibleEntries.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-gray-600">No entries yet. Fill out Today to begin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visibleEntries.map((entry) => {
        const isExpanded = expandedId === entry.id;

        return (
          <button
            key={entry.id}
            className="w-full rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md sm:p-6"
            onClick={() => toggleExpanded(entry.id)}
            type="button"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{formatDate(entry.date)}</h3>
                {!isExpanded && entry.gratitude1 && <p className="mt-2 line-clamp-1 text-gray-600">{entry.gratitude1}</p>}
              </div>
              <span className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>⌄</span>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4 text-gray-700">
                <div>
                  <h4 className="mb-2 font-semibold">I am grateful for...</h4>
                  <p>{entry.gratitude1 || ' '}</p>
                  <p>{entry.gratitude2 || ' '}</p>
                  <p>{entry.gratitude3 || ' '}</p>
                </div>

                {entry.intention && (
                  <div>
                    <h4 className="mb-2 font-semibold">What would make today great?</h4>
                    <p>{entry.intention}</p>
                  </div>
                )}

                {entry.affirmation && (
                  <div>
                    <h4 className="mb-2 font-semibold">Daily affirmation</h4>
                    <p>{entry.affirmation}</p>
                  </div>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
