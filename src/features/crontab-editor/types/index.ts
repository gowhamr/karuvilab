export type CronFieldType = 'minute' | 'hour' | 'dom' | 'month' | 'dow';

export interface CronField {
  label: string;
  value: string;
  min: number;
  max: number;
  description: string;
}

export interface ParsedCron {
  valid: boolean;
  fields: CronField[];
  humanReadable: string;
  nextRuns: Date[];
  error?: string;
}
