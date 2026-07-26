"use client";

import React, { useState, useMemo } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { StatusBadge } from "@/components/system/StatusBadge";
import { DropZone } from "@/components/ui/DropZone";
import { useAutoSave } from "@/src/hooks/useAutoSave";

import { LineItem, TemplateType, PaymentStatus, InvoiceMeta, InvoiceParty } from "@/src/features/invoice-generator/types";
import { generateInvoicePDF } from "@/src/features/invoice-generator/utils/pdf-generator";
import { LineItemsSection } from "@/src/features/invoice-generator/components/LineItemsSection";
import { InvoiceSummarySection } from "@/src/features/invoice-generator/components/InvoiceSummarySection";

export default function InvoiceGeneratorClient() {
  const { toast } = useToast();
  const { createUrl, revokeUrl } = useObjectUrlManager();
  
  // State
  const [logo, setLogo] = useState<string | null>(null);
  const [currency, setCurrency] = useState("₹");
  const [template, setTemplate] = useState<TemplateType>("modern");

  const [from, setFrom] = useState<InvoiceParty>({ 
    name: "", email: "", address: "", phone: "", website: "", gstin: "" 
  });
  const [to, setTo] = useState<InvoiceParty>({ 
    name: "", company: "", email: "", address: "", phone: "", gstin: "" 
  });

  const [meta, setMeta] = useState<InvoiceMeta>({ 
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

  // Auto-save logic
  const invoiceData = useMemo(() => ({
    logo, currency, template, from, to, meta, items, taxRate, discount, notes, terms
  }), [logo, currency, template, from, to, meta, items, taxRate, discount, notes, terms]);

  useAutoSave(
    'invoice-generator',
    invoiceData,
    (restored: typeof invoiceData) => {
      setLogo(restored.logo);
      setCurrency(restored.currency);
      setTemplate(restored.template);
      setFrom(restored.from);
      setTo(restored.to);
      setMeta(restored.meta);
      setItems(restored.items);
      setTaxRate(restored.taxRate);
      setDiscount(restored.discount);
      setNotes(restored.notes);
      setTerms(restored.terms);
      toast("Invoice draft restored!");
    },
    (data) => ({ ...data, logo: data.logo && data.logo.length > 500000 ? null : data.logo })
  );

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
      const pdfBytes = await generateInvoicePDF({
        logo, currency, template, from, to, meta, items, taxRate, discount, notes, terms, totals
      });

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
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface border border-border p-4 sm:p-8 rounded-4xl shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <h2 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                   Template & Branding
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span id="label-visual-style" className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">Visual Style</span>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="label-visual-style">
                      {(["classic", "modern", "professional", "minimal"] as TemplateType[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setTemplate(t)}
                          role="radio"
                          aria-checked={template === t}
                          className={`flex-1 min-w-20 py-2 rounded-xl text-tiny font-bold uppercase tracking-widest-sm transition-all ${template === t ? 'bg-blue text-white shadow-md shadow-blue/10' : 'bg-bg border border-border text-text-muted hover:border-blue/30'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="currency-symbol" className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">Currency Symbol</label>
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
                <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted block mb-2">Company Logo</label>
                {logo ? (
                  <div className="relative group aspect-square rounded-2xl border border-border overflow-hidden bg-bg">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                    <button 
                      onClick={() => setLogo(null)}
                      aria-label="Remove logo"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-surface border border-border p-4 sm:p-8 rounded-4xl shadow-sm space-y-6">
                <h2 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue flex items-center gap-2">
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
                    <ToolInput placeholder="Website" value={from.website || ""} onChange={(v) => setFrom({ ...from, website: v })} />
                    <ToolInput placeholder="GSTIN / TAX ID" value={from.gstin || ""} onChange={(v) => setFrom({ ...from, gstin: v })} />
                  </div>
                </div>
             </div>

             <div className="bg-surface border border-border p-4 sm:p-8 rounded-4xl shadow-sm space-y-6">
                <h2 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                   Bill To (Client)
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <ToolInput placeholder="Client Name" value={to.name} onChange={(v) => setTo({ ...to, name: v })} />
                    <ToolInput placeholder="Company Name" value={to.company || ""} onChange={(v) => setTo({ ...to, company: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ToolInput placeholder="Client Email" value={to.email} onChange={(v) => setTo({ ...to, email: v })} />
                    <ToolInput placeholder="Client Phone" value={to.phone} onChange={(v) => setTo({ ...to, phone: v })} />
                  </div>
                  <ToolInput placeholder="Client Address" rows={2} value={to.address} onChange={(v) => setTo({ ...to, address: v })} />
                  <ToolInput placeholder="Client GSTIN / TAX ID" value={to.gstin || ""} onChange={(v) => setTo({ ...to, gstin: v })} />
                </div>
             </div>
          </div>

          <LineItemsSection 
            items={items} 
            currency={currency} 
            addItem={addItem} 
            removeItem={removeItem} 
            updateItem={updateItem} 
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <InvoiceSummarySection 
            meta={meta}
            setMeta={setMeta}
            totals={totals}
            currency={currency}
            discount={discount}
            setDiscount={setDiscount}
            taxRate={taxRate}
            setTaxRate={setTaxRate}
            notes={notes}
            setNotes={setNotes}
            terms={terms}
            setTerms={setTerms}
            handlePrint={handlePrint}
            generatePDF={generatePDF}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
