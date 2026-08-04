## Category: Calculators

### <a id="age-calculator"></a>Age Calculator

#### Identity
- **ID:** `age-calculator`
- **Name:** Age Calculator
- **Category:** Calculators
- **Route:** `/calculators/age-calculator`

#### Purpose
> 
The KaruviLab Age Calculator provides an accurate way to calculate the precise time between any two dates.

#### Features
- Filling out official government forms that require age in years, months, and days.
- Determining the exact number of days until a significant upcoming milestone or birthday.
- Calculating the precise age of documents, historical buildings, or projects.
- Tracking how many days an infant has been alive for pediatric or developmental milestones.

#### Functionality
Set Date of Birth: Click the birth date field to open the calendar and select your date of birth. Choose Target Date: The tool defaults to the current date. You can change this to calculate your age as of a specific past or future date. Calculate: Click 'Calculate Age'. The tool will immediately return your precise age broken down by years, total months, total weeks, and total days. Next Birthday: The tool also calculates the time remaining until your next upcoming birthday.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `HybridDateInput`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `useUrlState` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/age-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/age-calculator/AgeCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/age-calculator.ts`
- **Registry File:** `src/registry/tools/age-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `date-calculator`, `time-calculator`
- **Shared Components Used:** `ToolShell`, `MetricCard`, `HybridDateInput`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Age is off by one day, Resolve issues relating to: Future birth date error
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/age-calculator/page.tsx`
  - `app/(tools)/calculators/age-calculator/AgeCalculatorClient.tsx`
  - `app/(tools)/calculators/age-calculator/AgeCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="bmi-calculator"></a>Bmi Calculator

#### Identity
- **ID:** `bmi-calculator`
- **Name:** Bmi Calculator
- **Category:** Calculators
- **Route:** `/calculators/bmi-calculator`

#### Purpose
> Calculate your Body Mass Index (BMI) and health category to track fitness goals.

#### Features
- Support for bmi calculator
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `useUrlState`, `types`, `constants`, `BmiGauge` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/bmi-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/bmi-calculator/BmiCalculatorClient.tsx`
- **Feature Directory:** `src/features/bmi-calculator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/bmi-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/bmi-calculator/page.tsx`
  - `app/(tools)/calculators/bmi-calculator/BmiCalculatorClient.tsx`
  - `app/(tools)/calculators/bmi-calculator/BmiCalculatorWrapper.tsx`
  - `src/features/bmi-calculator/components/BmiGauge.tsx`
  - `src/features/bmi-calculator/constants/index.ts`
  - `src/features/bmi-calculator/types/index.ts`
  - `src/features/bmi-calculator/utils/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="cagr-calculator"></a>CAGR Calculator

#### Identity
- **ID:** `cagr-calculator`
- **Name:** CAGR Calculator
- **Category:** Calculators
- **Route:** `/calculators/cagr-calculator`

#### Purpose
> Compound Annual Growth Rate (CAGR) is the best way to measure the mean annual growth of an investment over time, smoothing out volatility.

#### Features
- Evaluating the performance of a stock or mutual fund portfolio
- Comparing business growth over several years
- Determining the annualized yield of real estate investments

#### Functionality
Enter the initial investment value. Enter the final (current) investment value. Enter the duration in years. The tool calculates the CAGR percentage instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `useUrlState` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/cagr-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/cagr-calculator/CAGRCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/cagr-calculator.ts`
- **Registry File:** `src/registry/tools/cagr-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/cagr-calculator/page.tsx`
  - `app/(tools)/calculators/cagr-calculator/CAGRCalculatorClient.tsx`
  - `app/(tools)/calculators/cagr-calculator/CAGRCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="calculator"></a>Calculator

#### Identity
- **ID:** `calculator`
- **Name:** Calculator
- **Category:** Calculators
- **Route:** `/calculators/calculator`

#### Purpose
> 
    The Calculator provides a fully integrated mathematical workspace that merges standard and scientific functionalities into one premium interface.

#### Features
- Support for calculator
- Support for math
- Support for scientific
- Support for standard
- Support for trigonometry

#### Functionality
Enter an expression using the on-screen keypad or your physical keyboard. On mobile, rotate your device to landscape or toggle the sidebar to access scientific functions. Access your calculation history from the panel to reuse previous results. Use memory keys (MC, MR, M+, M-) for running subtotals. Change settings like angle unit (Deg/Rad) or precision from the options menu.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `zustand`, `lucide-react`, `framer-motion`, `decimal.js` |
| **Shared Internal Modules** | `calculatorClientWrapper`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/calculator/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/calculator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/calculator/store.ts`
- **Content File:** `src/content/tools/calculator.ts`
- **Registry File:** `src/registry/tools/calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `unit-converter`, `percentage-calculator`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/calculator/page.tsx`
  - `src/features/calculator/calculatorClient.tsx`
  - `src/features/calculator/calculatorClientWrapper.tsx`
  - `src/features/calculator/components/CalculatorDisplay.tsx`
  - `src/features/calculator/components/CalculatorKey.tsx`
  - `src/features/calculator/components/HistoryPanel.tsx`
  - `src/features/calculator/components/ScientificKeypad.tsx`
  - `src/features/calculator/components/StandardKeypad.tsx`
  - `src/features/calculator/engine/parser.ts`
  - `src/features/calculator/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="compound-interest"></a>Compound Interest Calculator

#### Identity
- **ID:** `compound-interest`
- **Name:** Compound Interest Calculator
- **Category:** Calculators
- **Route:** `/calculators/compound-interest`

#### Purpose
> Calculate the future value of an investment using the compound interest formula.

#### Features
- Projecting the growth of a fixed deposit or savings account
- Comparing compounding frequencies when evaluating financial products
- Understanding how reinvesting dividends compounds returns
- Setting a savings goal and working backwards to find the required principal

