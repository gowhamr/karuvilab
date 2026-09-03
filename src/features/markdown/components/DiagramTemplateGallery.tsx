"use client";

import React, { useState, useMemo, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { 
  X, Search, Sparkles, Layout, Share2, FileJson, 
  GitBranch, Network, Calendar, CheckSquare, 
  BarChart3, Boxes, Layers, Clock, PieChart,
  Copy, Check, ArrowRight
} from "lucide-react";
import { DIAGRAM_SNIPPETS } from "../constants";

export interface DiagramTemplate {
  id: keyof typeof DIAGRAM_SNIPPETS;
  title: string;
  category: "Architecture" | "Engineering" | "Data & Planning";
  description: string;
  icon: React.ElementType;
  snippet: string;
  tags: string[];
}

export const DIAGRAM_TEMPLATES: DiagramTemplate[] = [
  {
    id: "flowchart",
    title: "Decision Flowchart",
    category: "Architecture",
    description: "Decision trees, service logic, branching workflows, and conditional algorithms.",
    icon: Layout,
    snippet: DIAGRAM_SNIPPETS.flowchart,
    tags: ["flowchart", "decision", "logic", "algorithm", "process", "workflow"],
  },
  {
    id: "sequence",
    title: "Sequence Lifeline",
    category: "Engineering",
    description: "API lifecycles, authentication flows, microservice RPCs, and event messaging.",
    icon: Share2,
    snippet: DIAGRAM_SNIPPETS.sequence,
    tags: ["sequence", "api", "auth", "http", "rpc", "microservices", "lifecycle"],
  },
  {
    id: "er",
    title: "Entity Relationship (ER)",
    category: "Data & Planning",
    description: "Database schemas, entity cardinalities (1:1, 1:N, N:M), and relational models.",
    icon: FileJson,
    snippet: DIAGRAM_SNIPPETS.er,
    tags: ["er", "database", "sql", "schema", "postgres", "foreign key", "tables"],
  },
  {
    id: "gitgraph",
    title: "Git Branching Workflow",
    category: "Engineering",
    description: "Trunk-based development, feature branching, release tags, and merge strategies.",
    icon: GitBranch,
    snippet: DIAGRAM_SNIPPETS.gitgraph,
    tags: ["git", "branch", "commit", "merge", "pull request", "release", "devops"],
  },
  {
    id: "mindmap",
    title: "Mindmap & Brainstorming",
    category: "Architecture",
    description: "System taxonomy, concept breakdown, domain modeling, and hierarchy trees.",
    icon: Network,
    snippet: DIAGRAM_SNIPPETS.mindmap,
    tags: ["mindmap", "brainstorm", "concept", "taxonomy", "hierarchy", "system"],
  },
  {
    id: "c4",
    title: "C4 Architecture Context",
    category: "Architecture",
    description: "High-level software architecture, system boundaries, actors, and external APIs.",
    icon: Boxes,
    snippet: DIAGRAM_SNIPPETS.c4,
    tags: ["c4", "architecture", "system", "context", "microservices", "software"],
  },
  {
    id: "class",
    title: "UML Class Diagram",
    category: "Engineering",
    description: "Object-oriented class structures, interfaces, inheritance, and type methods.",
    icon: Layers,
    snippet: DIAGRAM_SNIPPETS.class,
    tags: ["class", "uml", "oop", "types", "interface", "inheritance"],
  },
  {
    id: "state",
    title: "State Machine (v2)",
    category: "Engineering",
    description: "Finite state automata, component lifecycles, and UI state transitions.",
    icon: Layers,
    snippet: DIAGRAM_SNIPPETS.state,
    tags: ["state", "automata", "transition", "lifecycle", "fsm", "status"],
  },
  {
    id: "gantt",
    title: "Gantt Roadmap",
    category: "Data & Planning",
    description: "Project milestones, sprint timelines, critical paths, and release schedules.",
    icon: Calendar,
    snippet: DIAGRAM_SNIPPETS.gantt,
    tags: ["gantt", "roadmap", "timeline", "sprint", "milestone", "schedule", "project"],
  },
  {
    id: "kanban",
    title: "Kanban Board",
    category: "Data & Planning",
    description: "Sprint task boards with Todo, In Progress, and Done columns.",
    icon: CheckSquare,
    snippet: DIAGRAM_SNIPPETS.kanban,
    tags: ["kanban", "board", "agile", "scrum", "tasks", "todo"],
  },
  {
    id: "timeline",
    title: "Chronological Timeline",
    category: "Data & Planning",
    description: "Historical milestones, engineering version history, and release chronologies.",
    icon: Clock,
    snippet: DIAGRAM_SNIPPETS.timeline,
    tags: ["timeline", "history", "milestones", "release", "chronology"],
  },
  {
    id: "pie",
    title: "Distribution Pie Chart",
    category: "Data & Planning",
    description: "Proportional percentages, resource allocation, and document metrics breakdown.",
    icon: PieChart,
    snippet: DIAGRAM_SNIPPETS.pie,
    tags: ["pie", "chart", "metrics", "distribution", "analytics", "percentage"],
  },
  {
    id: "xychart",
    title: "XY Bar & Line Chart",
    category: "Data & Planning",
    description: "Performance latency benchmarks, metrics comparisons, and quantitative trends.",
    icon: BarChart3,
    snippet: DIAGRAM_SNIPPETS.xychart,
    tags: ["chart", "bar", "line", "latency", "benchmark", "performance", "metrics"],
  },
];

interface DiagramTemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (snippet: string) => void;
}

