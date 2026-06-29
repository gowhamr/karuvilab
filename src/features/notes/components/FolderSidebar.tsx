import React, { useState } from 'react';
import { useNotesStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { Folder as FolderIcon, Plus, MoreVertical, Trash2, Edit2, FolderOpen } from 'lucide-react';
import { generateId } from '../utils';
import { cn } from '@/src/lib/utils';
import * as Popover from '@radix-ui/react-popover';

export function FolderSidebar() {
  const folders = useNotesStore(state => state.folders);
  const filter = useNotesStore(useShallow(state => state.filter));
  const setFolderFilter = useNotesStore(state => state.setFolderFilter);
  const addFolder = useNotesStore(state => state.addFolder);
  const updateFolder = useNotesStore(state => state.updateFolder);
  const removeFolder = useNotesStore(state => state.removeFolder);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    addFolder({
      id: generateId(),
      name: newFolderName.trim(),
      parentId: null,
    });
    setNewFolderName('');
    setIsAdding(false);
  };

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditingFolderId(null);
      return;
    }
    const folder = folders.find(f => f.id === id);
    if (folder) {
      updateFolder({ ...folder, name: editName.trim() });
    }
    setEditingFolderId(null);
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-border bg-surface/50 overflow-y-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-4 flex items-center gap-2">
            <FolderOpen size={14} /> Folders
          </h2>
          <button 
            onClick={() => setIsAdding(true)}
            className="p-1 hover:bg-surface-2 rounded text-text-3 hover:text-text transition-colors"
            title="New Folder"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => setFolderFilter(null)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
              filter.folderId === null ? "bg-blue/10 text-blue font-bold" : "text-text-3 hover:bg-surface-2 hover:text-text"
            )}
          >
            <FolderIcon size={16} className={filter.folderId === null ? "fill-current opacity-20" : ""} />
            All Notes
          </button>

          {folders.map(folder => {
            const isEditing = editingFolderId === folder.id;
            const isActive = filter.folderId === folder.id;

            if (isEditing) {
              return (
                <form key={folder.id} onSubmit={(e) => handleEditSubmit(e, folder.id)} className="px-3 py-1">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={(e) => handleEditSubmit(e, folder.id)}
                    className="w-full bg-surface-2 border border-border rounded px-2 py-1 text-sm outline-none focus:border-blue"
                  />
                </form>
              );
            }

            return (
              <div 
                key={folder.id}
                className={cn(
                  "group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                  isActive ? "bg-blue/10 text-blue font-bold" : "text-text-3 hover:bg-surface-2 hover:text-text"
                )}
              >
                <button 
                  onClick={() => setFolderFilter(folder.id)}
                  className="flex-1 flex items-center gap-3 text-left truncate"
                >
                  <FolderIcon size={16} className={isActive ? "fill-current opacity-20" : ""} />
                  <span className="truncate">{folder.name}</span>
                </button>
                
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-bg rounded transition-all">
                      <MoreVertical size={14} />
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content align="end" className="w-40 bg-surface border border-border shadow-xl rounded-xl p-1 z-popover animate-in fade-in zoom-in-95">
                      <button 
                        onClick={() => {
                          setEditName(folder.name);
                          setEditingFolderId(folder.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-3 hover:bg-surface-2 hover:text-text rounded-lg transition-colors"
                      >
                        <Edit2 size={14} /> Rename
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm('Are you sure you want to delete this folder? Notes inside will not be deleted, just removed from the folder.')) {
                            removeFolder(folder.id);
                            if (filter.folderId === folder.id) setFolderFilter(null);
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>
            );
          })}

          {isAdding && (
            <form onSubmit={handleAddSubmit} className="px-3 py-1 mt-2">
              <input
                autoFocus
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={() => { if(!newFolderName) setIsAdding(false) }}
                className="w-full bg-surface-2 border border-border rounded px-2 py-1 text-sm outline-none focus:border-blue"
              />
            </form>
          )}
        </div>
      </div>
    </aside>
  );
}