#### Functionality
Enter the principal (initial investment). Enter the annual interest rate. Enter the investment period in years. Choose compounding frequency. Optionally add a monthly contribution and click 'Calculate'.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `calculator-utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/compound-interest/page.tsx`
- **Client Component:** `app/(tools)/calculators/compound-interest/CompoundInterestClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/compound-interest.ts`
- **Registry File:** `src/registry/tools/compound-interest.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Result doesn't match the bank's stated maturity amount, Resolve issues relating to: Entered rate as a decimal instead of percentage
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/compound-interest/page.tsx`
  - `app/(tools)/calculators/compound-interest/CompoundInterestClient.tsx`
  - `app/(tools)/calculators/compound-interest/CompoundInterestClientWrapper.tsx`
  - `app/(tools)/calculators/compound-interest/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="currency-converter"></a>Currency Converter

#### Identity
- **ID:** `currency-converter`
- **Name:** Currency Converter
- **Category:** Calculators
- **Route:** `/calculators/currency-converter`

#### Purpose
> 
The Currency Converter is a real-time financial utility that allows you to calculate exchange values between global currencies instantly.

#### Features
- Support for currency
- Support for exchange
- Support for forex
- Support for usd
- Support for eur
- Support for inr

#### Functionality
Select Base: Choose the currency you currently have from the first dropdown menu. Select Target: Choose the currency you want to convert into from the second dropdown. Enter Amount: Type the value you wish to convert into the input field. View Result: See the converted value instantly based on the latest exchange rates. Swap: Use the 'Swap' button to quickly reverse the conversion direction.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `MetricCard`, `ToolInput` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `CurrencyConverterClient`, `db`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/currency-converter/page.tsx`
- **Client Component:** `app/(tools)/calculators/currency-converter/CurrencyConverterClient.tsx`
- **Feature Directory:** `src/features/currency-converter`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/currency-converter/store.ts`
- **Content File:** `src/content/tools/currency-converter.ts`
- **Registry File:** `src/registry/tools/currency-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | No |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** Yes
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** No
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `MetricCard`, `ToolInput`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/currency-converter/page.tsx`
  - `app/(tools)/calculators/currency-converter/CurrencyConverterClient.tsx`
  - `app/(tools)/calculators/currency-converter/CurrencyConverterClientWrapper.tsx`
  - `app/(tools)/calculators/currency-converter/layout.tsx`
  - `src/features/currency-converter/components/CurrencyConverterClient.tsx`
  - `src/features/currency-converter/components/CurrencySelect.tsx`
  - `src/features/currency-converter/rates-service.ts`
  - `src/features/currency-converter/store.ts`
  - `src/features/currency-converter/types.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="data-calculator"></a>Data Calculator

#### Identity
- **ID:** `data-calculator`
- **Name:** Data Calculator
- **Category:** Calculators
- **Route:** `/calculators/data-calculator`

#### Purpose
> A comprehensive data utility suite for engineers, students, and digital professionals.

#### Features
- Verifying integrity of a large ISO download using SHA-256
- Estimating how long a 50GB backup will take on a 10Mbps upload
- Converting GiB to GB to understand why a '500GB' drive shows up smaller
- Budgeting cloud storage costs for a medium-term data archive

#### Functionality
Switch between the four tabs: Unit Converter, Transfer Time, Storage Cost, or Checksum. For Unit Converter: Enter a value and select source/target units to see the conversion instantly. For Transfer Time: Enter file size and connection speed. Adjust the overhead slider for real-world estimates. For Storage Cost: Enter data volume, monthly cost per GB, and duration. Use presets for common cloud providers like AWS S3. For Checksum: Paste text or drop a file. Select an algorithm (MD5, SHA-256, etc.) and click generate to compute the hash locally.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell` |
| **Processing Packages** | `next`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/data-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/data-calculator/DataCalculatorWrapper.tsx`
- **Feature Directory:** `src/features/data-calculator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/data-calculator/store.ts`
- **Content File:** `src/content/tools/data-calculator.ts`
- **Registry File:** `src/registry/tools/data-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `unit-converter`, `json-formatter`, `qrcode`
- **Shared Components Used:** `ToolShell`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/data-calculator/page.tsx`
  - `app/(tools)/calculators/data-calculator/DataCalculatorWrapper.tsx`
  - `src/features/data-calculator/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="date-calculator"></a>Date Calculator

#### Identity
- **ID:** `date-calculator`
- **Name:** Date Calculator
- **Category:** Calculators
- **Route:** `/calculators/date-calculator`

#### Purpose
> Add or subtract days, weeks, months, or years from a given date, or calculate the exact difference between two dates in multiple units.

#### Features
- Finding the deadline date N days from today
- Calculating how many days until a project delivery
- Determining someone's age in total days
- Computing the number of days between two contract dates

#### Functionality
To find a future or past date: enter the start date, select an operation (add/subtract), and enter the number of days/weeks/months/years. To find the difference between two dates: enter both dates in the 'Date Difference' tab. The result is displayed in days, weeks, months, and years.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/date-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/date-calculator/DateCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/date-calculator.ts`
- **Registry File:** `src/registry/tools/date-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Date result is off by one day, Resolve issues relating to: Adding months gives an unexpected end date
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/date-calculator/page.tsx`
  - `app/(tools)/calculators/date-calculator/DateCalculatorClient.tsx`
  - `app/(tools)/calculators/date-calculator/DateCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/date-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="discount-calculator"></a>Discount Calculator

#### Identity
- **ID:** `discount-calculator`
- **Name:** Discount Calculator
- **Category:** Calculators
- **Route:** `/calculators/discount-calculator`

#### Purpose
> Calculate the sale price after applying a percentage discount, the percentage discount from original and sale prices, or the original price from a sale price and discount percentage.

#### Features
- Checking the final price of a product during a sale
- Calculating how much you save with a coupon code
- Finding the original price of a clearance item
- Comparing two sales offers to find the better deal

#### Functionality
Select the calculation mode: 'Final Price', 'Discount %', or 'Original Price'. Enter the known values. The missing value and total savings are displayed immediately.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolInput`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/discount-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/discount-calculator/DiscountCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/discount-calculator.ts`
- **Registry File:** `src/registry/tools/discount-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolInput`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Combined discounts don't add up to the sum of percentages, Resolve issues relating to: Result is the discount amount, not the final price
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/discount-calculator/page.tsx`
  - `app/(tools)/calculators/discount-calculator/DiscountCalculatorClient.tsx`
  - `app/(tools)/calculators/discount-calculator/DiscountCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/discount-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="emi-calculator"></a>EMI Calculator

#### Identity
- **ID:** `emi-calculator`
- **Name:** EMI Calculator
- **Category:** Calculators
- **Route:** `/calculators/emi-calculator`

#### Purpose
> 
An **EMI (Equated Monthly Installment)** is the fixed amount you pay every month to repay a loan.

#### Features
- Home Loan EMI Calculator: Plan for your dream house with long-term tenure simulations.
- Personal Loan EMI Calculator: Check affordability for short-term needs or emergencies.
- Car Loan EMI Calculator: Determine the right monthly installment for your next vehicle.
- Education Loan EMI Calculator: Estimate future repayments for student loans.
- Business Loan EMI Calculator: Analyze the impact of capital borrowing on company cash flow.

#### Functionality
**Step 1:** Enter the loan amount you wish to borrow in the principal field. **Step 2:** Input the annual interest rate offered by the lender. **Step 3:** Select the loan tenure in years or months. **Step 4:** View the monthly EMI result, total interest payable, and total repayment amount instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell` |
| **Processing Packages** | `next`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `emi-calculations` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/emi-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/emi-calculator/EmiCalculatorClientWrapper.tsx`
- **Feature Directory:** `src/features/emi-calculator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/emi-calculator/store.ts`
- **Content File:** `src/content/tools/emi-calculator.ts`
- **Registry File:** `src/registry/tools/emi-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `sip-calculator`, `salary-calculator`, `compound-interest`
- **Shared Components Used:** `ToolShell`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Miscalculating the Monthly Interest Rate, Resolve issues relating to: Ignoring Processing Fees
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/emi-calculator/page.tsx`
  - `app/(tools)/calculators/emi-calculator/EmiCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/emi-calculator/layout.tsx`
  - `src/features/emi-calculator/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="financial-freedom-calculator"></a>Financial Freedom Calculator

