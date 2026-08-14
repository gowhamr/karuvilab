import React from 'react';
import { Download, Printer } from 'lucide-react';
import { InvoiceMeta, PaymentStatus } from '../types';

interface Totals {
  subtotal: number;
  discountAmt: number;
  afterDiscount: number;
  tax: number;
  total: number;
}

interface InvoiceSummarySectionProps {
  meta: InvoiceMeta;
  setMeta: (meta: InvoiceMeta) => void;
  totals: Totals;
  currency: string;
  discount: number;
  setDiscount: (d: number) => void;
  taxRate: number;
  setTaxRate: (t: number) => void;
  notes: string;
  setNotes: (n: string) => void;
  terms: string;
  setTerms: (t: string) => void;
  handlePrint: () => void;
  generatePDF: () => void;
  isGenerating: boolean;
}

export const InvoiceSummarySection = ({
  meta, setMeta, totals, currency, discount, setDiscount, taxRate, setTaxRate,
  notes, setNotes, terms, setTerms, handlePrint, generatePDF, isGenerating
}: InvoiceSummarySectionProps) => {
  return (
    <div className="space-y-8 h-full flex flex-col justify-between print:hidden">
       <h2 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4">Final Summary</h2>
       
       <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="inv-number" className="text-tiny font-black text-text-4 uppercase tracking-tighter">Invoice #</label>
            <input id="inv-number" value={meta.number} onChange={(e) => setMeta({...meta, number: e.target.value})} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-bold focus:border-blue outline-none" />
          </div>
          <div className="space-y-1">
            <label htmlFor="issue-date" className="text-tiny font-black text-text-4 uppercase tracking-tighter">Issue Date</label>
            <input id="issue-date" type="date" value={meta.date} onChange={(e) => setMeta({...meta, date: e.target.value})} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-bold focus:border-blue outline-none" />
          </div>
       </div>

       <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="due-date" className="text-tiny font-black text-text-4 uppercase tracking-tighter">Due Date</label>
            <input id="due-date" type="date" value={meta.dueDate} onChange={(e) => setMeta({...meta, dueDate: e.target.value})} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-bold focus:border-blue outline-none" />
          </div>
          <div className="space-y-1">
            <label htmlFor="payment-status" className="text-tiny font-black text-text-4 uppercase tracking-tighter">Payment Status</label>
            <select 
              id="payment-status"
              value={meta.status} 
              onChange={(e) => setMeta({...meta, status: e.target.value as PaymentStatus})} 
              className={'w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue appearance-none ' + (meta.status === 'paid' ? 'text-success' : 'text-error')}
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
       </div>

       <div className="space-y-4 p-6 bg-blue/5 border border-blue/10 rounded-2xl">
          <div className="space-y-3">
             <div className="flex justify-between items-center text-xs font-bold">
               <span className="text-text-3 uppercase tracking-tighter">Subtotal</span>
               <span className="font-black">{currency}{totals.subtotal.toLocaleString()}</span>
             </div>
             
             <div className="flex justify-between items-center text-xs font-bold">
               <span className="text-text-3 uppercase tracking-tighter flex items-center gap-2">
                 <label htmlFor="discount-input">Discount %</label>
                 <input id="discount-input" type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-12 bg-surface border border-border rounded-lg px-2 py-0.5" />
               </span>
               <span className="text-error">-{currency}{totals.discountAmt.toLocaleString()}</span>
             </div>

             <div className="flex justify-between items-center text-xs font-bold">
               <span className="text-text-3 uppercase tracking-tighter flex items-center gap-2">
                 <label htmlFor="tax-rate-input">GST %</label>
                 <input id="tax-rate-input" type="number" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="w-12 bg-surface border border-border rounded-lg px-2 py-0.5" />
               </span>
               <span className="font-black">+{currency}{totals.tax.toLocaleString()}</span>
             </div>
          </div>

          <div className="pt-4 border-t border-blue/10 flex justify-between items-end">
             <span className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue mb-1">Grand Total</span>
             <span className="text-3xl font-black text-blue tabular-nums leading-none tracking-tighter">
               {currency}{totals.total.toLocaleString()}
             </span>
          </div>
       </div>

       <div className="space-y-4">
          <div className="space-y-1">
             <label htmlFor="notes-input" className="text-tiny font-black text-text-4 uppercase tracking-tighter">Notes</label>
             <textarea id="notes-input" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-medium focus:border-blue outline-none resize-none" rows={3} />
          </div>
          <div className="space-y-1">
             <label htmlFor="terms-input" className="text-tiny font-black text-text-4 uppercase tracking-tighter">Terms & Conditions</label>
             <textarea id="terms-input" value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="e.g. Bank Account details..." className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-medium focus:border-blue outline-none resize-none" rows={2} />
          </div>
       </div>

       <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-surface border border-border text-text-2 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-blue hover:text-blue transition-all active:scale-95"
            aria-label="Print Invoice"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button 
            onClick={generatePDF}
            disabled={isGenerating}
            className="flex-[2] flex items-center justify-center gap-3 py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-md shadow-blue/10 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
            aria-label="Download PDF Invoice"
          >
            <Download className="w-4 h-4" /> {isGenerating ? "Generating..." : "Download PDF"}
          </button>
       </div>
    </div>
  );
};
