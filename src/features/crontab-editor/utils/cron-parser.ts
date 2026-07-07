import { CronField, ParsedCron, CronFieldType } from '../types';
import { MONTH_NAMES, DAY_NAMES, SPECIAL_EXPRESSIONS } from '../constants';

export function validateField(value: string, min: number, max: number): boolean {
  if (!value) return false;
  if (value === '*') return true;
  
  if (value.includes(',')) {
    return value.split(',').every(v => validateField(v, min, max));
  }
  
  if (value.includes('/')) {
    const parts = value.split('/');
    if (parts.length !== 2) return false;
    const [range, step] = parts;
    if (!range || !step || isNaN(Number(step))) return false;
    return validateField(range, min, max);
  }
  
  if (value.includes('-')) {
    const parts = value.split('-');
    if (parts.length !== 2) return false;
    const [start, end] = parts;
    if (!start || !end || isNaN(Number(start)) || isNaN(Number(end))) return false;
    const s = Number(start);
    const e = Number(end);
    return s >= min && e <= max && s <= e;
  }
  
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

export function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  const index = (v - 20) % 10;
  return s[index] || s[v] || s[0] || "th";
}

export function formatValue(val: string, type: CronFieldType): string {
  const num = Number(val);
  let result: string = val;
  if (type === 'month') {
    const name = MONTH_NAMES[num - 1];
    if (typeof name === 'string') result = name;
  } else if (type === 'dow') {
    const name = DAY_NAMES[num];
    if (typeof name === 'string') result = name;
  } else if (type === 'hour') {
    result = `${num % 12 || 12}${num >= 12 ? ' PM' : ' AM'}`;
  }
  return result;
}

export function fieldToHuman(value: string, type: CronFieldType): string {
  if (value === '*') return 'every ' + type.replace('dom', 'day').replace('dow', 'day of week');
  
  if (value.includes('/')) {
    const parts = value.split('/');
    const range = parts[0] || '*';
    const step = parts[1] || '1';
    const stepStr = `every ${step}${getOrdinal(Number(step))} ${type}`;
    if (range === '*') return stepStr;
    return `${stepStr} from ${fieldToHuman(range, type)}`;
  }
  
  if (value.includes(',')) {
    return value.split(',').map(v => fieldToHuman(v, type)).join(' and ');
  }
  
  if (value.includes('-')) {
    const parts = value.split('-');
    const start = parts[0] || '';
    const end = parts[1] || '';
    return `from ${formatValue(start, type)} through ${formatValue(end, type)}`;
  }
  
  return formatValue(value, type);
}

export function cronToHuman(expr: string): string {
  if (expr === 'REBOOT') return 'At reboot';
  if (SPECIAL_EXPRESSIONS[expr]) {
    const standard = SPECIAL_EXPRESSIONS[expr] || '';
    return `${expr} equivalents: ${cronToHuman(standard)}`;
  }

  const parts = expr.split(/\s+/);
  if (parts.length !== 5) return 'Invalid expression';

  const [min, hour, dom, month, dow] = parts;
  if (!min || !hour || !dom || !month || !dow) return 'Invalid expression';
  
  if (expr === '* * * * *') return 'Every minute';
  if (min === '0' && hour === '*' && dom === '*' && month === '*' && dow === '*') return 'Every hour';
  if (min === '0' && hour === '0' && dom === '*' && month === '*' && dow === '*') return 'Every day at midnight';

  let desc = 'At ';
  
  if (min !== '*' && hour !== '*') {
    if (!min.includes(',') && !min.includes('/') && !min.includes('-') && 
        !hour.includes(',') && !hour.includes('/') && !hour.includes('-')) {
      desc = `At ${formatValue(hour, 'hour')}:${min.padStart(2, '0')} `;
    } else {
      desc = `At ${fieldToHuman(min, 'minute')} of ${fieldToHuman(hour, 'hour')} `;
    }
  } else if (min !== '*') {
    desc = `At ${fieldToHuman(min, 'minute')} of every hour `;
  } else if (hour !== '*') {
    desc = `Every minute of ${fieldToHuman(hour, 'hour')} `;
  } else {
    desc = 'Every minute ';
  }

  if (dom !== '*' || month !== '*' || dow !== '*') {
    desc += 'on ';
    if (dom !== '*') desc += `${fieldToHuman(dom, 'dom')} `;
    if (month !== '*') {
       if (dom !== '*') desc += 'in ';
       desc += `${fieldToHuman(month, 'month')} `;
    }
    if (dow !== '*') {
       if (dom !== '*' || month !== '*') desc += 'on ';
       desc += `${fieldToHuman(dow, 'dow')} `;
    }
  } else {
    desc += 'every day';
  }

  return desc.trim().replace(/\s+/g, ' ');
}

