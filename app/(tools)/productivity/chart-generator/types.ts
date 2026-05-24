export interface DataPoint {
  id: string;
  label: string;
  value: number;
  color: string;
}

export type ChartType = "bar" | "pie" | "doughnut" | "line" | "area";

export const PALETTES = [
  { name: "Indigo", colors: ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE", "#E0E7FF"] },
  { name: "Emerald", colors: ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5", "#ECFDF5"] },
  { name: "Ocean", colors: ["#0EA5E9", "#38BDF8", "#7DD3FC", "#BAE6FD", "#E0F2FE", "#F0F9FF"] },
  { name: "Rose", colors: ["#F43F5E", "#FB7185", "#FDA4AF", "#FECDD3", "#FFE4E6", "#FFF1F2"] },
  { name: "Vibrant", colors: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"] },
];

export const TRANSITION = { type: "spring", bounce: 0.2, duration: 0.6 } as const;

export interface ChartOptions {
  showValues: boolean;
  smoothLines: boolean;
  showGrid: boolean;
  activePalette: number;
  title: string;
}
