import { AnalysisRecord, HistoryFilterMode } from '../types/mottathala';

const STORAGE_KEY = 'mottathala_finder_records_master_v3';

export const storage = {
  getRecords: (filter: HistoryFilterMode = 'recent'): AnalysisRecord[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const list: AnalysisRecord[] = JSON.parse(raw);

      if (filter === 'highest') {
        return [...list].sort((a, b) => b.score - a.score);
      } else {
        return [...list].sort((a, b) => b.timestamp - a.timestamp);
      }
    } catch (e) {
      console.error('Failed to load records', e);
      return [];
    }
  },

  saveRecord: (record: AnalysisRecord): void => {
    if (typeof window === 'undefined') return;
    try {
      const current = storage.getRecords('recent');
      const filtered = current.filter((r) => r.id !== record.id);
      const updated = [record, ...filtered].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save record', e);
    }
  },

  getRecordById: (id: string): AnalysisRecord | null => {
    const list = storage.getRecords('recent');
    return list.find((r) => r.id === id) || null;
  },

  deleteRecord: (id: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const current = storage.getRecords('recent');
      const updated = current.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete record', e);
    }
  },

  clearAllRecords: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
};
