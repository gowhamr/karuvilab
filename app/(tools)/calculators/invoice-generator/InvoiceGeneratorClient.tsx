"use client";

import React, { useState, useMemo } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Plus, Trash2, Download, Printer } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { StatusBadge } from "@/components/system/StatusBadge";
import { formatError } from "@/src/lib/formatError";

interface LineItem {
  id: string;
  desc: string;
  qty: number;
  price: number;
}

export default function InvoiceGeneratorClient() {
  const { toast } = useToast();
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [from, setFrom] = useState({ name: "", email: "", address: "" });
  const [to, setTo] = useState({ name: "", email: "", address: "" });
  const [meta, setMeta] = useState({ number: "INV-001", date: new Date().toISOString().split('T')[0] || "" });
  const [items, setItems] = useState<LineItem[]>([{ id: '1', desc: "Service Description", qty: 1, price: 100 }]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [items, taxRate]);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).slice(2, 9), desc: "", qty: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      const { width, height } = page.getSize();
      let y = height - 50;

      // Header
      page.drawText('INVOICE', { x: 50, y, size: 24, font: fontBold, color: rgb(0.3, 0.3, 0.9) });
      page.drawText(meta.number, { x: width - 150, y, size: 14, font: fontBold });
      y -= 30;
      page.drawText(`Date: ${meta.date}`, { x: width - 150, y, size: 10, font: fontRegular });
      y -= 40;

      // From / To
      page.drawText('FROM:', { x: 50, y, size: 10, font: fontBold });
      page.drawText('BILL TO:', { x: 300, y, size: 10, font: fontBold });
      y -= 15;
      page.drawText(from.name || "Sender Name", { x: 50, y, size: 10, font: fontRegular });
      page.drawText(to.name || "Client Name", { x: 300, y, size: 10, font: fontRegular });
      y -= 12;
      page.drawText(from.address || "Sender Address", { x: 50, y, size: 8, font: fontRegular });
      page.drawText(to.address || "Client Address", { x: 300, y, size: 8, font: fontRegular });
      y -= 12;
      page.drawText(from.email || "Sender Email", { x: 50, y, size: 8, font: fontRegular });
      page.drawText(to.email || "Client Email", { x: 300, y, size: 8, font: fontRegular });
      y -= 40;

      // Table Header
      page.drawRectangle({ x: 50, y: y - 5, width: width - 100, height: 20, color: rgb(0.95, 0.95, 0.95) });
      page.drawText('Description', { x: 60, y, size: 10, font: fontBold });
      page.drawText('Qty', { x: 350, y, size: 10, font: fontBold });
      page.drawText('Price', { x: 420, y, size: 10, font: fontBold });
      page.drawText('Total', { x: 500, y, size: 10, font: fontBold });
      y -= 25;

      // Table Rows
      items.forEach(item => {
        page.drawText(item.desc || "Item Description", { x: 60, y, size: 10, font: fontRegular });
        page.drawText(item.qty.toString(), { x: 350, y, size: 10, font: fontRegular });
        page.drawText(`$${item.price.toFixed(2)}`, { x: 420, y, size: 10, font: fontRegular });
        page.drawText(`$${(item.qty * item.price).toFixed(2)}`, { x: 500, y, size: 10, font: fontRegular });
        y -= 20;
      });

      y -= 20;
      // Totals
      page.drawText(`Subtotal: $${totals.subtotal.toFixed(2)}`, { x: 400, y, size: 10, font: fontRegular });
      y -= 15;
      page.drawText(`Tax (${taxRate}%): $${totals.tax.toFixed(2)}`, { x: 400, y, size: 10, font: fontRegular });
      y -= 20;
      page.drawText(`TOTAL: $${totals.total.toFixed(2)}`, { x: 400, y, size: 14, font: fontBold, color: rgb(0.3, 0.3, 0.9) });

      if (notes) {
        y -= 40;
        page.drawText('Notes:', { x: 50, y, size: 10, font: fontBold });
        y -= 15;
        page.drawText(notes, { x: 50, y, size: 8, font: fontRegular });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const link = document.createElement("a");
      const url = createUrl(blob);
      link.href = url;
      link.download = `Invoice-${meta.number}.pdf`;
      link.click();
      toast("Invoice downloaded successfully!");
      setTimeout(() => revokeUrl(url), 1000);
    } catch (err) {
      console.error(err);
      toast(formatError(err), "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PrivacyBadge message="Generated locally. No data leaves your device." />
        <StatusBadge status={isGenerating ? "processing" : "idle"} label="Generating PDF..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-4">Invoice #</label>
              <ToolInput value={meta.number} onChange={(v) => setMeta({ ...meta, number: v })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-4">Date</label>
              <ToolInput type="date" value={meta.date} onChange={(v) => setMeta({ ...meta, date: v })} />
            </div>
          </div>

          <div className="space-y-4 p-6 bg-surface border border-border rounded-[24px]">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue">From</h3>
            <ToolInput placeholder="Your Name / Business" value={from.name} onChange={(v) => setFrom({ ...from, name: v })} />
            <ToolInput placeholder="Email Address" value={from.email} onChange={(v) => setFrom({ ...from, email: v })} />
            <ToolInput placeholder="Address" rows={2} value={from.address} onChange={(v) => setFrom({ ...from, address: v })} />
          </div>

          <div className="space-y-4 p-6 bg-surface border border-border rounded-[24px]">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue">Bill To</h3>
            <ToolInput placeholder="Client Name" value={to.name} onChange={(v) => setTo({ ...to, name: v })} />
            <ToolInput placeholder="Client Email" value={to.email} onChange={(v) => setTo({ ...to, email: v })} />
            <ToolInput placeholder="Client Address" rows={2} value={to.address} onChange={(v) => setTo({ ...to, address: v })} />
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-text-4">Items</h3>
              <button 
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue/5 text-blue text-[10px] font-black uppercase tracking-widest hover:bg-blue/10 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-6">
                    <ToolInput placeholder="Item description" value={item.desc} onChange={(v) => updateItem(item.id, 'desc', v)} />
                  </div>
                  <div className="col-span-2">
                    <ToolInput type="number" placeholder="Qty" value={item.qty.toString()} onChange={(v) => updateItem(item.id, 'qty', parseFloat(v) || 0)} />
                  </div>
                  <div className="col-span-3">
                    <ToolInput type="number" placeholder="Price" value={item.price.toString()} onChange={(v) => updateItem(item.id, 'price', parseFloat(v) || 0)} />
                  </div>
                  <div className="col-span-1 pt-3">
                    <button onClick={() => removeItem(item.id)} className="text-text-4 hover:text-error transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 p-6 bg-blue/5 border border-blue/10 rounded-[24px]">
             <div className="flex justify-between items-center text-sm font-bold">
               <span className="text-text-3">Subtotal</span>
               <span>${totals.subtotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center text-sm font-bold">
               <span className="text-text-3 flex items-center gap-2">
                 Tax % 
                 <input 
                   type="number" 
                   value={taxRate} 
                   onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                   className="w-16 px-2 py-1 bg-surface border border-border rounded-lg text-xs"
                 />
               </span>
               <span>${totals.tax.toFixed(2)}</span>
             </div>
             <div className="pt-4 border-t border-blue/10 flex justify-between items-center">
               <span className="text-lg font-black uppercase tracking-widest">Total</span>
               <span className="text-2xl font-black text-blue">${totals.total.toFixed(2)}</span>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-4">Notes / Terms</label>
            <ToolInput rows={3} placeholder="Thank you for your business!" value={notes} onChange={setNotes} />
          </div>

          <button 
            onClick={generatePDF}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-3 py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            <Download className="w-5 h-5" /> {isGenerating ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
