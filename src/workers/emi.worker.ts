import * as Comlink from "comlink";
import { generateSchedule, EmiInputs, EmiResult } from "../lib/emi-calculations";

export interface EmiWorkerAPI {
  calculateSchedule: (inputs: EmiInputs) => Promise<EmiResult>;
}

const api: EmiWorkerAPI = {
  async calculateSchedule(inputs) {
    // Artificial delay to show loading state if needed, 
    // but pure math is usually < 10ms for 360 months.
    return generateSchedule(inputs);
  }
};

Comlink.expose(api);
