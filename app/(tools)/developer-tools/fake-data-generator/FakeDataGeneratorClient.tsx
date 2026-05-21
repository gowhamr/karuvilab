"use client";

import React, { useState } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { Download, RefreshCw, FileJson, Table as TableIcon } from "lucide-react";

const FIRST_NAMES = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "example.com", "test.com", "company.org"];
const CITIES = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];

const FIELDS = [
  { id: "id", label: "UUID / ID" },
  { id: "firstName", label: "First Name" },
  { id: "lastName", label: "Last Name" },
  { id: "email", label: "Email Address" },
  { id: "phone", label: "Phone Number" },
  { id: "address", label: "City / Address" },
];

export default function FakeDataGeneratorClient() {
  const [count, setCount] = useState("10");
  const [selectedFields, setSelectedFields] = useState<string[]>(["id", "firstName", "lastName", "email"]);
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [result, setResult] = useState("");

  const generateData = () => {
    const rows = [];
    const n = Math.min(parseInt(count) || 10, 1000);

    for (let i = 0; i < n; i++) {
      const row: any = {};
      const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      
      if (selectedFields.includes("id")) row.id = crypto.randomUUID();
      if (selectedFields.includes("firstName")) row.firstName = fName;
      if (selectedFields.includes("lastName")) row.lastName = lName;
      if (selectedFields.includes("email")) row.email = `${fName.toLowerCase()}.${lName.toLowerCase()}@${DOMAINS[Math.floor(Math.random() * DOMAINS.length)]}`;
      if (selectedFields.includes("phone")) row.phone = `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
      if (selectedFields.includes("address")) row.address = `${Math.floor(Math.random() * 9999) + 1} Main St, ${CITIES[Math.floor(Math.random() * CITIES.length)]}`;
      
      rows.push(row);
    }

    if (format === "json") {
      setResult(JSON.stringify(rows, null, 2));
    } else {
      const headers = selectedFields;
      const csv = [
        headers.join(","),
        ...rows.map(r => headers.map(h => `"${r[h]}"`).join(","))
      ].join("\n");
      setResult(csv);
    }
  };

  const toggleField = (id: string) => {
    setSelectedFields(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const downloadFile = () => {
    const blob = new Blob([result], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fake-data.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6 p-6 bg-surface border border-border rounded-[32px]">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue" />
            Configuration
          </h3>
          
          <ToolInput
            label="Number of Rows"
            type="number"
            value={count}
            onChange={setCount}
            description="Max 1000 rows"
          />

          <div className="space-y-3">
            <label className="text-sm font-bold text-text-2">Include Fields</label>
            <div className="grid grid-cols-1 gap-2">
              {FIELDS.map(field => (
                <Checkbox
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  checked={selectedFields.includes(field.id)}
                  onChange={() => toggleField(field.id)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-text-2">Output Format</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormat("json")}
                className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${format === "json" ? "bg-blue/10 border-blue text-blue font-bold" : "bg-bg border-border text-text-3"}`}
              >
                <FileJson className="w-4 h-4" /> JSON
              </button>
              <button
                onClick={() => setFormat("csv")}
                className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${format === "csv" ? "bg-blue/10 border-blue text-blue font-bold" : "bg-bg border-border text-text-3"}`}
              >
                <TableIcon className="w-4 h-4" /> CSV
              </button>
            </div>
          </div>

          <button
            onClick={generateData}
            className="w-full py-4 bg-blue text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-blue/20 transition-all active:scale-95"
          >
            Generate Data
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <ToolResultArea
            value={result}
            label="Generated Output"
            {...(result ? { onDownload: downloadFile } : {})}
          />
        </div>
      </div>
    </div>
  );
}