export function getValues(field: string, min: number, max: number): number[] {
  if (!field) return [];
  if (field === '*') {
    const res = [];
    for (let i = min; i <= max; i++) res.push(i);
    return res;
  }
  
  if (field.includes(',')) {
    return Array.from(new Set(field.split(',').flatMap(v => getValues(v, min, max)))).sort((a, b) => a - b);
  }
  
  if (field.includes('/')) {
    const parts = field.split('/');
    const range = parts[0] || '*';
    const step = Number(parts[1] || '1');
    const rangeVals = getValues(range, min, max);
    return rangeVals.filter((_, i) => i % step === 0);
  }
  
  if (field.includes('-')) {
    const parts = field.split('-').map(Number);
    const start = parts[0] ?? min;
    const end = parts[1] ?? max;
    const res = [];
    for (let i = start; i <= end; i++) res.push(i);
    return res;
  }
  
  return [Number(field)];
}

export function getNextRuns(expr: string, count: number): Date[] {
  if (expr === 'REBOOT') return [];
  const realExpr = SPECIAL_EXPRESSIONS[expr] || expr;
  const parts = realExpr.split(/\s+/);
  if (parts.length !== 5) return [];

  const [min, hour, dom, month, dow] = parts;
  if (!min || !hour || !dom || !month || !dow) return [];

  const mins = getValues(min, 0, 59);
  const hours = getValues(hour, 0, 23);
  const doms = getValues(dom, 1, 31);
  const months = getValues(month, 1, 12);
  const dows = getValues(dow, 0, 7).map(d => d === 7 ? 0 : d);

  const runs: Date[] = [];
  const current = new Date();
  current.setSeconds(0, 0);
  current.setMinutes(current.getMinutes() + 1);

  let iterations = 0;
  const maxIterations = 50000;

  while (runs.length < count && iterations < maxIterations) {
    iterations++;
    const mo = current.getMonth() + 1;
    const d = current.getDate();
    const h = current.getHours();
    const m = current.getMinutes();
    const dw = current.getDay();

    if (months.includes(mo) && doms.includes(d) && hours.includes(h) && mins.includes(m) && dows.includes(dw)) {
      runs.push(new Date(current));
    }
    
    current.setMinutes(current.getMinutes() + 1);
  }

  return runs;
}

export function parseCronExpression(expr: string): ParsedCron {
  if (!expr) return { valid: false, fields: [], humanReadable: '', nextRuns: [], error: 'Expression is empty' };
  
  if (expr === '@reboot') {
    return {
      valid: true,
      fields: [],
      humanReadable: 'At reboot',
      nextRuns: [],
    };
  }

  const normalized = SPECIAL_EXPRESSIONS[expr] || expr;
  const parts = normalized.split(/\s+/);

  if (parts.length !== 5) {
    return { valid: false, fields: [], humanReadable: '', nextRuns: [], error: 'Standard cron requires 5 fields' };
  }

  const fields: CronField[] = [
    { label: 'Minute', value: parts[0] || '*', min: 0, max: 59, description: fieldToHuman(parts[0] || '*', 'minute') },
    { label: 'Hour', value: parts[1] || '*', min: 0, max: 23, description: fieldToHuman(parts[1] || '*', 'hour') },
    { label: 'Day of Month', value: parts[2] || '*', min: 1, max: 31, description: fieldToHuman(parts[2] || '*', 'dom') },
    { label: 'Month', value: parts[3] || '*', min: 1, max: 12, description: fieldToHuman(parts[3] || '*', 'month') },
    { label: 'Day of Week', value: parts[4] || '*', min: 0, max: 7, description: fieldToHuman(parts[4] || '*', 'dow') },
  ];

  const invalidField = fields.find(f => !validateField(f.value, f.min, f.max));
  if (invalidField) {
    return { valid: false, fields, humanReadable: '', nextRuns: [], error: `Invalid ${invalidField.label.toLowerCase()} value: ${invalidField.value}` };
  }

  return {
    valid: true,
    fields,
    humanReadable: cronToHuman(expr),
    nextRuns: getNextRuns(expr, 5),
  };
}