#### Identity
- **ID:** `financial-freedom-calculator`
- **Name:** Financial Freedom Calculator
- **Category:** Calculators
- **Route:** `/calculators/financial-freedom-calculator`

#### Purpose
> 
The **Financial Freedom Calculator** (often associated with the FIRE movement—Financial Independence, Retire Early) is a comprehensive planning tool designed to help you determine exactly when you can safely stop working for money.

#### Features
- Planning for Early Retirement (FIRE) to determine the exact age you can quit your job.
- Standard Retirement Planning to ensure you have enough corpus at age 60.
- Scenario Analysis to see how a salary increase or lifestyle inflation impacts your financial timeline.
- Visualizing compound interest over long periods using the net worth projection chart.

#### Functionality
**Step 1:** Enter your **Current Age** and your **Target Retirement Age**. **Step 2:** Input your **Current Savings** (invested assets) and your post-tax **Monthly Income** and **Monthly Expenses**. **Step 3:** Set your expectations for the market with **Expected Annual Return**. **Step 4:** Review the results panel to see your **Required Corpus** and the exact **Years to FI**. **Step 5:** Open the Advanced Settings to fine-tune inflation, income growth, and withdrawal rates. **Step 6:** Save different scenarios (e.g., 'Aggressive Savings' vs 'Normal') and compare them side-by-side using the Compare feature.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `ToolResultArea`, `SliderField`, `Accordion`, `ToolInput`, `MetricCard` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion`, `@radix-ui/react-slider`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `financial-freedom-calculator`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/financial-freedom-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomCalculatorClientWrapper.tsx`
- **Feature Directory:** `src/features/financial-freedom-calculator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/financial-freedom-calculator/store.ts`
- **Content File:** `src/content/tools/financial-freedom-calculator.ts`
- **Registry File:** `src/registry/tools/financial-freedom-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `emi-calculator`, `sip-calculator`, `retirement-calculator`, `cagr-calculator`, `safe-to-spend`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `ToolResultArea`, `SliderField`, `Accordion`, `ToolInput`, `MetricCard`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Using Nominal Returns vs Real Returns, Resolve issues relating to: Including Illiquid Assets in Current Savings
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/financial-freedom-calculator/page.tsx`
  - `app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomCalculatorClientWrapper.tsx`
  - `src/features/financial-freedom-calculator/FinancialFreedomCalculatorClient.tsx`
  - `src/features/financial-freedom-calculator/components/ComparisonView.tsx`
  - `src/features/financial-freedom-calculator/components/InputPanel.tsx`
  - `src/features/financial-freedom-calculator/components/ProjectionChart.tsx`
  - `src/features/financial-freedom-calculator/components/ResultsPanel.tsx`
  - `src/features/financial-freedom-calculator/constants.ts`
  - `src/features/financial-freedom-calculator/store.ts`
  - `src/features/financial-freedom-calculator/types.ts`
  - `src/features/financial-freedom-calculator/utils.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="fd-calculator"></a>Fixed Deposit (FD)

#### Identity
- **ID:** `fd-calculator`
- **Name:** Fixed Deposit (FD)
- **Category:** Calculators
- **Route:** `/calculators/fd-calculator`

#### Purpose
> Fixed Deposits (FD) offer guaranteed returns over a set period.

#### Features
- Planning for short-term financial needs
- Comparing FD returns across different banks
- Calculating interest income for tax planning

#### Functionality
Enter the FD principal amount. Enter the annual interest rate. Select the tenure in days, months, or years. Choose the compounding frequency (Quarterly is most common). The tool calculates the maturity amount instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/fd-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/fd-calculator/FDCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/fd-calculator.ts`
- **Registry File:** `src/registry/tools/fd-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/fd-calculator/page.tsx`
  - `app/(tools)/calculators/fd-calculator/FDCalculatorClient.tsx`
  - `app/(tools)/calculators/fd-calculator/FDCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="gratuity-calculator"></a>Gratuity Calculator

#### Identity
- **ID:** `gratuity-calculator`
- **Name:** Gratuity Calculator
- **Category:** Calculators
- **Route:** `/calculators/gratuity-calculator`

#### Purpose
> Estimate standard gratuity benefits based on salary and tenure.

#### Features
- Support for gratuity calculator
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/gratuity-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/gratuity-calculator/GratuityCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/gratuity-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/gratuity-calculator/page.tsx`
  - `app/(tools)/calculators/gratuity-calculator/GratuityCalculatorClient.tsx`
  - `app/(tools)/calculators/gratuity-calculator/GratuityCalculatorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="gst-calculator"></a>GST Calculator

#### Identity
- **ID:** `gst-calculator`
- **Name:** GST Calculator
- **Category:** Calculators
- **Route:** `/calculators/gst-calculator`

#### Purpose
> 
The GST (Goods and Services Tax) Calculator is an essential financial tool for business owners, accountants, and consumers in India.

#### Features
- Support for gst calculator
- Support for calculate gst india
- Support for gst tax calculator
- Support for add gst remove gst
- Support for reverse gst calculator
- Support for cgst sgst igst calculator
- Support for online gst calculator
- Support for gst amount calculator

#### Functionality
Enter Amount: Type the numerical value you want to calculate in the 'Amount' field. Select Slab: Choose the applicable GST rate (5%, 12%, 18%, or 28%) from the dropdown. Choose Type: Select 'Add GST' for exclusive amounts or 'Remove GST' for inclusive amounts. Review Split: Observe the breakdown of Net Amount, CGST, SGST, and the Total Amount. Copy Results: Use the results to populate your invoices or verify your purchase bills.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `CalculatorActionBar`, `ToolInput`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `calculator-utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/gst-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/gst-calculator/GSTCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/gst-calculator.ts`
- **Registry File:** `src/registry/tools/gst-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `CalculatorActionBar`, `ToolInput`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/gst-calculator/page.tsx`
  - `app/(tools)/calculators/gst-calculator/GSTCalculatorClient.tsx`
  - `app/(tools)/calculators/gst-calculator/GSTCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/gst-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="hra-calculator"></a>Hra Calculator

