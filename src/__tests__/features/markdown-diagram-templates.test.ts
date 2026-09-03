import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DIAGRAM_TEMPLATES } from '../../features/markdown/components/DiagramTemplateGallery';

describe('Markdown Diagram Template Gallery', () => {
  it('contains comprehensive set of categorized templates', () => {
    assert.ok(DIAGRAM_TEMPLATES.length >= 12);
    
    const categories = new Set(DIAGRAM_TEMPLATES.map(t => t.category));
    assert.ok(categories.has('Architecture'));
    assert.ok(categories.has('Engineering'));
    assert.ok(categories.has('Data & Planning'));
  });

  it('ensures all template snippets are valid fenced Mermaid blocks', () => {
    for (const tpl of DIAGRAM_TEMPLATES) {
      assert.ok(tpl.id, 'Template must have an id');
      assert.ok(tpl.title, 'Template must have a title');
      assert.ok(tpl.description, 'Template must have a description');
      assert.ok(tpl.tags.length > 0, 'Template must have search tags');
      
      const snippet = tpl.snippet.trim();
      assert.ok(
        snippet.startsWith('```mermaid'),
        `Template ${tpl.id} must start with \`\`\`mermaid`
      );
      assert.ok(
        snippet.endsWith('```'),
        `Template ${tpl.id} must end with \`\`\``
      );
    }
  });

  it('verifies specialized engineering diagrams exist', () => {
    const ids = DIAGRAM_TEMPLATES.map(t => t.id);
    assert.ok(ids.includes('flowchart'));
    assert.ok(ids.includes('sequence'));
    assert.ok(ids.includes('er'));
    assert.ok(ids.includes('gitgraph'));
    assert.ok(ids.includes('mindmap'));
    assert.ok(ids.includes('c4'));
    assert.ok(ids.includes('kanban'));
  });
});
