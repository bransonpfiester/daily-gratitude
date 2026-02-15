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

export function loadData(): StorageData {
  if (typeof window === 'undefined') {
    return { entries: [] };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
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
  const today = new Date().toISOString().split('T')[0];
  return entries.find(e => e.date === today);
}

export function calculateStreak(entries: GratitudeEntry[]): number {
  if (entries.length === 0) return 0;
  
  const sortedDates = entries
    .map(e => e.date)
    .sort()
    .reverse();
  
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const entryDate of sortedDates) {
    const checkDate = currentDate.toISOString().split('T')[0];
    
    if (entryDate === checkDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (streak === 0 && entryDate < today) {
      // No entry today, but check yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (entryDate === yesterday.toISOString().split('T')[0]) {
        streak = 1;
        currentDate = new Date(yesterday);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }
  
  return streak;
}

export function createEntry(data: Partial<GratitudeEntry>): GratitudeEntry {
  const now = Date.now();
  const today = new Date().toISOString().split('T')[0];
  
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
