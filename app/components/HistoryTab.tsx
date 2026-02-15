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
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No entries yet. Start by filling out today's gratitude!</p>
        <p className="text-gray-400 mt-2">Your journey begins with a single entry 🌟</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry) => {
        const isExpanded = expandedId === entry.id;
        const hasContent = entry.gratitude1 || entry.gratitude2 || entry.gratitude3 || entry.intention || entry.affirmation;

        if (!hasContent) return null;

        return (
          <div
            key={entry.id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => toggleExpanded(entry.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatDate(entry.date)}
                </h3>
                {!isExpanded && (
                  <div className="mt-2 text-gray-600">
                    {entry.gratitude1 && (
                      <p className="truncate">🙏 {entry.gratitude1}</p>
                    )}
                  </div>
                )}
              </div>
              <svg
                className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4 animate-fadeIn">
                {(entry.gratitude1 || entry.gratitude2 || entry.gratitude3) && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">🙏 Grateful for:</h4>
                    <ul className="space-y-1 text-gray-600">
                      {entry.gratitude1 && <li>• {entry.gratitude1}</li>}
                      {entry.gratitude2 && <li>• {entry.gratitude2}</li>}
                      {entry.gratitude3 && <li>• {entry.gratitude3}</li>}
                    </ul>
                  </div>
                )}

                {entry.intention && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">✨ Intention:</h4>
                    <p className="text-gray-600">{entry.intention}</p>
                  </div>
                )}

                {entry.affirmation && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">💜 Affirmation:</h4>
                    <p className="text-gray-600">{entry.affirmation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
