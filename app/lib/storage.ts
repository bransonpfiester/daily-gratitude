export interface JournalEntry {
  date: string;
  items: [string, string, string];
  updatedAt: number;
}

const STORAGE_KEY = 'three-good-things';

function toLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayKey(): string {
  return toLocalDateKey();
}

export function loadEntries(): Record<string, JournalEntry> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Record<string, JournalEntry>;
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    return {};
  }

  return {};
}

export function saveEntry(date: string, items: [string, string, string]): Record<string, JournalEntry> {
  const all = loadEntries();
  const trimmed: [string, string, string] = [items[0].trim(), items[1].trim(), items[2].trim()];

  all[date] = {
    date,
    items: trimmed,
    updatedAt: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all;
}

export function getEntryByDate(all: Record<string, JournalEntry>, date: string): JournalEntry | undefined {
  return all[date];
}

export function listEntries(all: Record<string, JournalEntry>): JournalEntry[] {
  return Object.values(all).sort((a, b) => b.date.localeCompare(a.date));
}
