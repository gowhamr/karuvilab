const fs = require('fs');
const path = require('path');

const iso8583VsIso20022 = {
  title: 'ISO 8583 vs ISO 20022: The Definitive A-Z Payment Messaging Guide',
  date: '2026-08-10',
  description: 'An exhaustive A-Z technical comparison of ISO 8583 (card payment switches) and ISO 20022 (universal XML/JSON financial messaging), covering architecture, bitmaps, MTI codes, pacs/pain/camt schemas, response codes, flows, security, and migration mapping.',
  content: `
<p class="text-xl text-text font-medium leading-relaxed mb-6">
Payment messaging is the foundational nervous system of modern global finance. Every time a card is swiped at a point of sale, an online payment is processed, or an interbank wire transfer settles across borders, financial systems exchange structured messages. Two global standards dominate this landscape: <strong>ISO 8583</strong> (the classic bitmap-driven standard for card transactions) and <strong>ISO 20022</strong> (the rich, XML/JSON schema-driven standard for universal financial messaging).
</p>

<div class="my-6 p-6 bg-surface-2 border-l-4 border-primary rounded-r-2xl shadow-sm">
  <h3 class="text-lg font-bold text-text mb-2">💡 Quick Summary for Engineers</h3>
  <p class="text-text-muted text-sm leading-relaxed">
    <strong>ISO 8583</strong> is lightweight, ultra-fast, and bitmap-encoded—ideal for high-throughput, low-latency POS/ATM card authorizations. 
    <strong>ISO 20022</strong> is rich, self-describing, and XML/JSON-schema structured—ideal for complex cross-border wire transfers, real-time gross settlement (RTGS/FedNow), automated AML/sanction screening, and corporate cash management.
  </p>
</div>

<!-- Table of Contents / Index -->
<nav id="table-of-contents" class="my-8 p-6 bg-surface-2 border border-border rounded-2xl shadow-sm">
  <h2 class="text-xl font-bold text-text mb-4 flex items-center gap-2">
    <span>📋</span> Table of Contents (Index)
  </h2>
  <ol class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-text font-medium">
    <li><a href="#section-1" class="text-primary hover:underline">1. Executive Summary & Historical Evolution</a></li>
    <li><a href="#section-2" class="text-primary hover:underline">2. Architecture & Data Structures (Bitmaps vs Schemas)</a></li>
    <li><a href="#section-3" class="text-primary hover:underline">3. Message Types & Classification Matrix</a></li>
    <li><a href="#section-4" class="text-primary hover:underline">4. Response Codes & Action/Reason Codes</a></li>
    <li><a href="#section-5" class="text-primary hover:underline">5. Message Categories & End-to-End Payment Flows</a></li>
    <li><a href="#section-6" class="text-primary hover:underline">6. Step-by-Step Flow Diagrams</a></li>
    <li><a href="#section-7" class="text-primary hover:underline">7. Security, Cryptography & Data Integrity</a></li>
    <li><a href="#section-8" class="text-primary hover:underline">8. Deep-Dive Comparison Matrix (Pros & Cons)</a></li>
    <li><a href="#section-9" class="text-primary hover:underline">9. Co-Existence, Mapping & Interoperability Gateways</a></li>
    <li><a href="#section-10" class="text-primary hover:underline">10. Architectural Recommendations for Engineers</a></li>
  </ol>
</nav>

<hr class="my-8 border-border" />

<!-- Section 1 -->
<h2 id="section-1" class="text-2xl font-bold text-text mt-12 mb-4">1. Executive Summary & Historical Evolution</h2>
<p>
Financial transaction messaging relies on strict standards to ensure that sender banks, payment networks, acquirers, and issuer banks interpret transaction details identically. 
Without standardized syntax and semantic rules, automated routing, clearing, and settlement across heterogeneous software systems would be impossible.
</p>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 8583: The Workhorse of Card Payments (1987)</h3>
<p>
Introduced in 1987 by the International Organization for Standardization (ISO), <strong>ISO 8583</strong> ("Financial transaction card originated messages — Interchange message specifications") was designed during an era dominated by dial-up modems (9600 baud), constrained network bandwidth, and limited server memory.
To minimize byte payload size over slow lines, ISO 8583 uses a compact <strong>bitmap indexing mechanism</strong> where presence or absence of data fields is indicated by binary bitflags rather than verbose string key-names.
ISO 8583 powers major card networks including Visa (VIS/BASE I), Mastercard (CIS/MIP), American Express, China UnionPay, and national ATM/POS switching networks worldwide.
</p>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 20022: The Rich, Universal Financial Standard (2004–Present)</h3>
<p>
As global banking expanded, traditional message formats (such as legacy SWIFT MT text lines and legacy clearing formats) suffered from severe limitations: truncated party names, lack of structured addresses, absence of remittance details, and vendor-proprietary variations.
In 2004, ISO published <strong>ISO 20022</strong> ("Financial Services — Universal Financial Industry Message Scheme"), introducing a modern, model-driven methodology (UNIFI).
Rather than being tied to a single binary encoding, ISO 20022 defines an abstract business dictionary and logical schema that maps directly to self-describing <strong>XML</strong>, <strong>JSON</strong>, or <strong>ASN.1</strong> encodings.
ISO 20022 has become the mandatory standard for SWIFT CBPR+ cross-border payments, FedNow (US), Target2/TIPS (Eurozone), SEPA Instant, CHIPS, and national real-time payments systems worldwide.
</p>

<!-- Section 2 -->
<h2 id="section-2" class="text-2xl font-bold text-text mt-12 mb-4">2. Architecture & Data Structures (Bitmaps vs Schemas)</h2>
<p>
The structural architectural differences between ISO 8583 and ISO 20022 reflect two fundamentally different engineering paradigms.
</p>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 8583 Message Frame Breakdown</h3>
<p>An ISO 8583 message frame consists of three main structural layers:</p>
<ol class="list-decimal pl-6 space-y-2 text-text mb-6">
  <li><strong>Message Header:</strong> Contains transport-level routing details (e.g., TPDU, length indicators, or network protocol headers).</li>
  <li><strong>Message Type Identifier (MTI):</strong> A 4-digit numeric code specifying the message version, class, function, and originator.</li>
  <li><strong>Bitmaps & Data Elements (DE):</strong> 
    <ul class="list-disc pl-6 mt-1 space-y-1">
      <li><strong>Primary Bitmap (8 bytes / 64 bits):</strong> Bit 1 indicates if a Secondary Bitmap exists; bits 2–64 signal presence of Data Elements 2 to 64.</li>
      <li><strong>Secondary Bitmap (8 bytes / 64 bits):</strong> Bit 65 to 128 signal presence of Data Elements 65 to 128.</li>
      <li><strong>Data Elements (DE 1 – DE 128):</strong> Fixed-length fields (e.g., DE 4 Amount = 12 numeric digits) or Variable-length fields prefixed by length indicators (LLVAR = 2-digit length prefix; LLLVAR = 3-digit length prefix).</li>
    </ul>
  </li>
</ol>

<p class="mb-4">Below is a raw ASCII/Hex structural view of an ISO 8583 <code>0100</code> Authorization Request payload:</p>
<pre class="bg-surface-2 p-4 rounded-xl text-xs font-mono text-primary border border-border overflow-x-auto mb-6"><code>[Header: 5 bytes TPDU] [MTI: 0100] [Primary Bitmap: 72 20 00 01 08 C0 00 00]
DE 002 (LLVAR): 16 4111111111111111       (Card Number / PAN)
DE 003 (Fixed): 000000                   (Processing Code: Purchase)
DE 004 (Fixed): 000000005000             (Amount: $50.00)
DE 007 (Fixed): 0810201130               (MMDDhhmmss: Aug 10 20:11:30)
DE 011 (Fixed): 000042                   (STAN: System Trace Audit Number)
DE 041 (Fixed): TERM0001                 (Card Acceptor Terminal ID)
DE 049 (Fixed): 840                      (Currency Code: USD)</code></pre>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 20022 Object Model & XML Schema Breakdown</h3>
<p>
ISO 20022 uses a layered, object-oriented model defined by UML diagrams and formal W3C XML Schema Definitions (XSD).
An ISO 20022 message envelope contains two core elements:
</p>
<ol class="list-decimal pl-6 space-y-2 text-text mb-6">
  <li><strong>Business Application Header (<code>head.001.001.03</code> / BAH):</strong> Contains routing headers, message sender (<code>Fr</code>), receiver (<code>To</code>), creation date (<code>CreDt</code>), business message ID (<code>BizMsgIdr</code>), and XML Digital Signature (<code>Sgntr</code>).</li>
  <li><strong>Document (Message Body):</strong> The payload containing domain-specific elements (e.g., <code>pacs.008.001.10</code> for Customer Credit Transfer).</li>
</ol>

<pre class="bg-surface-2 p-4 rounded-xl text-xs font-mono text-primary border border-border overflow-x-auto mb-6"><code>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.10"&gt;
  &lt;FIToFICstmrCdtTrf&gt;
    &lt;GrpHdr&gt;
      &lt;MsgId&gt;MSG20260810-998812&lt;/MsgId&gt;
      &lt;CreDtTm&gt;2026-08-10T20:11:30Z&lt;/CreDtTm&gt;
      &lt;NbOfTxs&gt;1&lt;/NbOfTxs&gt;
      &lt;SttlmInf&gt;&lt;SttlmMtd&gt;CLRG&lt;/SttlmMtd&gt;&lt;/SttlmInf&gt;
    &lt;/GrpHdr&gt;
    &lt;CdtTrfTxInf&gt;
      &lt;PmtId&gt;
        &lt;EndToEndId&gt;E2E-9948102-X&lt;/EndToEndId&gt;
        &lt;UETR&gt;c4b2a198-7612-4211-9a10-239184719201&lt;/UETR&gt;
      &lt;/PmtId&gt;
      &lt;IntrBkSttlmAmt Ccy="USD"&gt;50.00&lt;/IntrBkSttlmAmt&gt;
      &lt;Dbtr&gt;&lt;Nm&gt;Jane Doe&lt;/Nm&gt;&lt;/Dbtr&gt;
      &lt;DbtrAcct&gt;&lt;Id&gt;&lt;Othr&gt;&lt;Id&gt;9981023910&lt;/Id&gt;&lt;/Othr&gt;&lt;/Id&gt;&lt;/DbtrAcct&gt;
      &lt;Cdtr&gt;&lt;Nm&gt;Acme Supplies LLC&lt;/Nm&gt;&lt;/Cdtr&gt;
      &lt;CdtrAcct&gt;&lt;Id&gt;&lt;Othr&gt;&lt;Id&gt;1002938192&lt;/Id&gt;&lt;/Othr&gt;&lt;/Id&gt;&lt;/CdtrAcct&gt;
      &lt;RmtInf&gt;&lt;Ustrd&gt;Invoice #INV-2026-881 Payment&lt;/Ustrd&gt;&lt;/RmtInf&gt;
    &lt;/CdtTrfTxInf&gt;
  &lt;/FIToFICstmrCdtTrf&gt;
&lt;/Document&gt;</code></pre>

<!-- Section 3 -->
<h2 id="section-3" class="text-2xl font-bold text-text mt-12 mb-4">3. Message Types & Classification Matrix</h2>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 8583 MTI Taxonomy</h3>
<p>The 4-digit MTI code is decoded as follows:</p>
<div class="overflow-x-auto my-4">
  <table class="w-full text-left text-sm border-collapse border border-border">
    <thead>
      <tr class="bg-surface-2 text-text">
        <th class="p-3 border border-border">Digit Position</th>
        <th class="p-3 border border-border">Meaning</th>
        <th class="p-3 border border-border">Values & Description</th>
      </tr>
    </thead>
    <tbody class="text-text-muted">
      <tr>
        <td class="p-3 border border-border font-bold text-text">Digit 1</td>
        <td class="p-3 border border-border">ISO 8583 Version</td>
        <td class="p-3 border border-border"><code>0</code> = 1987, <code>1</code> = 1993, <code>2</code> = 2003 version</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-text">Digit 2</td>
        <td class="p-3 border border-border">Message Class</td>
        <td class="p-3 border border-border"><code>1</code>=Authorization, <code>2</code>=Financial, <code>3</code>=File Action, <code>4</code>=Reversal/Chargeback, <code>5</code>=Reconciliation, <code>8</code>=Network Management</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-text">Digit 3</td>
        <td class="p-3 border border-border">Message Function</td>
        <td class="p-3 border border-border"><code>0</code>=Request, <code>1</code>=Request Response, <code>2</code>=Advice, <code>3</code>=Advice Response, <code>4</code>=Notification</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-text">Digit 4</td>
        <td class="p-3 border border-border">Message Originator</td>
        <td class="p-3 border border-border"><code>0</code>=Acquirer, <code>1</code>=Acquirer Repeat, <code>2</code>=Issuer, <code>3</code>=Issuer Repeat, <code>4</code>=Other</td>
      </tr>
    </tbody>
  </table>
</div>

<p class="mt-4 mb-2">Common ISO 8583 Message Pairs:</p>
<ul class="list-disc pl-6 space-y-1 text-text mb-6">
  <li><code>0100</code> / <code>0110</code>: Authorization Request / Authorization Response</li>
  <li><code>0200</code> / <code>0210</code>: Financial Presentment Request / Response</li>
  <li><code>0400</code> / <code>0410</code>: Reversal Request / Response (Cancels a failed or timed-out transaction)</li>
  <li><code>0800</code> / <code>0810</code>: Network Management Request / Response (Echo test, sign-on, key exchange)</li>
</ul>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 20022 Business Domains & Identifiers</h3>
<p>ISO 20022 messages use a 4-part identifier format: <code>[Domain].[Message ID].[Variant].[Version]</code></p>
<div class="overflow-x-auto my-4">
  <table class="w-full text-left text-sm border-collapse border border-border">
    <thead>
      <tr class="bg-surface-2 text-text">
        <th class="p-3 border border-border">Business Domain</th>
        <th class="p-3 border border-border">Message Identifier</th>
        <th class="p-3 border border-border">Description & Primary Purpose</th>
      </tr>
    </thead>
    <tbody class="text-text-muted">
      <tr>
        <td class="p-3 border border-border font-bold text-primary">pacs (Clearing & Settlement)</td>
        <td class="p-3 border border-border font-mono text-text">pacs.008.001.10</td>
        <td class="p-3 border border-border">Financial Institution Customer Credit Transfer (Interbank settlement)</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-primary">pacs (Clearing & Settlement)</td>
        <td class="p-3 border border-border font-mono text-text">pacs.009.001.09</td>
        <td class="p-3 border border-border">Financial Institution Direct Credit Transfer (Bank-to-Bank liquidity)</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-primary">pacs (Clearing & Settlement)</td>
        <td class="p-3 border border-border font-mono text-text">pacs.002.001.12</td>
        <td class="p-3 border border-border">Payment Status Report (Confirmation, pending notice, or rejection)</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-primary">pain (Payment Initiation)</td>
        <td class="p-3 border border-border font-mono text-text">pain.001.001.11</td>
        <td class="p-3 border border-border">Customer Credit Transfer Initiation (Corporate customer to bank)</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-primary">camt (Cash Management)</td>
        <td class="p-3 border border-border font-mono text-text">camt.053.001.11</td>
        <td class="p-3 border border-border">Bank-to-Customer Statement (End-of-day detailed account statement)</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-primary">camt (Cash Management)</td>
        <td class="p-3 border border-border font-mono text-text">camt.056.001.11</td>
        <td class="p-3 border border-border">Payment Cancellation Request (Recall of a previously settled payment)</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Section 4 -->
<h2 id="section-4" class="text-2xl font-bold text-text mt-12 mb-4">4. Response Codes & Action/Reason Codes</h2>
<p>When a transaction is processed, the receiving entity returns explicit status codes indicating outcome or error reasons.</p>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 8583 Response Codes (Data Element 39)</h3>
<p>DE 39 is a 2-digit alphanumeric field containing action codes:</p>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
  <div class="p-3 bg-surface-2 border border-border rounded-xl">
    <div class="font-mono text-emerald-400 font-bold text-lg">00</div>
    <div class="text-xs text-text font-medium">Approved / Transaction Successful</div>
  </div>
  <div class="p-3 bg-surface-2 border border-border rounded-xl">
    <div class="font-mono text-rose-400 font-bold text-lg">05</div>
    <div class="text-xs text-text font-medium">Do Not Honor (Generic Issuer Decline)</div>
  </div>
  <div class="p-3 bg-surface-2 border border-border rounded-xl">
    <div class="font-mono text-amber-400 font-bold text-lg">51</div>
    <div class="text-xs text-text font-medium">Insufficient Funds</div>
  </div>
  <div class="p-3 bg-surface-2 border border-border rounded-xl">
    <div class="font-mono text-amber-400 font-bold text-lg">54</div>
    <div class="text-xs text-text font-medium">Expired Card</div>
  </div>
  <div class="p-3 bg-surface-2 border border-border rounded-xl">
    <div class="font-mono text-amber-400 font-bold text-lg">55</div>
    <div class="text-xs text-text font-medium">Incorrect PIN</div>
  </div>
  <div class="p-3 bg-surface-2 border border-border rounded-xl">
    <div class="font-mono text-rose-400 font-bold text-lg">91</div>
    <div class="text-xs text-text font-medium">Issuer or Switch Inoperative / Timeout</div>
  </div>
</div>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 20022 Status & Reason Code Scheme</h3>
<p>ISO 20022 uses a two-tier hierarchy: high-level Transaction Group Status (e.g., in <code>pacs.002</code>) combined with granular ISO Reason Codes.</p>
<ul class="list-disc pl-6 space-y-2 text-text mb-6">
  <li><strong>Group Status Codes:</strong>
    <ul class="list-square pl-6 mt-1 text-text-muted space-y-1 text-sm">
      <li><code>ACTC</code>: Accepted Technical Validation (Schema and signature passed).</li>
      <li><code>ACCP</code>: Accepted Customer Profile (Pre-settlement checks complete).</li>
      <li><code>ACSP</code>: Accepted Settlement In Process (Funds undergoing clearing).</li>
      <li><code>ACSC</code>: Accepted Settlement Completed (Final irrevocable settlement done).</li>
      <li><code>RJCT</code>: Rejected (Payment permanently rejected).</li>
    </ul>
  </li>
  <li><strong>Granular Reason Codes (<code>StsRsnInf/Rsn/Cd</code>):</strong>
    <ul class="list-square pl-6 mt-1 text-text-muted space-y-1 text-sm">
      <li><code>AB01</code>: Aborted (System error or infrastructure failure).</li>
      <li><code>AC01</code>: Incorrect Account Number / IBAN checksum failure.</li>
      <li><code>AM04</code>: Insufficient Funds.</li>
      <li><code>AG01</code>: Payment prohibited on restricted account/card.</li>
      <li><code>LEGL</code>: Legal or regulatory prohibition (e.g., OFAC/EU Sanction match).</li>
      <li><code>NARR</code>: Narrative (Unstructured reason detail in text node).</li>
    </ul>
  </li>
</ul>

<!-- Section 5 -->
<h2 id="section-5" class="text-2xl font-bold text-text mt-12 mb-4">5. Message Categories & End-to-End Payment Flows</h2>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 8583: Card Authorization & Dual Message Processing</h3>
<p>In card networks, payment processing is usually divided into two phases:</p>
<ol class="list-decimal pl-6 space-y-2 text-text mb-6">
  <li><strong>Phase 1: Real-Time Authorization (Dual Message System - DMS):</strong>
    The terminal sends a <code>0100</code> request to hold funds on the customer card. 
    The Issuer Bank evaluates credit limit and fraud rules, returning <code>0110</code> with approval code (DE 38) within milliseconds.
  </li>
  <li><strong>Phase 2: Clearing & Settlement Presentment:</strong>
    At day end, the merchant host batches captured sales into <code>0200</code> financial presentment messages (or a clearing file) sent to the card scheme switch for interbank settlement.
  </li>
</ol>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 20022: End-to-End Real-Time Credit Transfer</h3>
<p>Modern instant payments (such as SEPA Instant or FedNow) operate as a single-pass real-time credit transfer:</p>
<ol class="list-decimal pl-6 space-y-2 text-text mb-6">
  <li><strong>Initiation:</strong> Debtor submits <code>pain.001</code> to Debtor Bank.</li>
  <li><strong>Interbank Processing:</strong> Debtor Bank sends <code>pacs.008</code> to Instant Payment Switch / RTGS.</li>
  <li><strong>Settlement & Confirmation:</strong> RTGS reserves liquidity, sends <code>pacs.008</code> to Creditor Bank, receives <code>pacs.002</code> (ACSC), and delivers immediate funds availability notice to Creditor.</li>
</ol>

<!-- Section 6 -->
<h2 id="section-6" class="text-2xl font-bold text-text mt-12 mb-4">6. Step-by-Step Flow Diagrams</h2>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 8583 Card Authorization Flow Diagram</h3>
<pre class="bg-surface-2 p-4 rounded-xl text-xs font-mono text-primary border border-border overflow-x-auto mb-8"><code>[Cardholder] --(Swipe/Dip/Tap)--> [POS / ATM]
                                    |
                                    | ISO 8583 0100 (Auth Req: PAN, Amt, DE 52 PIN)
                                    v
                            [Acquirer Switch]
                                    |
                                    | ISO 8583 0100 (Network Routing)
                                    v
                          [Card Scheme Switch] (Visa / Mastercard)
                                    |
                                    | ISO 8583 0100
                                    v
                           [Issuer Bank HSM & Core]
                                    |
                                    | Validate PIN (DE 52), Check Balance, MAC (DE 64)
                                    | ISO 8583 0110 (Auth Resp: DE 39 = "00")
                                    v
                          [Card Scheme Switch]
                                    |
                                    | ISO 8583 0110
                                    v
                            [Acquirer Switch]
                                    |
                                    | Print Receipt / Complete Sale
                                    v
                               [POS / ATM]</code></pre>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 20022 Interbank Settlement Flow Diagram</h3>
<pre class="bg-surface-2 p-4 rounded-xl text-xs font-mono text-primary border border-border overflow-x-auto mb-8"><code>[Debtor] --(pain.001 Initiation)--> [Debtor Bank]
                                       |
                                       | Validate XML Schema & Account Balance
                                       | ISO 20022 pacs.008 (Credit Transfer)
                                       v
                           [RTGS / FedNow / SWIFT MX]
                                       |
                                       | Reserve Liquidity & Check Sanctions (LEGL)
                                       | Forward pacs.008
                                       v
                                [Creditor Bank]
                                       |
                                       | Credit Beneficiary Account
                                       | Return pacs.002 (Status: ACSC - Accepted Settlement Completed)
                                       v
                           [RTGS / FedNow / SWIFT MX]
                                       |
                                       | Forward pacs.002 Notification
                                       v
                                 [Debtor Bank]</code></pre>

<!-- Section 7 -->
<h2 id="section-7" class="text-2xl font-bold text-text mt-12 mb-4">7. Security, Cryptography & Data Integrity</h2>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 8583 Cryptography (PIN Blocks, MAC & HSMs)</h3>
<p>Because ISO 8583 carries raw cardholder data (PAN, CVV, PIN), strict cryptographic protection is mandatory:</p>
<ul class="list-disc pl-6 space-y-2 text-text mb-6">
  <li><strong>PIN Block Encryption (DE 52):</strong> ISO 9564-1 specifies standard PIN block formats (Format 0, Format 1, Format 3, Format 4). PINs are encrypted using DUKPT (Derived Unique Key Per Transaction) or Master/Session key schemes inside tamper-resistant <strong>Hardware Security Modules (HSMs)</strong>.</li>
  <li><strong>Message Authentication Code (DE 64 / DE 128 - MAC):</strong> To prevent field tampering over transit, a cryptographic hash (using ANSI X9.9 or ANSI X9.19 Triple-DES/AES-MAC) is generated over selected data elements and attached at the end of the payload.</li>
</ul>

<h3 class="text-xl font-bold text-text mt-6 mb-3">ISO 20022 Cryptography (XML Signatures, PKI & LEI)</h3>
<p>ISO 20022 enforces security at both transport and payload application levels:</p>
<ul class="list-disc pl-6 space-y-2 text-text mb-6">
  <li><strong>W3C XML Digital Signatures (<code>ds:Signature</code>):</strong> Attached inside the Business Application Header (BAH), utilizing RSA-SHA256 asymmetric keys to guarantee non-repudiation and message payload integrity.</li>
  <li><strong>Mutual TLS (mTLS 1.3):</strong> Enforces client and server PKI certificate authentication across all node connections.</li>
  <li><strong>Legal Entity Identifier (LEI - ISO 17442):</strong> Embeds verified 20-digit corporate codes within party elements, allowing automated anti-money laundering (AML) and OFAC sanction screening engines to eliminate false positives.</li>
</ul>

<!-- Section 8 -->
<h2 id="section-8" class="text-2xl font-bold text-text mt-12 mb-4">8. Deep-Dive Comparison Matrix (Pros & Cons)</h2>
<div class="overflow-x-auto my-6">
  <table class="w-full text-left text-sm border-collapse border border-border">
    <thead>
      <tr class="bg-surface-2 text-text">
        <th class="p-3 border border-border">Feature / Dimension</th>
        <th class="p-3 border border-border">ISO 8583 Standard</th>
        <th class="p-3 border border-border">ISO 20022 Standard</th>
      </tr>
    </thead>
    <tbody class="text-text-muted">
      <tr>
        <td class="p-3 border border-border font-bold text-text">Primary Domain</td>
        <td class="p-3 border border-border">Card POS, ATM, Merchant Acquiring, Debit/Credit Switches</td>
        <td class="p-3 border border-border font-semibold text-primary">Cross-border wires, RTGS, FedNow, ACH, Open Banking</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-text">Message Encoding</td>
        <td class="p-3 border border-border font-semibold text-emerald-400">Binary, ASCII, EBCDIC, BCD (Bitmap Index)</td>
        <td class="p-3 border border-border">XML, JSON, ASN.1 (Self-describing DOM)</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-text">Payload Footprint</td>
        <td class="p-3 border border-border font-semibold text-emerald-400">Tiny (200 bytes – 1 KB per message)</td>
        <td class="p-3 border border-border">Large (5 KB – 50 KB per message)</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-text">Parsing Overhead</td>
        <td class="p-3 border border-border font-semibold text-emerald-400">Ultra-fast (Bitmask bit shift in microseconds)</td>
        <td class="p-3 border border-border">Moderate (XML DOM tree parsing in milliseconds)</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-text">Remittance Information</td>
        <td class="p-3 border border-border text-rose-400">Limited (DE 48 max ~30-100 characters text)</td>
        <td class="p-3 border border-border font-semibold text-primary">Rich (Up to 140+ structured/unstructured chars + ISO invoice references)</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-text">Character Set</td>
        <td class="p-3 border border-border">ASCII / EBCDIC (Limited multi-language support)</td>
        <td class="p-3 border border-border font-semibold text-emerald-400">Full UTF-8 / UTF-16 Unicode support</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-text">Schema Validation</td>
        <td class="p-3 border border-border">Custom switch parser validation</td>
        <td class="p-3 border border-border font-semibold text-emerald-400">Strict W3C XML Schema (XSD) automated validation</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-bold text-text">Sanction Screening</td>
        <td class="p-3 border border-border text-rose-400">Difficult (Names concatenated into unformatted fields)</td>
        <td class="p-3 border border-border font-semibold text-emerald-400">Native (Structured Name, Street, Postal Code, Country, LEI)</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Section 9 -->
<h2 id="section-9" class="text-2xl font-bold text-text mt-12 mb-4">9. Co-Existence, Mapping & Interoperability Gateways</h2>
<p>
The financial industry is currently navigating a multi-year global migration. 
While SWIFT CBPR+ cross-border payments have mandated ISO 20022 MX, legacy card networks and core banking switches still rely heavily on ISO 8583.
Payment gateways must frequently translate between the two standards.
</p>

<h3 class="text-xl font-bold text-text mt-6 mb-3">Field Mapping Matrix: ISO 8583 ↔ ISO 20022</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-left text-sm border-collapse border border-border">
    <thead>
      <tr class="bg-surface-2 text-text">
        <th class="p-3 border border-border">ISO 8583 Field</th>
        <th class="p-3 border border-border">ISO 20022 XML Node Path</th>
        <th class="p-3 border border-border">Mapping Considerations</th>
      </tr>
    </thead>
    <tbody class="text-text-muted">
      <tr>
        <td class="p-3 border border-border font-mono text-text">DE 002 (PAN)</td>
        <td class="p-3 border border-border font-mono text-primary">CdtTrfTxInf/DbtrAcct/Id/Othr/Id</td>
        <td class="p-3 border border-border">PAN maps to account ID; requires tokenization mask</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-mono text-text">DE 004 (Amount)</td>
        <td class="p-3 border border-border font-mono text-primary">CdtTrfTxInf/IntrBkSttlmAmt</td>
        <td class="p-3 border border-border">ISO 8583 implicit 2 decimal places mapped to XML float attribute <code>Ccy</code></td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-mono text-text">DE 011 (STAN)</td>
        <td class="p-3 border border-border font-mono text-primary">CdtTrfTxInf/PmtId/EndToEndId</td>
        <td class="p-3 border border-border">6-digit STAN padded into UUID or EndToEndId string</td>
      </tr>
      <tr>
        <td class="p-3 border border-border font-mono text-text">DE 039 (Action Code)</td>
        <td class="p-3 border border-border font-mono text-primary">PmtStsRpt/TxInfAndSts/StsRsnInf/Rsn/Cd</td>
        <td class="p-3 border border-border">DE 39 <code>00</code> → Status <code>ACSC</code>; DE 39 <code>51</code> → Reason Code <code>AM04</code></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="my-6 p-6 bg-surface-2 border-l-4 border-amber-500 rounded-r-2xl shadow-sm">
  <h3 class="text-lg font-bold text-text mb-2">⚠️ The Data Truncation Risk</h3>
  <p class="text-text-muted text-sm leading-relaxed">
    When mapping from ISO 20022 to ISO 8583, structured addresses (140+ chars) and Unicode party names from <code>pacs.008</code> cannot fit into fixed 30-char ISO 8583 fields. 
    Payment adapters must implement safe truncation logging or store full enriched payload metadata in an off-line database index using the transaction UETR (Unique End-to-End Transaction Reference).
  </p>
</div>

<!-- Section 10 -->
</ol>
`
};

console.log("ISO 8583 vs ISO 20022 Object created successfully!");
module.exports = { iso8583VsIso20022 };

