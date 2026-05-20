export interface JournalEntry {
  id: string;
  date: string;
  category: { en: string; fr: string };
  description: { en: string; fr: string };
}
