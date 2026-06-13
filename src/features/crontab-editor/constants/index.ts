export const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const SPECIAL_EXPRESSIONS: Record<string, string> = {
  '@yearly':   '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly':  '0 0 1 * *',
  '@weekly':   '0 0 * * 0',
  '@daily':    '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly':   '0 * * * *',
  '@reboot':   'REBOOT',
};

export const PRESETS = [
  { label: 'Every minute',   expr: '* * * * *' },
  { label: 'Every 5 min',    expr: '*/5 * * * *' },
  { label: 'Every 15 min',   expr: '*/15 * * * *' },
  { label: 'Every 30 min',   expr: '*/30 * * * *' },
  { label: 'Hourly',         expr: '0 * * * *' },
  { label: 'Daily midnight', expr: '0 0 * * *' },
  { label: 'Daily 9 AM',     expr: '0 9 * * *' },
  { label: 'Weekdays 9 AM',  expr: '0 9 * * 1-5' },
  { label: 'Weekly Sunday',  expr: '0 0 * * 0' },
  { label: 'Monthly 1st',    expr: '0 0 1 * *' },
  { label: 'Yearly Jan 1',   expr: '0 0 1 1 *' },
  { label: '@hourly',        expr: '@hourly' },
  { label: '@daily',         expr: '@daily' },
  { label: '@weekly',        expr: '@weekly' },
  { label: '@monthly',       expr: '@monthly' },
  { label: '@yearly',        expr: '@yearly' },
  { label: '@reboot',        expr: '@reboot' },
];
