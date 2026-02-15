'use client';

import { useMemo, useState } from 'react';
import { getEntryByDate, getTodayKey, listEntries, loadEntries, saveEntry } from './lib/storage';

type Tab = 'today' | 'history';

function formatDate(date: string): string {
  const value = new Date(`${date}T00:00:00`);
  return value.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Home() {
  const [tab, setTab] = useState<Tab>('today');
  const [entries, setEntries] = useState(() => (typeof window === 'undefined' ? {} : loadEntries()));
  const [values, setValues] = useState<[string, string, string]>(() => {
    if (typeof window === 'undefined') return ['', '', ''];
    const todayEntry = getEntryByDate(loadEntries(), getTodayKey());
    return todayEntry?.items ?? ['', '', ''];
  });
  const [saved, setSaved] = useState(false);

  const today = getTodayKey();
  const history = useMemo(() => listEntries(entries), [entries]);
  const isComplete = values.every((value) => value.trim().length > 0);

  const updateValue = (index: 0 | 1 | 2, next: string) => {
    const copy: [string, string, string] = [...values];
    copy[index] = next;
    setValues(copy);
    if (saved) setSaved(false);
  };

  const handleSave = () => {
    if (!isComplete) return;
    const next = saveEntry(today, values);
    setEntries(next);
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-[#0F172A] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-[600px] space-y-4">
        <section className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.12)] sm:p-6">
          <h1 className="text-2xl font-semibold text-slate-900">Three Good Things</h1>
          <p className="mt-1 text-sm text-slate-600">{formatDate(today)}</p>
        </section>

        <section className="rounded-xl bg-white p-1 shadow-[0_2px_12px_rgba(15,23,42,0.12)]">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setTab('today')}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                tab === 'today' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setTab('history')}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                tab === 'history' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              History
            </button>
          </div>
        </section>

        {tab === 'today' ? (
          <section className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.12)] sm:p-6">
            <ol className="space-y-3">
              {[0, 1, 2].map((index) => (
                <li key={index} className="space-y-1">
                  <label htmlFor={`item-${index + 1}`} className="block text-sm font-medium text-slate-700">
                    {index + 1}.
                  </label>
                  <input
                    id={`item-${index + 1}`}
                    type="text"
                    value={values[index]}
                    onChange={(event) => updateValue(index as 0 | 1 | 2, event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-700"
                    placeholder={`Good thing ${index + 1}`}
                  />
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isComplete}
              className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Save Today
            </button>

            {saved && (
              <p className="mt-3 text-sm font-medium text-[#10B981]" role="status" aria-live="polite">
                ✓ Saved successfully
              </p>
            )}
          </section>
        ) : (
          <section className="space-y-3">
            {history.length === 0 ? (
              <div className="rounded-xl bg-white p-5 text-sm text-slate-600 shadow-[0_2px_12px_rgba(15,23,42,0.12)] sm:p-6">
                No saved days yet.
              </div>
            ) : (
              history.map((entry) => (
                <article
                  key={entry.date}
                  className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.12)] sm:p-6"
                >
                  <h2 className="text-sm font-semibold text-slate-900">{formatDate(entry.date)}</h2>
                  <ol className="mt-3 space-y-2 text-sm text-slate-700">
                    <li>1. {entry.items[0]}</li>
                    <li>2. {entry.items[1]}</li>
                    <li>3. {entry.items[2]}</li>
                  </ol>
                </article>
              ))
            )}
          </section>
        )}
      </div>
    </main>
  );
}
