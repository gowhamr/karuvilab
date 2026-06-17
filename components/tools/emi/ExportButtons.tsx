"use client";

import React, { useState } from "react";
import { Download, Printer, FileText } from "lucide-react";
import { AmortizationEntry } from "@/src/lib/emi-calculations";
import { formatCurrency } from "@/src/lib/utils";
import { useObjectUrlManager } from "@/src/lib/hooks";

interface ExportButtonsProps {
  schedule: AmortizationEntry[];
  loanName?: string;
}

export function ExportButtons({ schedule, loanName = "Loan_Scenario" }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const exportToCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ["Month", "Year", "EMI", "Principal", "Interest", "Prepayment", "Balance"];
      const rows = schedule.map(e => [
        e.month,
        e.year,
        e.emi.toFixed(2),
        e.principal.toFixed(2),
        e.interest.toFixed(2),
        e.prepayment.toFixed(2),
        e.balance.toFixed(2)
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = createUrl(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().split('T')[0];
      
      link.setAttribute("href", url);
      link.setAttribute("download", `${loanName}_${date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      revokeUrl(url);
      setIsExporting(false);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <button
        onClick={exportToCSV}
        disabled={isExporting}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm text-text-2 hover:border-blue hover:text-blue transition-all disabled:opacity-50"
       aria-label="Download">
        <Download className="w-4 h-4" />
        {isExporting ? "Preparing CSV..." : "Export CSV"}
      </button>

      <button
        onClick={handlePrint}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue text-white rounded-xl text-tiny font-bold uppercase tracking-widest-sm shadow-xl shadow-blue/20 hover:scale-102 active:scale-95 transition-all"
      >
        <Printer className="w-4 h-4" />
        Print to PDF
      </button>

      <style jsx global>{`
        @media print {
          nav, footer, .calculator-inputs, .action-buttons, .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .amortisation-table {
            height: auto !important;
            overflow: visible !important;
          }
          .amortisation-table div[style*="height"] {
            height: auto !important;
          }
          .amortisation-table div[style*="transform"] {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
