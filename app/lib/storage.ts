export interface GratitudeEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  gratitude1: string;
  gratitude2: string;
  gratitude3: string;
  intention: string;
  affirmation: string;
  createdAt: number;
  updatedAt: number;
}

export interface StorageData {
  entries: GratitudeEntry[];
}

const STORAGE_KEY = 'gratitude-journal-data';

function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hasContent(entry: GratitudeEntry): boolean {
  return Boolean(
    entry.gratitude1.trim() ||
      entry.gratitude2.trim() ||
      entry.gratitude3.trim() ||
      entry.intention.trim() ||
      entry.affirmation.trim(),
  );
}

export function loadData(): StorageData {
  if (typeof window === 'undefined') {
    return { entries: [] };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as StorageData;
      if (Array.isArray(parsed.entries)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }

  return { entries: [] };
}

export function saveData(data: StorageData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export function getTodayEntry(entries: GratitudeEntry[]): GratitudeEntry | undefined {
  const today = getLocalDateKey();
  return entries.find((entry) => entry.date === today);
}

export function calculateStreak(entries: GratitudeEntry[]): number {
  const datedEntries = new Set(entries.filter(hasContent).map((entry) => entry.date));
  if (datedEntries.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();

  while (datedEntries.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // If there is no entry for today, start counting from yesterday.
  if (streak === 0) {
    cursor.setDate(cursor.getDate() - 1);
    while (datedEntries.has(getLocalDateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  return streak;
}

export function createEntry(data: Partial<GratitudeEntry>): GratitudeEntry {
  const now = Date.now();
  const today = getLocalDateKey();

  return {
    id: data.id || `entry-${now}`,
    date: data.date || today,
    gratitude1: data.gratitude1 || '',
    gratitude2: data.gratitude2 || '',
    gratitude3: data.gratitude3 || '',
    intention: data.intention || '',
    affirmation: data.affirmation || '',
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
}