#### Identity
- **ID:** `hra-calculator`
- **Name:** Hra Calculator
- **Category:** Calculators
- **Route:** `/calculators/hra-calculator`

#### Purpose
> Calculate your House Rent Allowance tax exemptions.

#### Features
- Support for hra calculator
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `useUrlState` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/hra-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/hra-calculator/HraCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/hra-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/hra-calculator/page.tsx`
  - `app/(tools)/calculators/hra-calculator/HraCalculatorClient.tsx`
  - `app/(tools)/calculators/hra-calculator/HraCalculatorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="income-tax"></a>Income Tax

#### Identity
- **ID:** `income-tax`
- **Name:** Income Tax
- **Category:** Calculators
- **Route:** `/calculators/income-tax`

#### Purpose
> Calculate annual income tax estimates and select the best tax regime.

#### Features
- Support for income tax
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `useUrlState` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/income-tax/page.tsx`
- **Client Component:** `app/(tools)/calculators/income-tax/IncomeTaxClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/income-tax.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/income-tax/page.tsx`
  - `app/(tools)/calculators/income-tax/IncomeTaxClient.tsx`
  - `app/(tools)/calculators/income-tax/IncomeTaxWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="inflation-calculator"></a>Inflation Calculator

#### Identity
- **ID:** `inflation-calculator`
- **Name:** Inflation Calculator
- **Category:** Calculators
- **Route:** `/calculators/inflation-calculator`

#### Purpose
> Inflation erodes the value of money over time.

