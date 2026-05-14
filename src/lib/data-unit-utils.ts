/**
 * Data Unit Conversion and Calculation Utilities
 * 
 * SI Units (Decimal): 1 KB = 1000 Bytes
 * IEC Units (Binary): 1 KiB = 1024 Bytes
 */

export interface DataUnit {
  id: string;
  label: string;
  factor: number; // Factor relative to 1 Bit
  type: 'si' | 'iec';
}

export const DATA_UNITS: DataUnit[] = [
  // Bits
  { id: 'b',    label: 'bits (b)',         factor: 1,           type: 'si' },
  { id: 'Kb',   label: 'kilobits (Kb)',    factor: 1e3,         type: 'si' },
  { id: 'Mb',   label: 'megabits (Mb)',    factor: 1e6,         type: 'si' },
  { id: 'Gb',   label: 'gigabits (Gb)',    factor: 1e9,         type: 'si' },
  { id: 'Tb',   label: 'terabits (Tb)',    factor: 1e12,        type: 'si' },
  
  // Bytes (SI)
  { id: 'B',    label: 'bytes (B)',        factor: 8,           type: 'si' },
  { id: 'KB',   label: 'kilobytes (KB)',   factor: 8 * 1e3,     type: 'si' },
  { id: 'MB',   label: 'megabytes (MB)',   factor: 8 * 1e6,     type: 'si' },
  { id: 'GB',   label: 'gigabytes (GB)',   factor: 8 * 1e9,     type: 'si' },
  { id: 'TB',   label: 'terabytes (TB)',   factor: 8 * 1e12,    type: 'si' },
  { id: 'PB',   label: 'petabytes (PB)',   factor: 8 * 1e15,    type: 'si' },
  { id: 'EB',   label: 'exabytes (EB)',    factor: 8 * 1e18,    type: 'si' },
  
  // Bytes (IEC)
  { id: 'KiB',  label: 'kibibytes (KiB)',  factor: 8 * 1024,    type: 'iec' },
  { id: 'MiB',  label: 'mebibytes (MiB)',  factor: 8 * 1024**2, type: 'iec' },
  { id: 'GiB',  label: 'gibibytes (GiB)',  factor: 8 * 1024**3, type: 'iec' },
  { id: 'TiB',  label: 'tebibytes (TiB)',  factor: 8 * 1024**4, type: 'iec' },
  { id: 'PiB',  label: 'pebibytes (PiB)',  factor: 8 * 1024**5, type: 'iec' },
  { id: 'EiB',  label: 'exbibytes (EiB)',  factor: 8 * 1024**6, type: 'iec' },
];

export const BANDWIDTH_UNITS = [
  { id: 'bps',   label: 'bps',   factor: 1 },
  { id: 'Kbps',  label: 'Kbps',  factor: 1e3 },
  { id: 'Mbps',  label: 'Mbps',  factor: 1e6 },
  { id: 'Gbps',  label: 'Gbps',  factor: 1e9 },
  { id: 'B/s',   label: 'B/s',   factor: 8 },
  { id: 'KB/s',  label: 'KB/s',  factor: 8 * 1e3 },
  { id: 'MB/s',  label: 'MB/s',  factor: 8 * 1e6 },
  { id: 'GB/s',  label: 'GB/s',  factor: 8 * 1e9 },
];

export function convertData(value: number, fromId: string, toId: string): number {
  const fromUnit = DATA_UNITS.find(u => u.id === fromId);
  const toUnit = DATA_UNITS.find(u => u.id === toId);
  
  if (!fromUnit || !toUnit) return 0;
  
  // Convert to bits first
  const bits = value * fromUnit.factor;
  // Convert from bits to target unit
  return bits / toUnit.factor;
}

export function calculateTransferTime(
  fileSize: number, 
  fileUnitId: string, 
  bandwidth: number, 
  bandwidthUnitId: string, 
  overheadPercent: number = 5
): number {
  const fromUnit = DATA_UNITS.find(u => u.id === fileUnitId);
  const bUnit = BANDWIDTH_UNITS.find(u => u.id === bandwidthUnitId);
  
  if (!fromUnit || !bUnit || bandwidth <= 0) return 0;
  
  const totalBits = fileSize * fromUnit.factor * (1 + overheadPercent / 100);
  const bitsPerSecond = bandwidth * bUnit.factor;
  
  return totalBits / bitsPerSecond;
}

export function formatDuration(seconds: number): string {
  if (seconds === Infinity) return 'Infinity';
  if (isNaN(seconds)) return '0s';
  
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || (parts.length === 0 && ms === 0)) parts.push(`${s}s`);
  if (parts.length < 2 && ms > 0) parts.push(`${ms}ms`);

  return parts.join(' ');
}

export function calculateStorageCost(
  size: number, 
  unitId: string, 
  costPerGB: number, 
  months: number
): number {
  const GB_VALUE = convertData(size, unitId, 'GB');
  return GB_VALUE * costPerGB * months;
}

export const STORAGE_PROVIDERS = [
  { id: 'aws-s3',       label: 'AWS S3 Standard',    cost: 0.023 },
  { id: 'aws-glacier',  label: 'AWS Glacier (Bulk)', cost: 0.00099 },
  { id: 'google-drive', label: 'Google Drive',       cost: 0.02 }, // Approx for 2TB plan
  { id: 'backblaze',    label: 'Backblaze B2',       cost: 0.006 },
  { id: 'custom',       label: 'Custom Rate',        cost: 0 },
];
