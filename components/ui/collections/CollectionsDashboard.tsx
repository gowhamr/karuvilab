"use client";

import React, { useState, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCollectionStore, ToolCollection } from "@/src/store/useCollectionStore";
import { ALL_TOOLS, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { 
  FolderHeart, Pin, PinOff, Plus, Trash2, Edit, 
  ArrowUp, ArrowDown, Download, Upload, Search, 
  ChevronDown, ChevronUp, Sparkles, FolderOpen, X 
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { blobManager } from "@/src/lib/blob-manager";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { cn } from "@/src/lib/utils";
import { useFocusTrap } from "@/src/lib/a11y/useFocusTrap";

const PRESET_COLORS = [
  "#4F46E5", // Indigo
  "#BE123C", // Rose
  "#D97706", // Amber
  "#059669", // Emerald
  "#0284C7", // Sky
  "#7C3AED", // Violet
  "#64748B", // Slate
];

const PRESET_EMOJIS = ["💻", "🖼", "📊", "🔒", "🛠", "📈", "🎓", "🏢", "🎨", "📅", "🚀", "📦"];

export function CollectionsDashboard() {
  const { 
    collections, 
    createCollection, 
    deleteCollection, 
    updateCollection,
    togglePinCollection,
    reorderCollections,
    importCollections
  } = useCollectionStore(useShallow(s => ({
    collections: s.collections,
    createCollection: s.createCollection,
    deleteCollection: s.deleteCollection,
    updateCollection: s.updateCollection,
    togglePinCollection: s.togglePinCollection,
    reorderCollections: s.reorderCollections,
    importCollections: s.importCollections
  })));

  const favorites = useFavoriteStore(state => state.favorites);
  const { toast } = useToast();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, showCreateModal);

  // Form State
  const [colName, setColName] = useState("");
  const [colDesc, setColDesc] = useState("");
  const [colIcon, setColIcon] = useState("📦");
  const [colColor, setColColor] = useState("#4F46E5");
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [toolSearchQuery, setToolSearchQuery] = useState("");

  // Search filter for collections
  const filteredCollections = useMemo(() => {
    return collections.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [collections, searchQuery]);

  const filteredToolsForModal = useMemo(() => {
    if (!toolSearchQuery.trim()) return ALL_TOOLS;
    const q = toolSearchQuery.toLowerCase();
    return ALL_TOOLS.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.desc.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  }, [toolSearchQuery]);

  const handleOpenCreate = () => {
    setColName("");
    setColDesc("");
    setColIcon("📦");
    setColColor("#4F46E5");
    setSelectedToolIds([]);
    setEditId(null);
    setToolSearchQuery("");
    setShowCreateModal(true);
  };

  const handleOpenEdit = (col: ToolCollection, e: React.MouseEvent) => {
    e.stopPropagation();
    setColName(col.name);
    setColDesc(col.description);
    setColIcon(col.icon);
    setColColor(col.color);
    setSelectedToolIds(col.toolIds);
    setEditId(col.id);
    setToolSearchQuery("");
    setShowCreateModal(true);
  };

  const handleSave = () => {
    if (!colName.trim()) {
      toast("Name is required", "error");
      return;
    }

    if (editId) {
      updateCollection(editId, {
        name: colName,
        description: colDesc,
        icon: colIcon,
        color: colColor,
        toolIds: selectedToolIds
      });
      toast("Collection updated successfully", "success");
    } else {
      createCollection({
        name: colName,
        description: colDesc,
        icon: colIcon,
        color: colColor,
        toolIds: selectedToolIds
      });
      toast("Collection created successfully", "success");
    }

    setShowCreateModal(false);
  };

  const handleToggleToolSelection = (id: string) => {
    setSelectedToolIds(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleMove = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const newOrder = [...collections.map(c => c.id)];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    
    if (targetIdx >= 0 && targetIdx < newOrder.length) {
      const temp = newOrder[index]!;
      newOrder[index] = newOrder[targetIdx]!;
      newOrder[targetIdx] = temp;
      reorderCollections(newOrder);
    }
  };

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = JSON.stringify(collections, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    blobManager.download(blob, "karuvilab-collections.json");
    toast("Collections exported successfully", "success");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        const success = importCollections(result);
        if (success) {
          toast("Collections imported successfully", "success");
        } else {
          toast("Invalid collections backup file", "error");
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* ── Dashboard Toolbar ── */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-surface-2/40 border border-border/60 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
          <input
            type="text"
            placeholder="Search custom collections..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border hover:border-text-4/30 focus:border-brand-primary rounded-xl text-sm text-text focus:outline-none transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Export */}
          <button
            onClick={handleExport}
            className="px-3.5 py-2.5 bg-surface border border-border hover:bg-hover text-text-2 hover:text-text rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          
          {/* Import */}
          <label className="px-3.5 py-2.5 bg-surface border border-border hover:bg-hover text-text-2 hover:text-text rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" /> Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          {/* Create */}
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-md shadow-brand-primary/10 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
      </div>

      {/* ── Collections List ── */}
      <div className="space-y-4">
        {filteredCollections.length === 0 ? (
          <div className="text-center py-16 bg-surface-2/20 border border-dashed border-border rounded-3xl flex flex-col items-center gap-3">
            <FolderOpen className="w-10 h-10 text-text-4" />
            <div>
              <p className="text-sm font-bold text-text">No collections found</p>
              <p className="text-xs text-text-muted mt-1">Create your first group to bundle your tools.</p>
            </div>
          </div>
        ) : (
          filteredCollections.map((col, idx) => {
            const isExpanded = expandedId === col.id;
            const matchedTools = ALL_TOOLS.filter(t => col.toolIds.includes(t.id));

            return (
              <div 
                key={col.id}
                className={cn(
                  "border border-border/80 rounded-2xl overflow-hidden bg-surface-2/20 hover:bg-surface-2/30 transition-all",
                  col.isPinned && "border-brand-primary/30"
                )}
              >
                {/* Collection Summary Header */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : col.id)}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: `${col.color}15`, border: `1px solid ${col.color}30` }}
                    >
                      {col.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-text text-sm flex items-center gap-2">
                        {col.name}
                        {col.isPinned && <Pin className="w-3.5 h-3.5 text-brand-primary fill-current shrink-0" />}
                      </h4>
                      <p className="text-xs text-text-muted mt-0.5 truncate max-w-md">{col.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
                    {/* Stats */}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-surface/50 border border-border/30 px-2.5 py-1 rounded-full shrink-0">
                      {col.toolIds.length} Tools
                    </span>

                    {/* Toolbar */}
                    <div className="flex items-center gap-1.5">
                      {/* Reorder */}
                      <button
                        disabled={idx === 0}
                        onClick={(e) => handleMove(idx, "up", e)}
                        className="p-2 text-text-4 hover:text-text disabled:opacity-30 rounded-lg hover:bg-surface transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === collections.length - 1}
                        onClick={(e) => handleMove(idx, "down", e)}
                        className="p-2 text-text-4 hover:text-text disabled:opacity-30 rounded-lg hover:bg-surface transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Pin */}
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePinCollection(col.id); }}
                        className="p-2 text-text-4 hover:text-brand-primary rounded-lg hover:bg-surface transition-colors"
                      >
                        {col.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={(e) => handleOpenEdit(col, e)}
                        className="p-2 text-text-4 hover:text-text rounded-lg hover:bg-surface transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window['confirm']("Are you sure you want to delete this collection?")) {
                            deleteCollection(col.id);
                            toast("Collection deleted", "info");
                          }
                        }}
                        className="p-2 text-text-4 hover:text-error rounded-lg hover:bg-error/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isExpanded ? <ChevronUp className="w-4 h-4 text-text-4 shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-4 shrink-0" />}
                  </div>
                </div>

                {/* Expanded Tools View */}
                {isExpanded && (
                  <div className="border-t border-border/60 bg-surface/30 p-4">
                    {matchedTools.length === 0 ? (
                      <div className="text-center py-8 text-xs text-text-muted">
                        No tools in this collection yet. Edit the collection to add tools.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                        {matchedTools.map(tool => (
                          <ToolCard key={tool.id} tool={tool} compact />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={editId ? "Edit Collection" : "Create Collection"}
            className="w-full max-w-2xl bg-surface-2 border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                  <FolderHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-text tracking-tight">
                    {editId ? "Edit Collection" : "Create Collection"}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">Bundle your workspace</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-text-4 hover:text-text hover:bg-surface rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Form Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Collection Name</label>
                  <input
                    type="text"
                    placeholder="E.g., Dev Utilities"
                    value={colName}
                    onChange={e => setColName(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border focus:border-brand-primary rounded-xl text-sm text-text focus:outline-none transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Description</label>
                  <input
                    type="text"
                    placeholder="Short description..."
                    value={colDesc}
                    onChange={e => setColDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border focus:border-brand-primary rounded-xl text-sm text-text focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Icon & Color presetter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Choose Color</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setColColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-lg border-2 transition-all shrink-0",
                          colColor === color ? "border-text scale-105" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Choose Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setColIcon(emoji)}
                        className={cn(
                          "w-8 h-8 rounded-lg border text-sm flex items-center justify-center transition-all bg-surface shrink-0",
                          colIcon === emoji ? "border-text scale-105" : "border-border opacity-60 hover:opacity-100"
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tools selector list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Select Tools ({selectedToolIds.length})</label>
                  {selectedToolIds.length > 0 && (
                    <button 
                      onClick={() => setSelectedToolIds([])}
                      className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:underline transition-all"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-4" />
                  <input
                    type="text"
                    placeholder="Search tools to add..."
                    value={toolSearchQuery}
                    onChange={e => setToolSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-surface border border-border focus:border-brand-primary rounded-xl text-xs text-text focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 bg-surface rounded-2xl border border-border/80 custom-scrollbar shadow-inner">
                  {filteredToolsForModal.map(tool => {
                    const isSelected = selectedToolIds.includes(tool.id);
                    return (
                      <div
                        key={tool.id}
                        onClick={() => handleToggleToolSelection(tool.id)}
                        className={cn(
                          "flex items-center gap-2.5 p-2.5 bg-surface hover:bg-hover border rounded-xl cursor-pointer select-none transition-all active:scale-98",
                          isSelected ? "border-brand-primary/60 bg-brand-primary/5 shadow-sm" : "border-border/50"
                        )}
                        title={tool.name}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="rounded text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="text-xs font-bold text-text truncate">{tool.name}</span>
                      </div>
                    );
                  })}
                  {filteredToolsForModal.length === 0 && (
                    <div className="col-span-full py-8 text-center text-xs text-text-muted">
                      No tools found matching "{toolSearchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-surface border-t border-border flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 bg-surface border border-border hover:bg-hover text-text-2 rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 shadow-md shadow-brand-primary/10 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
