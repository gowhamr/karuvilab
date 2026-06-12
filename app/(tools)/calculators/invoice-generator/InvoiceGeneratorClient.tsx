"use client";

import React, { useState, useMemo } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Plus, Trash2, Download, Printer, Upload } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { StatusBadge } from "@/components/system/StatusBadge";
import { DropZone } from "@/components/ui/DropZone";
import { formatError } from "@/src/lib/formatError";

interface LineItem {
  id: string;
  desc: string;
  qty: number;
  price: number;
}

type TemplateType = "classic" | "modern" | "professional" | "minimal";
type PaymentStatus = "paid" | "unpaid" | "pending" | "overdue";

export default function InvoiceGeneratorClient() {
  const { toast } = useToast();
  const { createUrl, revokeUrl } = useObjectUrlManager();
  
  // Header / Branding
  const [logo, setLogo] = useState<string | null>(null);
  const [currency, setCurrency] = useState("₹");
  const [template, setTemplate] = useState<TemplateType>("modern");

  // Parties
  const [from, setFrom] = useState({ 
    name: "", 
    email: "", 
    address: "", 
    phone: "", 
    website: "",
    gstin: "" 
  });
  const [to, setTo] = useState({ 
    name: "", 
    company: "",
    email: "", 
    address: "", 
    phone: "",
    gstin: "" 
  });

  // Invoice Details
  const [meta, setMeta] = useState({ 
    number: `INV-${new Date().getFullYear()}-001`, 
    date: new Date().toISOString().split('T')[0] || "",
    dueDate: "",
    status: "unpaid" as PaymentStatus
  });

  const [items, setItems] = useState<LineItem[]>([{ id: '1', desc: "Consulting Service", qty: 1, price: 1000 }]);
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("Payment is due within 15 days. Thank you for your business!");
  const [terms, setTerms] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
    const discountAmt = subtotal * (discount / 100);
    const afterDiscount = subtotal - discountAmt;
    const tax = afterDiscount * (taxRate / 100);
    const total = afterDiscount + tax;
    return { subtotal, discountAmt, afterDiscount, tax, total };
  }, [items, taxRate, discount]);

  const handleLogoUpload = (files: FileList | File[]) => {
    const file = files instanceof FileList ? files[0] : files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

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

  const handlePrint = () => {
    window.print();
  };

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const { width, height } = page.getSize();
      
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      let y = height - 60;
      const margin = 50;

      // Colors
      const blueColor = rgb(0.31, 0.27, 0.9); // Karuvi Blue
      const lightGray = rgb(0.97, 0.97, 0.98);
      const textDark = rgb(0.06, 0.09, 0.16);
      const textMuted = rgb(0.4, 0.4, 0.4);

      // ── Logo Handling ───────────────────────────────────────────────────
      if (logo) {
        try {
          const logoBytes = await fetch(logo).then(res => res.arrayBuffer());
          const isPng = logo.includes("png");
          const logoImage = isPng ? await pdfDoc.embedPng(logoBytes) : await pdfDoc.embedJpg(logoBytes);
          const logoDims = logoImage.scale(0.2);
          page.drawImage(logoImage, {
            x: margin,
            y: y - logoDims.height + 20,
            width: logoDims.width,
            height: logoDims.height,
          });
          // Don't advance Y yet if modern, depends on layout
        } catch (e) { console.error("Logo embed fail", e); }
      }

      // ── Template: Modern ───────────────────────────────────────────────
      if (template === "modern") {
         // Header Bar
         page.drawRectangle({ x: 0, y: height - 120, width: width, height: 120, color: lightGray });
         page.drawText('INVOICE', { x: width - 180, y: height - 65, size: 32, font: fontBold, color: blueColor });
         page.drawText(`# ${meta.number}`, { x: width - 180, y: height - 90, size: 12, font: fontBold, color: textDark });
         
         y = height - 160;
         
         // Party Details Grid
         const colW = (width - margin * 2) / 3;
         
         // From
         page.drawText('ISSUED BY', { x: margin, y, size: 9, font: fontBold, color: textMuted });
         y -= 15;
         page.drawText(from.name || "Business Name", { x: margin, y, size: 11, font: fontBold });
         y -= 14;
         page.drawText(from.email || "", { x: margin, y, size: 9, font: fontRegular });
         y -= 12;
         page.drawText(from.address || "", { x: margin, y, size: 8, font: fontRegular, maxWidth: colW });

         // To
         let partyY = height - 160;
         page.drawText('BILL TO', { x: margin + colW * 1.2, y: partyY, size: 9, font: fontBold, color: textMuted });
         partyY -= 15;
         page.drawText(to.name || "Client Name", { x: margin + colW * 1.2, y: partyY, size: 11, font: fontBold });
         partyY -= 14;
         page.drawText(to.email || "", { x: margin + colW * 1.2, y: partyY, size: 9, font: fontRegular });
         partyY -= 12;
         page.drawText(to.address || "", { x: margin + colW * 1.2, y: partyY, size: 8, font: fontRegular, maxWidth: colW });

         // Dates
         partyY = height - 160;
         page.drawText('DETAILS', { x: width - margin - 100, y: partyY, size: 9, font: fontBold, color: textMuted });
         partyY -= 15;
         page.drawText(`Date: ${meta.date}`, { x: width - margin - 100, y: partyY, size: 9, font: fontRegular });
         if (meta.dueDate) {
           partyY -= 12;
           page.drawText(`Due: ${meta.dueDate}`, { x: width - margin - 100, y: partyY, size: 9, font: fontRegular, color: blueColor });
         }
         partyY -= 12;
         page.drawText(`Status: ${meta.status.toUpperCase()}`, { x: width - margin - 100, y: partyY, size: 9, font: fontBold, color: meta.status === 'paid' ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0) });

         y = Math.min(y, partyY) - 50;
      } 
      // ── Template: Minimal ──────────────────────────────────────────────
      else if (template === "minimal") {
         page.drawText(from.name || "Business Name", { x: margin, y: height - 60, size: 14, font: fontBold });
         page.drawText('INVOICE', { x: width - margin - 80, y: height - 60, size: 14, font: fontBold });
         
         y = height - 100;
         page.drawText(`Invoice No: ${meta.number}`, { x: width - margin - 120, y, size: 9, font: fontRegular });
         y -= 12;
         page.drawText(`Date: ${meta.date}`, { x: width - margin - 120, y, size: 9, font: fontRegular });
         
         y = height - 140;
         page.drawText('BILL TO:', { x: margin, y, size: 8, font: fontBold, color: textMuted });
         y -= 15;
         page.drawText(to.name || "Client Name", { x: margin, y, size: 10, font: fontBold });
         if (to.company) {
           y -= 12;
           page.drawText(to.company, { x: margin, y, size: 9, font: fontRegular });
         }
         y -= 12;
         page.drawText(to.address || "", { x: margin, y, size: 8, font: fontRegular, maxWidth: 200 });

         y -= 40;
      }
      // ── Template: Professional ─────────────────────────────────────────
      else if (template === "professional") {
         page.drawText('INVOICE', { x: margin, y: height - 60, size: 28, font: fontBold, color: textDark });
         page.drawRectangle({ x: margin, y: height - 75, width: 40, height: 4, color: blueColor });
         
         page.drawText(from.name || "Business Name", { x: width - margin - 150, y: height - 55, size: 12, font: fontBold, color: textDark });
         page.drawText(from.address || "", { x: width - margin - 150, y: height - 70, size: 8, font: fontRegular, maxWidth: 150 });
         
         y = height - 140;
         page.drawRectangle({ x: margin, y: y, width: width - margin * 2, height: 60, color: lightGray });
         
         page.drawText('BILL TO:', { x: margin + 20, y: y + 40, size: 8, font: fontBold, color: textMuted });
         page.drawText(to.name || "Client Name", { x: margin + 20, y: y + 25, size: 11, font: fontBold });
         
         page.drawText('INVOICE NO:', { x: margin + 220, y: y + 40, size: 8, font: fontBold, color: textMuted });
         page.drawText(meta.number, { x: margin + 220, y: y + 25, size: 11, font: fontBold });
         
         page.drawText('DATE:', { x: margin + 380, y: y + 40, size: 8, font: fontBold, color: textMuted });
         page.drawText(meta.date, { x: margin + 380, y: y + 25, size: 11, font: fontBold });

         y -= 40;
      }
      // ── Template: Classic ──────────────────────────────────────────────
      else {
         page.drawText('INVOICE', { x: width / 2 - 40, y: height - 60, size: 24, font: fontBold });
         y = height - 100;
         page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: textDark });
         y -= 30;
         
         page.drawText(`From: ${from.name}`, { x: margin, y, size: 10, font: fontBold });
         page.drawText(`Invoice #: ${meta.number}`, { x: width - 150, y, size: 10, font: fontBold });
         y -= 15;
         page.drawText(from.address || "", { x: margin, y, size: 8, font: fontRegular });
         page.drawText(`Date: ${meta.date}`, { x: width - 150, y, size: 10, font: fontRegular });
         y -= 30;
      }

      // ── Table Handling (Generic for all) ────────────────────────────────
      // Header
      page.drawRectangle({ x: margin, y: y - 5, width: width - margin * 2, height: 25, color: blueColor });
      page.drawText('DESCRIPTION', { x: margin + 10, y, size: 8, font: fontBold, color: rgb(1, 1, 1) });
      page.drawText('QTY', { x: margin + 300, y, size: 8, font: fontBold, color: rgb(1, 1, 1) });
      page.drawText('PRICE', { x: margin + 360, y, size: 8, font: fontBold, color: rgb(1, 1, 1) });
      page.drawText('TOTAL', { x: margin + 440, y, size: 8, font: fontBold, color: rgb(1, 1, 1) });
      
      y -= 30;

      // Rows
      items.forEach((item, i) => {
        if (i % 2 === 0) {
           page.drawRectangle({ x: margin, y: y - 5, width: width - margin * 2, height: 20, color: rgb(0.98, 0.98, 1) });
        }
        page.drawText(item.desc || "Item Description", { x: margin + 10, y, size: 9, font: fontRegular });
        page.drawText(item.qty.toString(), { x: margin + 300, y, size: 9, font: fontRegular });
        page.drawText(`${currency}${item.price.toLocaleString()}`, { x: margin + 360, y, size: 9, font: fontRegular });
        page.drawText(`${currency}${(item.qty * item.price).toLocaleString()}`, { x: margin + 440, y, size: 9, font: fontBold });
        y -= 20;
      });

      // Totals Area
      y -= 30;
      const totalX = width - margin - 150;
      
      const drawTotalLine = (label: string, value: string, isBold = false) => {
         const currentFont = isBold ? fontBold : fontRegular;
         page.drawText(label, { x: totalX, y, size: 9, font: currentFont, color: isBold ? textDark : textMuted });
         
         const valueWidth = currentFont.widthOfTextAtSize(value, 10);
         page.drawText(value, { x: width - margin - valueWidth, y, size: 10, font: currentFont, color: isBold ? blueColor : textDark });
         y -= 18;
      };

      drawTotalLine("Subtotal", `${currency}${totals.subtotal.toLocaleString()}`);
      if (discount > 0) drawTotalLine(`Discount (${discount}%)`, `-${currency}${totals.discountAmt.toLocaleString()}`);
      drawTotalLine(`GST (${taxRate}%)`, `+${currency}${totals.tax.toLocaleString()}`);
      y -= 5;
      page.drawRectangle({ x: totalX, y: y + 15, width: width - margin - totalX, height: 1, color: lightGray });
      drawTotalLine("GRAND TOTAL", `${currency}${totals.total.toLocaleString()}`, true);

      // Notes & Footer
      if (notes || terms) {
        y -= 40;
        if (notes) {
          page.drawText('NOTES', { x: margin, y, size: 8, font: fontBold, color: blueColor });
          y -= 15;
          page.drawText(notes, { x: margin, y, size: 8, font: fontRegular, maxWidth: 300, lineHeight: 10 });
          y -= 30;
        }
        if (terms) {
          page.drawText('TERMS & CONDITIONS', { x: margin, y, size: 8, font: fontBold, color: textMuted });
          y -= 15;
          page.drawText(terms, { x: margin, y, size: 7, font: fontRegular, maxWidth: width - margin * 2 });
        }
      }

      // Footer Branding
      page.drawText('Generated via KaruviLab — Professional Local-First Tools', {
        x: width / 2 - 100,
        y: 30,
        size: 7,
        font: fontRegular,
        color: textMuted
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = createUrl(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${meta.number}.pdf`;
      link.click();
      
      toast("Professional Invoice Generated!");
      setTimeout(() => revokeUrl(url), 2000);
    } catch (err) {
      console.error(err);
      toast("PDF Generation Failed", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <StatusBadge status={isGenerating ? "processing" : "idle"} label="Generating PDF..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Template & Branding */}
          <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                   Template & Branding
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span id="label-visual-style" className="text-[10px] font-black uppercase tracking-widest text-text-4">Visual Style</span>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="label-visual-style">
                      {(["classic", "modern", "professional", "minimal"] as TemplateType[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setTemplate(t)}
                          role="radio"
                          aria-checked={template === t}
                          className={`flex-1 min-w-[80px] py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${template === t ? 'bg-blue text-white shadow-md shadow-blue/10' : 'bg-bg border border-border text-text-4 hover:border-blue/30'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="currency-symbol" className="text-[10px] font-black uppercase tracking-widest text-text-4">Currency Symbol</label>
                    <input 
                      id="currency-symbol"
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value)} 
                      className="w-full px-4 py-2 bg-bg border border-border rounded-xl text-sm font-bold focus:border-blue outline-none"
                      placeholder="e.g. ₹ or $"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-48">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-4 block mb-2">Company Logo</label>
                {logo ? (
                  <div className="relative group aspect-square rounded-2xl border border-border overflow-hidden bg-bg">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                    <button 
                      onClick={() => setLogo(null)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Trash2 className="w-6 h-6 text-white" />
                    </button>
                  </div>
                ) : (
                  <DropZone
                    onFilesSelected={handleLogoUpload}
                    accept="image/*"
                    title="Upload"
                    description="PNG/JPG"
                    className="aspect-square flex-col justify-center gap-2"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                   From (Your Details)
                </h2>
                <div className="space-y-4">
                  <ToolInput placeholder="Business Name" value={from.name} onChange={(v) => setFrom({ ...from, name: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <ToolInput placeholder="Email" value={from.email} onChange={(v) => setFrom({ ...from, email: v })} />
                    <ToolInput placeholder="Phone" value={from.phone} onChange={(v) => setFrom({ ...from, phone: v })} />
                  </div>
                  <ToolInput placeholder="Address" rows={2} value={from.address} onChange={(v) => setFrom({ ...from, address: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <ToolInput placeholder="Website" value={from.website} onChange={(v) => setFrom({ ...from, website: v })} />
                    <ToolInput placeholder="GSTIN / TAX ID" value={from.gstin} onChange={(v) => setFrom({ ...from, gstin: v })} />
                  </div>
                </div>
             </div>

             <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                   Bill To (Client)
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <ToolInput placeholder="Client Name" value={to.name} onChange={(v) => setTo({ ...to, name: v })} />
                    <ToolInput placeholder="Company Name" value={to.company} onChange={(v) => setTo({ ...to, company: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ToolInput placeholder="Client Email" value={to.email} onChange={(v) => setTo({ ...to, email: v })} />
                    <ToolInput placeholder="Client Phone" value={to.phone} onChange={(v) => setTo({ ...to, phone: v })} />
                  </div>
                  <ToolInput placeholder="Client Address" rows={2} value={to.address} onChange={(v) => setTo({ ...to, address: v })} />
                  <ToolInput placeholder="Client GSTIN / TAX ID" value={to.gstin} onChange={(v) => setTo({ ...to, gstin: v })} />
                </div>
             </div>
          </div>

          {/* Section 3: Line Items */}
          <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                 Line Items
              </h2>
              <button 
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue/5 text-blue text-[10px] font-black uppercase tracking-widest hover:bg-blue/10 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-start p-4 bg-bg border border-border rounded-2xl group transition-all hover:border-blue/30">
                  <div className="col-span-6 space-y-1">
                    <label htmlFor={`desc-${item.id}`} className="text-[9px] font-bold text-text-4 uppercase tracking-tighter">Description</label>
                    <input 
                      id={`desc-${item.id}`}
                      placeholder="e.g. Design Consulting" 
                      value={item.desc} 
                      onChange={(e) => updateItem(item.id, 'desc', e.target.value)} 
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-text placeholder:text-text-4"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label htmlFor={`qty-${item.id}`} className="text-[9px] font-bold text-text-4 uppercase tracking-tighter">Qty</label>
                    <input 
                      id={`qty-${item.id}`}
                      type="number" 
                      value={item.qty} 
                      onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)} 
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black tabular-nums"
                    />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <label htmlFor={`price-${item.id}`} className="text-[9px] font-bold text-text-4 uppercase tracking-tighter">Price</label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold opacity-40" aria-hidden="true">{currency}</span>
                      <input 
                        id={`price-${item.id}`}
                        type="number" 
                        value={item.price} 
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} 
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black tabular-nums"
                        aria-label={`Price in ${currency}`}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 pt-4 text-right">
                    <button 
                      onClick={() => removeItem(item.id)} 
                      aria-label={`Delete Item ${item.desc || i + 1}`}
                      className="text-text-4 hover:text-error transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm space-y-8 sticky top-24 print:hidden">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-4">Final Summary</h2>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="inv-number" className="text-[9px] font-black text-text-4 uppercase tracking-tighter">Invoice #</label>
                  <input id="inv-number" value={meta.number} onChange={(e) => setMeta({...meta, number: e.target.value})} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-bold focus:border-blue outline-none" />
                </div>
                <div className="space-y-1">
                  <label htmlFor="issue-date" className="text-[9px] font-black text-text-4 uppercase tracking-tighter">Issue Date</label>
                  <input id="issue-date" type="date" value={meta.date} onChange={(e) => setMeta({...meta, date: e.target.value})} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-bold focus:border-blue outline-none" />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="due-date" className="text-[9px] font-black text-text-4 uppercase tracking-tighter">Due Date</label>
                  <input id="due-date" type="date" value={meta.dueDate} onChange={(e) => setMeta({...meta, dueDate: e.target.value})} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-bold focus:border-blue outline-none" />
                </div>
                <div className="space-y-1">
                  <label htmlFor="payment-status" className="text-[9px] font-black text-text-4 uppercase tracking-tighter">Payment Status</label>
                  <select 
                    id="payment-status"
                    value={meta.status} 
                    onChange={(e) => setMeta({...meta, status: e.target.value as PaymentStatus})} 
                    className={`w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue appearance-none ${meta.status === 'paid' ? 'text-success' : 'text-error'}`}
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
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue mb-1">Grand Total</span>
                   <span className="text-3xl font-black text-blue tabular-nums leading-none tracking-tighter">
                     {currency}{totals.total.toLocaleString()}
                   </span>
                </div>
             </div>

             <div className="space-y-4">
                <div className="space-y-1">
                   <label htmlFor="notes-input" className="text-[9px] font-black text-text-4 uppercase tracking-tighter">Notes</label>
                   <textarea id="notes-input" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-medium focus:border-blue outline-none resize-none" rows={3} />
                </div>
                <div className="space-y-1">
                   <label htmlFor="terms-input" className="text-[9px] font-black text-text-4 uppercase tracking-tighter">Terms & Conditions</label>
                   <textarea id="terms-input" value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="e.g. Bank Account details..." className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs font-medium focus:border-blue outline-none resize-none" rows={2} />
                </div>
             </div>

             <div className="flex gap-2">
                <button 
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-surface border border-border text-text-2 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-blue hover:text-blue transition-all active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button 
                  onClick={generatePDF}
                  disabled={isGenerating}
                  className="flex-[2] flex items-center justify-center gap-3 py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-md shadow-blue/10 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                >
                  <Download className="w-4 h-4" /> {isGenerating ? "Generating..." : "Download PDF"}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