const CATEGORIES = ["All", "Architecture", "Engineering", "Data & Planning"] as const;

export function DiagramTemplateGallery({
  isOpen,
  onClose,
  onSelectTemplate,
}: DiagramTemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTemplates = useMemo(() => {
    return DIAGRAM_TEMPLATES.filter((tpl) => {
      const matchesCategory =
        activeCategory === "All" || tpl.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tpl.title.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCopy = (id: string, snippet: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Modal Container */}
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-surface border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-border bg-bg/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue/10 flex items-center justify-center text-blue">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-text">
                    Mermaid Diagram Gallery
                  </h3>
                  <p className="text-xs text-text-4">
                    Choose from {DIAGRAM_TEMPLATES.length} pre-formatted templates for 1-click insertion
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-surface text-text-4 hover:text-text transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters Bar */}
            <div className="p-3 sm:p-4 border-b border-border bg-bg/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      activeCategory === cat
                        ? "bg-blue text-white shadow-xs"
                        : "bg-surface text-text-3 hover:text-text hover:bg-surface-2 border border-border"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-text-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search diagrams (git, auth, db...)"
                  className="w-full pl-8.5 pr-3 py-1.5 bg-surface border border-border rounded-xl text-xs text-text placeholder:text-text-4 focus:outline-none focus:border-blue transition-colors"
                />
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              {filteredTemplates.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center space-y-2">
                  <p className="text-sm font-bold text-text-3">No matching diagram templates found</p>
                  <p className="text-xs text-text-4">Try searching for keywords like "flowchart", "api", or "database"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.map((tpl) => {
                    const IconComp = tpl.icon;
                    return (
                      <div
                        key={tpl.id}
                        className="group p-4 bg-surface/80 hover:bg-surface border border-border hover:border-blue/50 rounded-2xl transition-all duration-200 flex flex-col justify-between gap-3 shadow-xs hover:shadow-md"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-blue/10 flex items-center justify-center text-blue shrink-0">
                                <IconComp className="w-4 h-4" />
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-text group-hover:text-blue transition-colors">
                                {tpl.title}
                              </h4>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-border text-text-4 text-[10px] font-mono font-semibold uppercase">
                              {tpl.category}
                            </span>
                          </div>

                          <p className="text-xs text-text-3 leading-relaxed">
                            {tpl.description}
                          </p>
                        </div>

                        {/* Code Snippet Box */}
                        <div className="relative">
                          <pre className="p-2.5 bg-bg/90 border border-border rounded-xl text-[10px] font-mono text-text-3 overflow-x-auto max-h-24 custom-scrollbar">
                            <code>{tpl.snippet.trim()}</code>
                          </pre>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
                          <button
                            type="button"
                            onClick={(e) => handleCopy(tpl.id, tpl.snippet, e)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-text-4 hover:text-text transition-colors px-2 py-1 rounded-lg hover:bg-bg cursor-pointer"
                          >
                            {copiedId === tpl.id ? (
                              <>
                                <Check className="w-3 h-3 text-green" />
                                <span className="text-green">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onSelectTemplate(tpl.snippet);
                              onClose();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue text-white rounded-xl text-xs font-bold hover:bg-blue/90 transition-all shadow-xs cursor-pointer ml-auto"
                          >
                            <span>Insert Diagram</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
