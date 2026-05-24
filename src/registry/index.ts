import { ToolEntry } from './types';
import { emi_calculator } from './tools/emi-calculator';
import { sip_calculator } from './tools/sip-calculator';
import { age_calculator } from './tools/age-calculator';
import { compound_interest } from './tools/compound-interest';
import { gst_calculator } from './tools/gst-calculator';
import { currency_converter } from './tools/currency-converter';
import { discount_calculator } from './tools/discount-calculator';
import { world_clock } from './tools/world-clock';
import { date_calculator } from './tools/date-calculator';
import { time_calculator } from './tools/time-calculator';
import { standard_calculator } from './tools/standard-calculator';
import { salary_calculator } from './tools/salary-calculator';
import { percentage_calculator } from './tools/percentage-calculator';
import { unit_converter } from './tools/unit-converter';
import { numeral_converter } from './tools/numeral-converter';
import { smart_converter } from './tools/smart-converter';
import { safe_to_spend } from './tools/safe-to-spend';
import { work_hours } from './tools/work-hours';
import { utc_ist_converter } from './tools/utc-ist-converter';
import { mutual_fund_returns } from './tools/mutual-fund-returns';
import { lumpsum_calculator } from './tools/lumpsum-calculator';
import { ppf_calculator } from './tools/ppf-calculator';
import { fd_calculator } from './tools/fd-calculator';
import { rd_calculator } from './tools/rd-calculator';
import { cagr_calculator } from './tools/cagr-calculator';
import { stock_average_calculator } from './tools/stock-average-calculator';
import { retirement_calculator } from './tools/retirement-calculator';
import { swp_calculator } from './tools/swp-calculator';
import { inflation_calculator } from './tools/inflation-calculator';
import { data_calculator } from './tools/data-calculator';
import { file_viewer_diff } from './tools/file-viewer-diff';
import { compress_pdf } from './tools/compress-pdf';
import { merge_pdf } from './tools/merge-pdf';
import { split_pdf } from './tools/split-pdf';
import { image_to_pdf } from './tools/image-to-pdf';
import { pdf_to_word } from './tools/pdf-to-word';
import { lock_unlock_pdf } from './tools/lock-unlock-pdf';
import { watermark_pdf } from './tools/watermark-pdf';
import { page_numbering } from './tools/page-numbering';
import { rotate_pdf } from './tools/rotate-pdf';
import { extract_images } from './tools/extract-images';
import { image_compress } from './tools/image-compress';
import { image_converter } from './tools/image-converter';
import { image_resizer } from './tools/image-resizer';
import { image_crop } from './tools/image-crop';
import { bulk_resizer } from './tools/bulk-resizer';
import { bg_remover } from './tools/bg-remover';
import { image_base64 } from './tools/image-base64';
import { json_formatter } from './tools/json-formatter';
import { json_csv } from './tools/json-csv';
import { regex_tester } from './tools/regex-tester';
import { code_minifier } from './tools/code-minifier';
import { diff_checker } from './tools/diff-checker';
import { format } from './tools/format';
import { html_viewer } from './tools/html-viewer';
import { base64 } from './tools/base64';
import { password_generator } from './tools/password-generator';
import { hash_generator } from './tools/hash-generator';
import { url_encoder } from './tools/url-encoder';
import { html_entities } from './tools/html-entities';
import { jwt_decoder } from './tools/jwt-decoder';
import { qrcode } from './tools/qrcode';
import { split_copy } from './tools/split-copy';
import { text_utility } from './tools/text-utility';
import { grammar_checker } from './tools/grammar-checker';
import { task_reminder } from './tools/task-reminder';
import { markdown } from './tools/markdown';
import { url_cleaner } from './tools/url-cleaner';
import { validate } from './tools/validate';
import { internet_speed_test } from './tools/internet-speed-test';
import { meta_tags } from './tools/meta-tags';
import { og_preview } from './tools/og-preview';
import { sitemap_generator } from './tools/sitemap-generator';
import { robots_txt } from './tools/robots-txt';
import { image_seo } from './tools/image-seo';
import { slug_generator } from './tools/slug-generator';
import { seo_title } from './tools/seo-title';
import { calendar } from './tools/calendar';
import { yaml_validator } from './tools/yaml-validator';
import { pomodoro_timer } from './tools/pomodoro-timer';
import { color_palette_extractor } from './tools/color-palette-extractor';
import { word_counter } from './tools/word-counter';
import { text_case_converter } from './tools/text-case-converter';
import { invoice_generator } from './tools/invoice-generator';
import { color_converter } from './tools/color-converter';
import { timezone_converter } from './tools/timezone-converter';
import { fake_data_generator } from './tools/fake-data-generator';
import { scientific_calculator } from './tools/scientific-calculator';
import { text_sorter_deduper } from './tools/text-sorter-deduper';
import { mic_camera_tester } from './tools/mic-camera-tester';
import { wifi_qr_code } from './tools/wifi-qr-code';
import { phone_mockup_generator } from './tools/phone-mockup-generator';
import { chart_generator } from './tools/chart-generator';
import { typing_speed_test } from './tools/typing-speed-test';
import { barcode_scanner } from './tools/barcode-scanner';
import { notes } from './tools/notes';

export const ALL_TOOLS: ToolEntry[] = [
  emi_calculator,
  sip_calculator,
  age_calculator,
  compound_interest,
  gst_calculator,
  currency_converter,
  discount_calculator,
  world_clock,
  date_calculator,
  time_calculator,
  standard_calculator,
  salary_calculator,
  percentage_calculator,
  unit_converter,
  numeral_converter,
  smart_converter,
  safe_to_spend,
  work_hours,
  utc_ist_converter,
  mutual_fund_returns,
  lumpsum_calculator,
  ppf_calculator,
  fd_calculator,
  rd_calculator,
  cagr_calculator,
  stock_average_calculator,
  retirement_calculator,
  swp_calculator,
  inflation_calculator,
  data_calculator,
  file_viewer_diff,
  compress_pdf,
  merge_pdf,
  split_pdf,
  image_to_pdf,
  pdf_to_word,
  lock_unlock_pdf,
  watermark_pdf,
  page_numbering,
  rotate_pdf,
  extract_images,
  image_compress,
  image_converter,
  image_resizer,
  image_crop,
  bulk_resizer,
  bg_remover,
  image_base64,
  json_formatter,
  json_csv,
  regex_tester,
  code_minifier,
  diff_checker,
  format,
  html_viewer,
  base64,
  password_generator,
  hash_generator,
  url_encoder,
  html_entities,
  jwt_decoder,
  qrcode,
  split_copy,
  text_utility,
  grammar_checker,
  task_reminder,
  markdown,
  url_cleaner,
  validate,
  internet_speed_test,
  meta_tags,
  og_preview,
  sitemap_generator,
  robots_txt,
  image_seo,
  slug_generator,
  seo_title,
  calendar,
  yaml_validator,
  pomodoro_timer,
  color_palette_extractor,
  timezone_converter,
  fake_data_generator,
  scientific_calculator,
  text_sorter_deduper,
  mic_camera_tester,
  wifi_qr_code,
  phone_mockup_generator,
  chart_generator,
  typing_speed_test,
  barcode_scanner,
  notes,
  word_counter,
  text_case_converter,
  invoice_generator,
  color_converter,
];
