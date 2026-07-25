export interface GameDay {
  id: string;
  date: Date;
}

export interface GameDayDraft extends Omit<GameDay, 'date'> {
  draft: boolean;
}