#### Features
- Adjusting long-term goals (like a child's college fund) for inflation
- Comparing historical prices to today's values
- Estimating future cost of living

#### Functionality
Enter the amount of money. Enter the average annual inflation rate. Enter the time period in years. Choose between 'Forward' (Future Value) or 'Backward' (Purchasing Power) calculation. The tool displays the adjusted value.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/inflation-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/inflation-calculator/InflationCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/inflation-calculator.ts`
- **Registry File:** `src/registry/tools/inflation-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/inflation-calculator/page.tsx`
  - `app/(tools)/calculators/inflation-calculator/InflationCalculatorClient.tsx`
  - `app/(tools)/calculators/inflation-calculator/InflationCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="invoice-generator"></a>Invoice Generator

#### Identity
- **ID:** `invoice-generator`
- **Name:** Invoice Generator
- **Category:** Calculators
- **Route:** `/calculators/invoice-generator`

#### Purpose
> Create professional, branded invoices instantly with KaruviLab's Invoice Generator.

#### Features
- Freelancers creating professional billing for international clients
- Small business owners generating quick, tax-compliant invoices
- Agencies looking for a private, no-signup invoice creation workspace
- Consultants needing a simple way to track billable hours and expenses

#### Functionality
Step 1: Choose a visual style (Modern, Professional, or Classic) and upload your company logo. Step 2: Enter your business details (From) and your client's information (Bill To). Step 3: Add line items for services or products, specifying quantity and unit price. Step 4: Set the GST/Tax rate and any applicable discounts. Step 5: Review the totals, add professional terms or notes, and click 'Download PDF' to save your invoice locally.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `Toast`, `StatusBadge`, `DropZone`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `useAutoSave`, `types`, `pdf-generator`, `LineItemsSection`, `InvoiceSummarySection` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/invoice-generator/page.tsx`
- **Client Component:** `app/(tools)/calculators/invoice-generator/InvoiceGeneratorClient.tsx`
- **Feature Directory:** `src/features/invoice-generator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/invoice-generator.ts`
- **Registry File:** `src/registry/tools/invoice-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `Toast`, `StatusBadge`, `DropZone`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/invoice-generator/page.tsx`
  - `app/(tools)/calculators/invoice-generator/InvoiceGeneratorClient.tsx`
  - `app/(tools)/calculators/invoice-generator/InvoiceGeneratorClientWrapper.tsx`
  - `src/features/invoice-generator/components/InvoiceSummarySection.tsx`
  - `src/features/invoice-generator/components/LineItemsSection.tsx`
  - `src/features/invoice-generator/types/index.ts`
  - `src/features/invoice-generator/utils/pdf-generator.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="lumpsum-calculator"></a>Lumpsum Calculator

#### Identity
- **ID:** `lumpsum-calculator`
- **Name:** Lumpsum Calculator
- **Category:** Calculators
- **Route:** `/calculators/lumpsum-calculator`

#### Purpose
> Calculate the future value of a one-time investment using the power of compounding.

#### Features
- Estimating the maturity of a one-time fixed deposit
- Planning for a goal with a single large investment
- Visualizing the impact of long-term compounding

#### Functionality
Enter the one-time investment amount. Enter the expected annual interest/return rate. Enter the number of years you plan to stay invested. The tool displays the total maturity value and total interest earned.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `calculator-utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/lumpsum-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/lumpsum-calculator/LumpsumCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/lumpsum-calculator.ts`
- **Registry File:** `src/registry/tools/lumpsum-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/lumpsum-calculator/page.tsx`
  - `app/(tools)/calculators/lumpsum-calculator/LumpsumCalculatorClient.tsx`
  - `app/(tools)/calculators/lumpsum-calculator/LumpsumCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="mutual-fund-returns"></a>Mutual Fund Returns

#### Identity
- **ID:** `mutual-fund-returns`
- **Name:** Mutual Fund Returns
- **Category:** Calculators
- **Route:** `/calculators/mutual-fund-returns`

#### Purpose
> Estimate the growth of your mutual fund investments based on past performance or expected returns.

#### Features
- Projecting long-term wealth creation through mutual funds
- Comparing different fund categories (Equity vs Debt) based on assumed returns
- Planning for financial goals like a house or education

#### Functionality
Enter the initial investment amount or monthly SIP. Set the expected annual return rate based on historical data. Select the investment duration in years. The tool will instantly show the estimated future value and total gains.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `calculator-utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/mutual-fund-returns/page.tsx`
- **Client Component:** `app/(tools)/calculators/mutual-fund-returns/MutualFundReturnsClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/mutual-fund-returns.ts`
- **Registry File:** `src/registry/tools/mutual-fund-returns.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/mutual-fund-returns/page.tsx`
  - `app/(tools)/calculators/mutual-fund-returns/MutualFundReturnsClient.tsx`
  - `app/(tools)/calculators/mutual-fund-returns/MutualFundReturnsClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="nps-calculator"></a>Nps Calculator

#### Identity
- **ID:** `nps-calculator`
- **Name:** Nps Calculator
- **Category:** Calculators
- **Route:** `/calculators/nps-calculator`

#### Purpose
> Calculate National Pension Scheme (NPS) maturity amounts.

#### Features
- Support for nps calculator
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `useUrlState` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/nps-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/nps-calculator/NpsCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/nps-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/nps-calculator/page.tsx`
  - `app/(tools)/calculators/nps-calculator/NpsCalculatorClient.tsx`
  - `app/(tools)/calculators/nps-calculator/NpsCalculatorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="numeral-converter"></a>Numeral & Encoding Converter

#### Identity
- **ID:** `numeral-converter`
- **Name:** Numeral & Encoding Converter
- **Category:** Calculators
- **Route:** `/calculators/numeral-converter`

#### Purpose
> A comprehensive Numeral and Text Converter for Binary, Hexadecimal, Decimal, Octal, ASCII, Base64, URL encoding, HTML entities, and developer escape sequences.

#### Features
- Encoding and decoding developer strings (HTML entities, URL params, Base64, Unicode escapes)
- Converting memory addresses and pointer values across binary/hex formats
- Decoding JSON Web Tokens (JWT) locally to inspect header and payload data safely
- Analyzing text files or inputs down to the raw byte level (UTF-8/UTF-16/UTF-32/CP1252)
- Learning number representations, including custom bases (2-36) and IEEE 754 floating points

#### Functionality
Choose your mode from the tabs: 'Smart Converter' for auto-detection, 'Single Number' for bases/bits/floats, 'Encode/Decode' for format translation, 'Text/Bytes' for multi-byte details, or 'JWT' to decode tokens. In Smart Converter mode, paste any value (hex, binary, base64, URL encoded, HTML entities, Morse, etc.). The tool auto-detects the format and converts it to all other encodings instantly. Use the override dropdown in Smart mode if the auto-detected format needs correction. In Single Number mode, convert numbers across bases 2 to 36, view their two's complement, and interact with the IEEE 754 float visualizer by toggling bits. In JWT mode, paste a JSON Web Token to decode and format the header and payload segments instantly without sending any data to a server.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `Toast`, `ToolSkeleton`, `CopyButton`, `MetricCard` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `conversion-helpers`, `TabNavigation`, `useDebounce`, `InputArea`, `SmartPanel`, `NumberPanel`, `EncodingPanel`, `TextPanel`, `JwtPanel`, `WorkerOrchestrator`, `utils`, `useDragScroll` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/numeral-converter/page.tsx`
- **Client Component:** `app/(tools)/calculators/numeral-converter/NumeralConverterClient.tsx`
- **Feature Directory:** `src/features/numeral-converter`
- **Worker File:** `src/workers/WorkerOrchestrator, src/workers/karuvi.worker.ts`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/numeral-converter.ts`
- **Registry File:** `src/registry/tools/numeral-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** size > 1
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `Toast`, `ToolSkeleton`, `CopyButton`, `MetricCard`
- **Shared Workers Used:** `WorkerOrchestrator`, `karuvi.worker.ts`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/numeral-converter/page.tsx`
  - `app/(tools)/calculators/numeral-converter/NumeralConverterClient.tsx`
  - `app/(tools)/calculators/numeral-converter/NumeralConverterClientWrapper.tsx`
  - `app/(tools)/calculators/numeral-converter/helpers.ts`
  - `app/(tools)/calculators/numeral-converter/layout.tsx`
  - `src/features/numeral-converter/components/EncodingPanel.tsx`
  - `src/features/numeral-converter/components/InputArea.tsx`
  - `src/features/numeral-converter/components/JwtPanel.tsx`
  - `src/features/numeral-converter/components/NumberPanel.tsx`
  - `src/features/numeral-converter/components/SmartPanel.tsx`
  - `src/features/numeral-converter/components/TabNavigation.tsx`
  - `src/features/numeral-converter/components/TextPanel.tsx`
  - `src/features/numeral-converter/hooks/useNumeralConversion.ts`
  - `src/features/numeral-converter/utils/conversion-helpers.ts`
  - `src/features/numeral-converter/utils/morse-map.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="percentage-calculator"></a>Percentage Calculator

#### Identity
- **ID:** `percentage-calculator`
- **Name:** Percentage Calculator
- **Category:** Calculators
- **Route:** `/calculators/percentage-calculator`

#### Purpose
> A versatile percentage calculator covering the most common percentage operations: percentage of a number, percentage change between two values, and finding what percentage one number is of another.

#### Features
- Calculating a percentage discount on a purchase
- Finding the percentage increase in monthly sales
- Computing the percentage of marks scored in an exam
- Splitting a tip as a percentage of a restaurant bill

#### Functionality
Select the type of calculation from the tabs. Enter the required values in the input fields. The result is calculated and displayed instantly. Use the 'Show steps' toggle to see the formula and working.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/percentage-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/percentage-calculator/PercentageCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/percentage-calculator.ts`
- **Registry File:** `src/registry/tools/percentage-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Result is multiplied by 100 when it shouldn't be
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/percentage-calculator/page.tsx`
  - `app/(tools)/calculators/percentage-calculator/PercentageCalculatorClient.tsx`
  - `app/(tools)/calculators/percentage-calculator/PercentageCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/percentage-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="ppf-calculator"></a>PPF Calculator

#### Identity
- **ID:** `ppf-calculator`
- **Name:** PPF Calculator
- **Category:** Calculators
- **Route:** `/calculators/ppf-calculator`

#### Purpose
> The Public Provident Fund (PPF) is one of India's most popular long-term tax-saving investments.

#### Features
- Retirement planning with tax-free returns
- Building a low-risk long-term corpus
- Optimizing Section 80C tax deductions

#### Functionality
Enter your annual investment amount (Max ₹1.5 Lakh). The current PPF interest rate is usually pre-filled but can be adjusted. The tenure is fixed at 15 years by default. View the year-by-year balance and total interest earned.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/ppf-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/ppf-calculator/PPFCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/ppf-calculator.ts`
- **Registry File:** `src/registry/tools/ppf-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/ppf-calculator/page.tsx`
  - `app/(tools)/calculators/ppf-calculator/PPFCalculatorClient.tsx`
  - `app/(tools)/calculators/ppf-calculator/PPFCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="rd-calculator"></a>Recurring Deposit (RD)

#### Identity
- **ID:** `rd-calculator`
- **Name:** Recurring Deposit (RD)
- **Category:** Calculators
- **Route:** `/calculators/rd-calculator`

#### Purpose
> A Recurring Deposit (RD) allows you to save a fixed amount every month and earn interest similar to an FD.

#### Features
- Disciplined monthly savings for a specific goal
- Building a corpus for annual expenses like insurance or school fees
- Low-risk monthly investment strategy

#### Functionality
Enter your monthly deposit amount. Enter the annual interest rate. Enter the deposit tenure in months or years. The tool calculates the total maturity amount and interest earned.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/rd-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/rd-calculator/RDCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/rd-calculator.ts`
- **Registry File:** `src/registry/tools/rd-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/rd-calculator/page.tsx`
  - `app/(tools)/calculators/rd-calculator/RDCalculatorClient.tsx`
  - `app/(tools)/calculators/rd-calculator/RDCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="retirement-calculator"></a>Retirement Planner

#### Identity
- **ID:** `retirement-calculator`
- **Name:** Retirement Planner
- **Category:** Calculators
- **Route:** `/calculators/retirement-calculator`

#### Purpose
> Planning for retirement requires accounting for current expenses, inflation, and life expectancy.

#### Features
- Early retirement planning (FIRE movement)
- Determining if your current savings are on track
- Visualizing the impact of inflation on future expenses

#### Functionality
Enter your current age and planned retirement age. Enter your current monthly expenses. Set the expected inflation rate (usually 6-7% in India). Enter the expected return on your retirement corpus. The tool calculates the total corpus required and the monthly savings needed to reach it.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `Accordion`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/retirement-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/retirement-calculator/RetirementCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/retirement-calculator.ts`
- **Registry File:** `src/registry/tools/retirement-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `Accordion`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/retirement-calculator/page.tsx`
  - `app/(tools)/calculators/retirement-calculator/RetirementCalculatorClient.tsx`
  - `app/(tools)/calculators/retirement-calculator/RetirementCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="safe-to-spend"></a>Safe-to-Spend

#### Identity
- **ID:** `safe-to-spend`
- **Name:** Safe-to-Spend
- **Category:** Calculators
- **Route:** `/calculators/safe-to-spend`

#### Purpose
> Take control of your finances with the Safe-to-Spend budget planner.

#### Features
- Managing monthly discretionary spending
- Planning for a savings goal while maintaining a lifestyle
- Getting a reality check on monthly expenses
- Daily expense tracking for students or professionals

#### Functionality
Enter your monthly after-tax income. List your fixed expenses like rent, bills, and insurance. Set a savings goal as a percentage of your total income. Input your estimated variable expenses (groceries, transport). View your remaining daily and weekly 'safe-to-spend' budget instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/safe-to-spend/page.tsx`
- **Client Component:** `app/(tools)/calculators/safe-to-spend/SafeToSpendClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/safe-to-spend.ts`
- **Registry File:** `src/registry/tools/safe-to-spend.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/safe-to-spend/page.tsx`
  - `app/(tools)/calculators/safe-to-spend/SafeToSpendClient.tsx`
  - `app/(tools)/calculators/safe-to-spend/SafeToSpendClientWrapper.tsx`
  - `app/(tools)/calculators/safe-to-spend/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="salary-calculator"></a>Salary Calculator

#### Identity
- **ID:** `salary-calculator`
- **Name:** Salary Calculator
- **Category:** Calculators
- **Route:** `/calculators/salary-calculator`

#### Purpose
> Break down an Indian CTC (Cost to Company) package into its take-home components: basic salary, HRA, PF, professional tax, income tax (new regime), and net monthly in-hand salary.

#### Features
- Understanding your take-home from a job offer
- Comparing two job offers with different CTC structures
- Estimating income tax liability before filing a return
- Explaining salary components to a new employee

#### Functionality
Enter your annual CTC in the input field. Optionally enter your city type (metro/non-metro) for the HRA calculation. Select the tax regime (old or new) if applicable. Click 'Calculate' to see the full salary breakdown. Download or share the breakdown if needed.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/salary-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/salary-calculator/SalaryCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/salary-calculator.ts`
- **Registry File:** `src/registry/tools/salary-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Calculated in-hand is much lower than expected, Resolve issues relating to: Tax deduction seems too high
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/salary-calculator/page.tsx`
  - `app/(tools)/calculators/salary-calculator/SalaryCalculatorClient.tsx`
  - `app/(tools)/calculators/salary-calculator/SalaryCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/salary-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="sip-calculator"></a>SIP Calculator

#### Identity
- **ID:** `sip-calculator`
- **Name:** SIP Calculator
- **Category:** Calculators
- **Route:** `/calculators/sip-calculator`

#### Purpose
> 
The SIP (Systematic Investment Plan) Calculator is a powerful wealth-planning tool designed to help you estimate the future value of your mutual fund investments.

#### Features
- Support for sip
- Support for investment
- Support for mutual fund
- Support for returns

#### Functionality
Monthly Investment: Enter the amount you plan to invest every month. Return Rate: Input the expected annual rate of return (e.g., 12 for 12%). Investment Period: Set the number of years you intend to stay invested. Calculate: Click 'Calculate' to see the projected maturity value and total gains. Adjust Goals: Modify the values to see how increasing your SIP or tenure impacts the final corpus.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `ToolInput`, `CopyButton`, `Accordion`, `Toast`, `CalculatorActionBar`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `calculator-utils`, `db` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/sip-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/sip-calculator/SIPCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/sip-calculator.ts`
- **Registry File:** `src/registry/tools/sip-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `compound-interest`, `emi-calculator`
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `ToolInput`, `CopyButton`, `Accordion`, `Toast`, `CalculatorActionBar`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/sip-calculator/page.tsx`
  - `app/(tools)/calculators/sip-calculator/SIPCalculatorClient.tsx`
  - `app/(tools)/calculators/sip-calculator/SIPCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/sip-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="smart-converter"></a>Smart Unit Converter

#### Identity
- **ID:** `smart-converter`
- **Name:** Smart Unit Converter
- **Category:** Calculators
- **Route:** `/calculators/smart-converter`

#### Purpose
> A natural-language unit converter that understands requests like '10 km to miles' or '500g in lbs'.

#### Features
- Quickly converting kitchen measurements while cooking
- Converting travel distances between miles and kilometres
- Changing temperatures between Celsius and Fahrenheit
- Converting currency (if supported) or large unit sets

#### Functionality
Type your conversion request in plain English (e.g., '5kg to lbs'). The tool parses your input and displays the result instantly. Use the swap button to reverse the units if needed. Refine your query if the engine doesn't catch it on the first try.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/smart-converter/page.tsx`
- **Client Component:** `app/(tools)/calculators/smart-converter/SmartConverterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/smart-converter.ts`
- **Registry File:** `src/registry/tools/smart-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/smart-converter/page.tsx`
  - `app/(tools)/calculators/smart-converter/SmartConverterClient.tsx`
  - `app/(tools)/calculators/smart-converter/SmartConverterClientWrapper.tsx`
  - `app/(tools)/calculators/smart-converter/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="stock-average-calculator"></a>Stock Average

#### Identity
- **ID:** `stock-average-calculator`
- **Name:** Stock Average
- **Category:** Calculators
- **Route:** `/calculators/stock-average-calculator`

#### Purpose
> When you buy the same stock at different prices (averaging down or up), it's hard to track your true cost basis.

#### Features
- Managing a stock portfolio with multiple buy orders
- Planning an 'average down' strategy for a falling stock
- Calculating the break-even point for a trade

#### Functionality
Add multiple 'Buy' entries with quantity and price per share. The tool calculates the total shares, total cost, and average price. You can also add a 'Target Average' to see how many more shares you need to buy at a certain price.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/stock-average-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/stock-average-calculator/StockAverageCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/stock-average-calculator.ts`
- **Registry File:** `src/registry/tools/stock-average-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/stock-average-calculator/page.tsx`
  - `app/(tools)/calculators/stock-average-calculator/StockAverageCalculatorClient.tsx`
  - `app/(tools)/calculators/stock-average-calculator/StockAverageCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="swp-calculator"></a>SWP Calculator

#### Identity
- **ID:** `swp-calculator`
- **Name:** SWP Calculator
- **Category:** Calculators
- **Route:** `/calculators/swp-calculator`

#### Purpose
> A Systematic Withdrawal Plan (SWP) is the opposite of an SIP.

#### Features
- Generating a monthly pension from a retirement corpus
- Planning for regular income during a career break
- Managing cash flow from a large lumpsum windfall

#### Functionality
Enter the total initial investment (corpus). Enter the monthly withdrawal amount. Enter the expected annual return rate. Enter the duration for which you want to withdraw. The tool shows the remaining balance and total withdrawals made.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/swp-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/swp-calculator/SWPCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/swp-calculator.ts`
- **Registry File:** `src/registry/tools/swp-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/swp-calculator/page.tsx`
  - `app/(tools)/calculators/swp-calculator/SWPCalculatorClient.tsx`
  - `app/(tools)/calculators/swp-calculator/SWPCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="tds-calculator"></a>Tds Calculator

#### Identity
- **ID:** `tds-calculator`
- **Name:** Tds Calculator
- **Category:** Calculators
- **Route:** `/calculators/tds-calculator`

#### Purpose
> Calculate Tax Deducted at Source (TDS) percentages.

#### Features
- Support for tds calculator
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/tds-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/tds-calculator/TdsCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/tds-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/tds-calculator/page.tsx`
  - `app/(tools)/calculators/tds-calculator/TdsCalculatorClient.tsx`
  - `app/(tools)/calculators/tds-calculator/TdsCalculatorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="time-calculator"></a>Time Calculator

#### Identity
- **ID:** `time-calculator`
- **Name:** Time Calculator
- **Category:** Calculators
- **Route:** `/calculators/time-calculator`

#### Purpose
> Add or subtract time durations with ease.

#### Features
- Calculating total hours worked in a day
- Finding the duration of a video or audio file
- Planning travel times with layovers
- Timing cooking durations with multiple steps

#### Functionality
Select a calculation mode: 'Time Difference' or 'Add/Subtract Time'. Enter the start and end times, or the duration values. The result is calculated instantly in HH:MM:SS format. Toggle between 12-hour and 24-hour formats if needed.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/time-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/time-calculator/TimeCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/time-calculator.ts`
- **Registry File:** `src/registry/tools/time-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/time-calculator/page.tsx`
  - `app/(tools)/calculators/time-calculator/TimeCalculatorClient.tsx`
  - `app/(tools)/calculators/time-calculator/TimeCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/time-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="unit-converter"></a>Unit Converter

#### Identity
- **ID:** `unit-converter`
- **Name:** Unit Converter
- **Category:** Calculators
- **Route:** `/calculators/unit-converter`

#### Purpose
> Convert units across categories including length, weight, volume, temperature, speed, area, and time.

#### Features
- Converting recipe measurements from US cups to millilitres
- Converting a vehicle speed from mph to km/h
- Checking a running pace in minutes per kilometre vs. per mile
- Converting property area from square feet to square metres

#### Functionality
Select the unit category (e.g., Length, Weight, Temperature). Enter the value to convert in the left input. Select the source unit and the target unit from the dropdowns. The converted value updates instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/unit-converter/page.tsx`
- **Client Component:** `app/(tools)/calculators/unit-converter/UnitConverterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/unit-converter.ts`
- **Registry File:** `src/registry/tools/unit-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Temperature conversion gives a nonsensical result, Resolve issues relating to: Result has many decimal places
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/unit-converter/page.tsx`
  - `app/(tools)/calculators/unit-converter/UnitConverterClient.tsx`
  - `app/(tools)/calculators/unit-converter/UnitConverterClientWrapper.tsx`
  - `app/(tools)/calculators/unit-converter/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="utc-ist-converter"></a>UTC ↔ IST

#### Identity
- **ID:** `utc-ist-converter`
- **Name:** UTC ↔ IST
- **Category:** Calculators
- **Route:** `/calculators/utc-ist-converter`

#### Purpose
> Quickly convert between Coordinated Universal Time (UTC) and Indian Standard Time (IST).

#### Features
- Decoding server log timestamps into local Indian time
- Scheduling meetings between Indian and international teams
- Calculating trade settlement times for global markets
- Converting GitHub commit times to local time

#### Functionality
Enter a time in the UTC field to see the equivalent IST time. Alternatively, enter an IST time to convert it back to UTC. Use the 'Current Time' button to instantly convert the present moment. The 5-hour 30-minute offset is automatically applied.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/utc-ist-converter/page.tsx`
- **Client Component:** `app/(tools)/calculators/utc-ist-converter/UtcIstConverterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/utc-ist-converter.ts`
- **Registry File:** `src/registry/tools/utc-ist-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/utc-ist-converter/page.tsx`
  - `app/(tools)/calculators/utc-ist-converter/UtcIstConverterClient.tsx`
  - `app/(tools)/calculators/utc-ist-converter/UtcIstConverterClientWrapper.tsx`
  - `app/(tools)/calculators/utc-ist-converter/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="work-hours"></a>Work Hours

#### Identity
- **ID:** `work-hours`
- **Name:** Work Hours
- **Category:** Calculators
- **Route:** `/calculators/work-hours`

#### Purpose
> Track your daily work hours, including breaks and overtime, with this simple timesheet utility.

#### Features
- Filling out weekly timesheets for work
- Calculating pay for freelance or hourly gigs
- Tracking study or project hours
- Verifying payroll accuracy

#### Functionality
Enter your work start time and end time. Specify any break duration in minutes (e.g., 30 for lunch). Enter your hourly rate if you wish to see estimated earnings. The tool calculates total work hours, decimal hours, and total pay.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `CopyButton`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/work-hours/page.tsx`
- **Client Component:** `app/(tools)/calculators/work-hours/WorkHoursClient.tsx`
- **Feature Directory:** `src/features/work-hours`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/work-hours/store.ts`
- **Content File:** `src/content/tools/work-hours.ts`
- **Registry File:** `src/registry/tools/work-hours.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `CopyButton`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/work-hours/page.tsx`
  - `app/(tools)/calculators/work-hours/WorkHoursClient.tsx`
  - `app/(tools)/calculators/work-hours/WorkHoursClientWrapper.tsx`
  - `app/(tools)/calculators/work-hours/layout.tsx`
  - `src/features/work-hours/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="world-clock"></a>World Clock

#### Identity
- **ID:** `world-clock`
- **Name:** World Clock
- **Category:** Calculators
- **Route:** `/calculators/world-clock`

#### Purpose
> Track current time across multiple global cities simultaneously with our responsive World Clock.

#### Features
- Coordinating calls with offshore development teams
- Tracking opening hours of global stock exchanges
- Staying connected with family living in different time zones
- Planning international travel itineraries

#### Functionality
Search for a city or country in the search bar. Click 'Add' to include the location in your dashboard. View the current time, date, and time zone for all saved cities. Remove cities by clicking the 'X' or 'Remove' button. Toggle between digital and analog views (if available).

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `lucide-react`, `@radix-ui/react-popover`, `@dnd-kit/core`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `FullscreenContext` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/world-clock/page.tsx`
- **Client Component:** `app/(tools)/calculators/world-clock/WorldClockClient.tsx`
- **Feature Directory:** `src/features/world-clock`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/world-clock/store.ts`
- **Content File:** `src/content/tools/world-clock.ts`
- **Registry File:** `src/registry/tools/world-clock.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** `useSupportStore`
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/world-clock/page.tsx`
  - `app/(tools)/calculators/world-clock/ClockCard.tsx`
  - `app/(tools)/calculators/world-clock/WorldClockClient.tsx`
  - `app/(tools)/calculators/world-clock/WorldClockClientWrapper.tsx`
  - `app/(tools)/calculators/world-clock/layout.tsx`
  - `app/(tools)/calculators/world-clock/utils.ts`
  - `src/features/world-clock/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---


