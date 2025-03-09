interface SwotEntry {
  description: string;
  category: string;
  type: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat';
  importance: number;
  score: number;
  notes: string;
}
