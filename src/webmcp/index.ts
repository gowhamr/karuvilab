export * from './types';
export { webmcpRegistry } from './registry';

// Standard initialization of WebMCP tools
import { ageCalculatorContract } from '@/src/features/calculators/age/contract';
import { utcIstContract } from '@/src/features/calculators/utc-ist/contract';
import { financialFreedomContract } from '@/src/features/calculators/financial-freedom/contract';
import { percentageContract } from '@/src/features/calculators/percentage/contract';
import { dateDifferenceContract } from '@/src/features/calculators/date/contract';
import { unitConverterContract } from '@/src/features/calculators/unit-converter/contract';
import { timezoneContract } from '@/src/features/calculators/timezone/contract';
import { emiContract } from '@/src/features/calculators/emi/contract';
import { compoundInterestContract } from '@/src/features/calculators/compound-interest/contract';
import { cagrContract } from '@/src/features/calculators/cagr/contract';
import { gstContract } from '@/src/features/calculators/gst/contract';
import { discountContract } from '@/src/features/calculators/discount/contract';
import { salaryContract } from '@/src/features/calculators/salary/contract';
import { inflationContract } from '@/src/features/calculators/inflation/contract';
import { sipContract } from '@/src/features/calculators/sip/contract';
import { fdContract } from '@/src/features/calculators/fd/contract';
import { rdContract } from '@/src/features/calculators/rd/contract';
import { timeDifferenceContract } from '@/src/features/calculators/time/contract';

import { webmcpRegistry } from './registry';

/**
 * Bootstraps the Model Context Protocol by registering all defined tool contracts.
 * Should be called once during app initialization.
 */
export function initializeWebMCP() {
  if (typeof window === 'undefined') return; // Ensure browser execution only
  
  webmcpRegistry.register(ageCalculatorContract);
  webmcpRegistry.register(utcIstContract);
  webmcpRegistry.register(financialFreedomContract);
  webmcpRegistry.register(percentageContract);
  webmcpRegistry.register(dateDifferenceContract);
  webmcpRegistry.register(unitConverterContract);
  webmcpRegistry.register(timezoneContract);
  webmcpRegistry.register(emiContract);
  webmcpRegistry.register(compoundInterestContract);
  webmcpRegistry.register(cagrContract);
  webmcpRegistry.register(gstContract);
  webmcpRegistry.register(discountContract);
  webmcpRegistry.register(salaryContract);
  webmcpRegistry.register(inflationContract);
  webmcpRegistry.register(sipContract);
  webmcpRegistry.register(fdContract);
  webmcpRegistry.register(rdContract);
  webmcpRegistry.register(timeDifferenceContract);
  
  console.info(`[WebMCP] Initialized ${webmcpRegistry.getTools().length} tools.`);
}
