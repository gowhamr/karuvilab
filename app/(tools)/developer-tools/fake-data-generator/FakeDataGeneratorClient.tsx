"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { 
  Download, 
  RefreshCw, 
  FileJson, 
  Table as TableIcon, 
  Database, 
  User, 
  Briefcase, 
  Globe, 
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Copy
} from "lucide-react";
import { useObjectUrlManager } from "@/src/lib/hooks";

// --- Data Constants ---
const FIRST_NAMES = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Lisa", "Matthew", "Nancy", "Anthony", "Betty", "Mark", "Sandra", "Donald", "Ashley"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"];
const DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "example.com", "test.com", "company.org", "enterprise.io", "startup.ai", "web.dev"];
const CITIES = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington"];
const JOBS = ["Software Engineer", "Product Manager", "UI/UX Designer", "Data Scientist", "Marketing Manager", "Sales Representative", "HR Specialist", "Accountant", "DevOps Engineer", "Business Analyst", "Project Manager", "Legal Counsel", "Graphic Designer", "Systems Administrator", "Financial Advisor"];
const COMPANIES = ["TechNova", "GlobalStream", "BioPulse", "NexGen Solutions", "CloudWave", "EcoFuture", "AlphaLogic", "Stellar Systems", "QuantumWorks", "InfinityData", "BrightMind", "PrimeCore", "PeakPerformance", "SmartSync", "FutureScale"];
const COUNTRIES = ["USA", "Canada", "UK", "Germany", "France", "Japan", "Australia", "India", "Brazil", "Mexico"];
const GENDERS = ["Male", "Female", "Non-binary"];

type FieldCategory = "Personal" | "Professional" | "Technical" | "Financial";

interface DataField {
  id: string;
  label: string;
  category: FieldCategory;
  generator: () => string | number;
}

const FIELD_DEFINITIONS: DataField[] = [
  // Personal
  { id: "id", label: "UUID / ID", category: "Personal", generator: () => crypto.randomUUID() },
  { id: "firstName", label: "First Name", category: "Personal", generator: () => FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] || "" },
  { id: "lastName", label: "Last Name", category: "Personal", generator: () => LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)] || "" },
  { id: "gender", label: "Gender", category: "Personal", generator: () => GENDERS[Math.floor(Math.random() * GENDERS.length)] || "" },
  { id: "dob", label: "Date of Birth", category: "Personal", generator: () => {
    const start = new Date(1960, 0, 1);
    const end = new Date(2005, 11, 31);
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return d.toISOString().split("T")[0] || "";
  }},
  { id: "address", label: "Full Address", category: "Personal", generator: () => `${Math.floor(Math.random() * 9999) + 1} Main St, ${CITIES[Math.floor(Math.random() * CITIES.length)] || "City"}, ${COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)] || "Country"}` },
  { id: "phone", label: "Phone Number", category: "Personal", generator: () => `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` },
  
  // Professional
  { id: "job", label: "Job Title", category: "Professional", generator: () => JOBS[Math.floor(Math.random() * JOBS.length)] || "" },
  { id: "company", label: "Company Name", category: "Professional", generator: () => COMPANIES[Math.floor(Math.random() * COMPANIES.length)] || "" },
  { id: "email", label: "Business Email", category: "Professional", generator: () => {
    const f = (FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] || "").toLowerCase();
    const l = (LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)] || "").toLowerCase();
    return `${f}.${l}@${DOMAINS[Math.floor(Math.random() * DOMAINS.length)] || "example.com"}`;
  }},
  
  // Technical
  { id: "username", label: "Username", category: "Technical", generator: () => {
    const f = (FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] || "").toLowerCase();
    return `${f}${Math.floor(Math.random() * 999)}`;
  }},
  { id: "ip", label: "IP Address", category: "Technical", generator: () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".") },
  { id: "website", label: "Website URL", category: "Technical", generator: () => `https://www.${(COMPANIES[Math.floor(Math.random() * COMPANIES.length)] || "").toLowerCase()}.io` },
  { id: "userAgent", label: "User Agent", category: "Technical", generator: () => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" },
  
  // Financial
  { id: "salary", label: "Annual Salary", category: "Financial", generator: () => Math.floor(Math.random() * 150000) + 40000 },
  { id: "cardNumber", label: "Credit Card", category: "Financial", generator: () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 9000) + 1000).join("-") },
  { id: "currency", label: "Currency Code", category: "Financial", generator: () => ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"][Math.floor(Math.random() * 6)] || "USD" },
];

