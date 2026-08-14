"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { ToolWorkspace } from '@/components/ui/ToolWorkspace';
import { ToolResultArea } from '@/components/ui/ToolResultArea';

interface LinkEntry {
  id: string;
  url: string;
  title: string;
  notes: string;
}

export default function ToolClient() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [links, setLinks] = useState<LinkEntry[]>([]);

  const addLink = useCallback(() => {
    setLinks(prev => [...prev, { id: crypto.randomUUID(), url: '', title: '', notes: '' }]);
  }, []);

  const removeLink = useCallback((id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  }, []);

  const updateLink = useCallback((id: string, field: keyof LinkEntry, value: string) => {
    setLinks(prev => prev.map(link => link.id === id ? { ...link, [field]: value } : link));
  }, []);

  const generatedContent = useMemo(() => {
    let content = '';
    if (title) content += `# ${title}\n\n`;
    if (description) {
      const blockquote = description.split('\n').map(line => `> ${line}`).join('\n');
      content += `${blockquote}\n\n`;
    }
    if (instructions) {
      content += `## Instructions\n\n${instructions}\n\n`;
    }
    if (links.length > 0) {
      content += `## Important URLs\n\n`;
      links.forEach(link => {
        if (link.url) {
          const title = link.title || link.url;
          const notesStr = link.notes ? `: ${link.notes}` : '';
          content += `- [${title}](${link.url})${notesStr}\n`;
        }
      });
      content += '\n';
    }
    return content.trim();
  }, [title, description, instructions, links]);

  return (
    <ToolWorkspace
      input={
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-text">Project Info</h2>
            <div className="space-y-3">
              <div>
                <label htmlFor="project-title" className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Project Title</label>
                <input
                  id="project-title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full h-11 px-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-blue transition-all"
                />
              </div>
              <div>
                <label htmlFor="project-desc" className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  id="project-desc"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="A brief overview of the project..."
                  rows={3}
                  className="w-full p-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-blue transition-all resize-none"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-text">Agent Instructions</h2>
            <div>
              <label htmlFor="agent-instructions" className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">System Prompts / Rules</label>
              <textarea
                id="agent-instructions"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="E.g., You are navigating the documentation for MyProject. Always check the API section before answering..."
                rows={5}
                className="w-full p-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-blue transition-all resize-none"
              />
            </div>
          </div>
        </div>
      }
      optionsPanel={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">Important URLs</h2>
            <Button variant="secondary" size="sm" onClick={addLink} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Link
            </Button>
          </div>
          
          {links.length === 0 ? (
            <div className="text-center py-6 text-text-muted text-sm border-2 border-dashed border-border rounded-lg">
              No links added yet.
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex gap-2 items-start bg-bg p-3 rounded-lg border border-border">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={link.url}
                      onChange={e => updateLink(link.id, 'url', e.target.value)}
                      placeholder="https://example.com/api"
                      aria-label="Link URL"
                      className="w-full h-9 px-3 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                    <input
                      type="text"
                      value={link.title}
                      onChange={e => updateLink(link.id, 'title', e.target.value)}
                      placeholder="Link Title (e.g. API Docs)"
                      aria-label="Link Title"
                      className="w-full h-9 px-3 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                    <input
                      type="text"
                      value={link.notes}
                      onChange={e => updateLink(link.id, 'notes', e.target.value)}
                      placeholder="Optional notes about this link..."
                      aria-label="Link Notes"
                      className="w-full h-9 px-3 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                  </div>
                  <button
                    onClick={() => removeLink(link.id)}
                    className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-md transition-colors"
                    title="Remove Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      }
      output={
        <ToolResultArea
          label="Generated llms.txt"
          value={generatedContent}
          downloadFilename="llms.txt"
          downloadMimeType="text/plain;charset=utf-8"
        />
      }
    />
  );
}
