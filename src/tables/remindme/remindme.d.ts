export interface Remindme {
  meId: string;
  content: string;
  description: string;
  entryDate: Date;
  targetDate: Date;
  repetition: string;
  isPaused: number;
  RCId: string;
  userId: string;
}