export default function FakeDataGeneratorClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [count, setCount] = useState("25");
  const [selectedFields, setSelectedFields] = useState<string[]>(["id", "firstName", "lastName", "email", "job"]);
  const [format, setFormat] = useState<"json" | "csv" | "sql">("json");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = useMemo(() => {
    const cats: Record<FieldCategory, DataField[]> = {
      Personal: [], Professional: [], Technical: [], Financial: []
    };
    FIELD_DEFINITIONS.forEach(f => cats[f.category].push(f));
    return cats;
  }, []);

  const generateData = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const rows = [];
      const n = Math.min(parseInt(count) || 10, 2000);
      const activeFields = FIELD_DEFINITIONS.filter(f => selectedFields.includes(f.id));

      for (let i = 0; i < n; i++) {
        const row: any = {};
        activeFields.forEach(f => {
          row[f.id] = f.generator();
        });
        rows.push(row);
      }

      if (format === "json") {
        setResult(JSON.stringify(rows, null, 2));
      } else if (format === "csv") {
        const headers = activeFields.map(f => f.id);
        const csv = [
          headers.join(","),
          ...rows.map(r => headers.map(h => `"${r[h]}"`).join(","))
        ].join("\n");
        setResult(csv);
      } else if (format === "sql") {
        const tableName = "fake_data";
        const headers = activeFields.map(f => f.id);
        const sql = rows.map(r => {
          const values = headers.map(h => {
            const val = r[h];
            return typeof val === "number" ? val : `'${val.toString().replace(/'/g, "''")}'`;
          }).join(", ");
          return `INSERT INTO ${tableName} (${headers.join(", ")}) VALUES (${values});`;
        }).join("\n");
        setResult(sql);
      }
      setIsGenerating(false);
    }, 100);
  }, [count, selectedFields, format]);

  const toggleField = (id: string) => {
    setSelectedFields(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedFields(FIELD_DEFINITIONS.map(f => f.id));
  const deselectAll = () => setSelectedFields([]);

  const downloadFile = () => {
    const mimeType = format === "json" ? "application/json" : format === "csv" ? "text/csv" : "text/plain";
    const blob = new Blob([result], { type: mimeType });
    const url = createUrl(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fake-data-${new Date().getTime()}.${format === "sql" ? "sql" : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface border border-border rounded-4xl p-8 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <RefreshCw className={cn("w-6 h-6 text-blue", isGenerating && "animate-spin")} />
                Configure Generator
              </h2>
            </div>

            <div className="space-y-6">
              <ToolInput
                label="Number of Records"
                type="number"
                value={count}
                onChange={setCount}
                placeholder="25"
                description="Generate up to 2000 records at once."
              />

              <div className="space-y-3">
                <label className="text-sm font-bold text-text-2 px-1">Output Format</label>
                <SegmentedControl
                  activeId={format}
                  onChange={(v) => setFormat(v as any)}
                  options={[
                    { label: "JSON", id: "json", icon: <FileJson className="w-4 h-4" /> },
                    { label: "CSV", id: "csv", icon: <TableIcon className="w-4 h-4" /> },
                    { label: "SQL", id: "sql", icon: <Database className="w-4 h-4" /> },
                  ]}
                />
              </div>

              <button
                onClick={generateData}
                disabled={isGenerating || selectedFields.length === 0}
                className="w-full py-5 bg-blue text-white rounded-xl font-black text-lg shadow-xl shadow-blue/20 hover:shadow-blue/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isGenerating ? <RefreshCw className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                Generate Realistic Data
              </button>
            </div>
          </div>

          <div className="bg-blue/5 border border-blue/10 rounded-4xl p-6 space-y-4">
            <h3 className="text-sm font-black text-blue uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Privacy Assurance
            </h3>
            <p className="text-xs text-text-3 font-medium leading-relaxed">
              All data generation happens directly in your browser using local algorithms. No personal data is sent to any server. 100% private and secure.
            </p>
          </div>
        </div>

        {/* Main Selection Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface border border-border rounded-4xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-text">Select Data Fields</h2>
                <p className="text-xs text-text-4 font-bold uppercase tracking-wider mt-1">
                  {selectedFields.length} fields selected
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={selectAll} className="px-4 py-2 text-xs font-black text-blue hover:bg-blue/5 rounded-xl transition-all">Select All</button>
                <button onClick={deselectAll} className="px-4 py-2 text-xs font-black text-text-4 hover:bg-black/5 rounded-xl transition-all">Clear All</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {(Object.entries(categories) as [FieldCategory, DataField[]][]).map(([cat, fields]) => (
                <div key={cat} className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    {cat === "Personal" && <User className="w-4 h-4 text-indigo-500" />}
                    {cat === "Professional" && <Briefcase className="w-4 h-4 text-emerald-500" />}
                    {cat === "Technical" && <Globe className="w-4 h-4 text-blue-500" />}
                    {cat === "Financial" && <Database className="w-4 h-4 text-amber-500" />}
                    <h3 className="text-sm font-black text-text-2 uppercase tracking-widest">{cat}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {fields.map(field => (
                      <div key={field.id} className="flex items-center gap-3 py-1 group">
                        <Checkbox
                          id={field.id}
                          label={field.label}
                          checked={selectedFields.includes(field.id)}
                          onChange={() => toggleField(field.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
             <ToolResultArea
              value={result}
              label="Data Preview"
              {...(result ? { onDownload: downloadFile } : {})}
            />
            {result && (
               <div className="absolute top-14 right-8 flex items-center gap-2">
                 <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                   <CheckCircle2 className="w-3 h-3" />
                   Ready to Use
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
