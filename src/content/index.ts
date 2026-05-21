import { ToolContent } from '../registry/types';

import { hashGenerator } from './tools/hash-generator';
import { passwordGenerator } from './tools/password-generator';
import { base64 } from './tools/base64';
import { urlEncoder } from './tools/url-encoder';
import { htmlEntities } from './tools/html-entities';
import { jwtDecoder } from './tools/jwt-decoder';
import { jsonFormatter } from './tools/json-formatter';
import { jsonCsv } from './tools/json-csv';
import { regexTester } from './tools/regex-tester';
import { codeMinifier } from './tools/code-minifier';
import { diffChecker } from './tools/diff-checker';
import { format } from './tools/format';
import { qrcode } from './tools/qrcode';
import { textUtility } from './tools/text-utility';
import { splitCopy } from './tools/split-copy';
import { markdown } from './tools/markdown';
import { grammarChecker } from './tools/grammar-checker';
import { taskReminder } from './tools/task-reminder';
import { imageCompress } from './tools/image-compress';
import { imageConverter } from './tools/image-converter';
import { imageResizer } from './tools/image-resizer';
import { imageCrop } from './tools/image-crop';
import { imageBase64 } from './tools/image-base64';
import { bgRemover } from './tools/bg-remover';
import { compressPdf } from './tools/compress-pdf';
import { mergePdf } from './tools/merge-pdf';
import { splitPdf } from './tools/split-pdf';
import { imageToPdf } from './tools/image-to-pdf';
import { mutualFundReturns } from './tools/mutual-fund-returns';
import { lumpsumCalculator } from './tools/lumpsum-calculator';
import { ppfCalculator } from './tools/ppf-calculator';
import { fdCalculator } from './tools/fd-calculator';
import { rdCalculator } from './tools/rd-calculator';
import { cagrCalculator } from './tools/cagr-calculator';
import { stockAverageCalculator } from './tools/stock-average-calculator';
import { retirementCalculator } from './tools/retirement-calculator';
import { swpCalculator } from './tools/swp-calculator';
import { inflationCalculator } from './tools/inflation-calculator';
import { dataCalculator } from './tools/data-calculator';
import { emiCalculator } from './tools/emi-calculator';
import { sipCalculator } from './tools/sip-calculator';
import { ageCalculator } from './tools/age-calculator';
import { compoundInterest } from './tools/compound-interest';
import { gstCalculator } from './tools/gst-calculator';
import { percentageCalculator } from './tools/percentage-calculator';
import { salaryCalculator } from './tools/salary-calculator';
import { currencyConverter } from './tools/currency-converter';
import { unitConverter } from './tools/unit-converter';
import { dateCalculator } from './tools/date-calculator';
import { discountCalculator } from './tools/discount-calculator';
import { slugGenerator } from './tools/slug-generator';
import { metaTags } from './tools/meta-tags';
import { ogPreview } from './tools/og-preview';
import { sitemapGenerator } from './tools/sitemap-generator';
import { robotsTxt } from './tools/robots-txt';
import { seoTitle } from './tools/seo-title';
import { urlCleaner } from './tools/url-cleaner';
import { standardCalculator } from './tools/standard-calculator';
import { timeCalculator } from './tools/time-calculator';
import { imageSeo } from './tools/image-seo';
import { fileValidator } from './tools/validate';
import { worldClock } from './tools/world-clock';
import { utcIstConverter } from './tools/utc-ist-converter';
import { bulkResizer } from './tools/bulk-resizer';
import { htmlViewer } from './tools/html-viewer';
import { internetSpeedTest } from './tools/internet-speed-test';
import { numeralConverter } from './tools/numeral-converter';
import { smartConverter } from './tools/smart-converter';
import { safeToSpend } from './tools/safe-to-spend';
import { workHours } from './tools/work-hours';
import { wordCounter } from './tools/word-counter';
import { textCaseConverter } from './tools/text-case-converter';
import { invoiceGenerator } from './tools/invoice-generator';
import { colorConverter } from './tools/color-converter';

export const TOOL_CONTENT: Record<string, ToolContent> = {
  "hash-generator": hashGenerator,
  "password-generator": passwordGenerator,
  "base64": base64,
  "url-encoder": urlEncoder,
  "html-entities": htmlEntities,
  "jwt-decoder": jwtDecoder,
  "json-formatter": jsonFormatter,
  "json-csv": jsonCsv,
  "regex-tester": regexTester,
  "code-minifier": codeMinifier,
  "diff-checker": diffChecker,
  "format": format,
  "qrcode": qrcode,
  "text-utility": textUtility,
  "split-copy": splitCopy,
  "markdown": markdown,
  "grammar-checker": grammarChecker,
  "task-reminder": taskReminder,
  "image-compress": imageCompress,
  "image-converter": imageConverter,
  "image-resizer": imageResizer,
  "image-crop": imageCrop,
  "image-base64": imageBase64,
  "bg-remover": bgRemover,
  "compress-pdf": compressPdf,
  "merge-pdf": mergePdf,
  "split-pdf": splitPdf,
  "image-to-pdf": imageToPdf,
  "mutual-fund-returns": mutualFundReturns,
  "lumpsum-calculator": lumpsumCalculator,
  "ppf-calculator": ppfCalculator,
  "fd-calculator": fdCalculator,
  "rd-calculator": rdCalculator,
  "cagr-calculator": cagrCalculator,
  "stock-average-calculator": stockAverageCalculator,
  "retirement-calculator": retirementCalculator,
  "swp-calculator": swpCalculator,
  "inflation-calculator": inflationCalculator,
  "data-calculator": dataCalculator,
  "emi-calculator": emiCalculator,
  "sip-calculator": sipCalculator,
  "age-calculator": ageCalculator,
  "compound-interest": compoundInterest,
  "gst-calculator": gstCalculator,
  "percentage-calculator": percentageCalculator,
  "salary-calculator": salaryCalculator,
  "currency-converter": currencyConverter,
  "unit-converter": unitConverter,
  "date-calculator": dateCalculator,
  "discount-calculator": discountCalculator,
  "slug-generator": slugGenerator,
  "meta-tags": metaTags,
  "og-preview": ogPreview,
  "sitemap-generator": sitemapGenerator,
  "robots-txt": robotsTxt,
  "seo-title": seoTitle,
  "url-cleaner": urlCleaner,
  "standard-calculator": standardCalculator,
  "time-calculator": timeCalculator,
  "image-seo": imageSeo,
  "validate": fileValidator,
  "world-clock": worldClock,
  "utc-ist-converter": utcIstConverter,
  "bulk-resizer": bulkResizer,
  "html-viewer": htmlViewer,
  "internet-speed-test": internetSpeedTest,
  "numeral-converter": numeralConverter,
  "smart-converter": smartConverter,
  "safe-to-spend": safeToSpend,
  "work-hours": workHours
};
