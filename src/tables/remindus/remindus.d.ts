export interface Remindus {
  usId: string;
  guildId: string;
  channelId: string;
  content: string;
  description: string;
  entryDate: Date;
  targetDate: Date;
  repetition: string;
  mentionId: string;
  isPaused: number;
  RId: string;
  targetDateUser?: Date;
}
