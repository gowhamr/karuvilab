import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter } from '../../features/markdown/utils/frontmatter-parser';

describe('Markdown Frontmatter Parser', () => {
  it('parses valid YAML frontmatter attributes correctly', () => {
    const md = `---
title: "Modern Web Engineering"
date: 2026-09-03
author: Gowham
draft: false
tags: [nextjs, react, markdown]
---

# Main Content Here
This is the article body.
`;

    const result = parseFrontmatter(md);
    assert.equal(result.hasFrontmatter, true);
    assert.equal(result.type, 'yaml');
    assert.equal(result.attributes.title, 'Modern Web Engineering');
    assert.equal(result.attributes.date, '2026-09-03');
    assert.equal(result.attributes.author, 'Gowham');
    assert.equal(result.attributes.draft, false);
    assert.deepEqual(result.attributes.tags, ['nextjs', 'react', 'markdown']);
    assert.ok(result.body.includes('# Main Content Here'));
  });

  it('parses multiline list items in YAML frontmatter', () => {
    const md = `---
title: Multiline Tags
tags:
  - engineering
  - privacy
  - speed
---
Document body
`;

    const result = parseFrontmatter(md);
    assert.equal(result.hasFrontmatter, true);
    assert.deepEqual(result.attributes.tags, ['engineering', 'privacy', 'speed']);
    assert.equal(result.attributes.title, 'Multiline Tags');
  });

  it('parses TOML frontmatter (+++ ... +++)', () => {
    const md = `+++
title = "Hugo Post"
draft = true
+++
Hello World
`;

    const result = parseFrontmatter(md);
    assert.equal(result.hasFrontmatter, true);
    assert.equal(result.type, 'toml');
    assert.equal(result.attributes.title, 'Hugo Post');
    assert.equal(result.attributes.draft, true);
    assert.ok(result.body.includes('Hello World'));
  });

  it('returns hasFrontmatter: false when no frontmatter is present', () => {
    const md = `# Just Normal Markdown
No frontmatter at the top.
`;

    const result = parseFrontmatter(md);
    assert.equal(result.hasFrontmatter, false);
    assert.equal(result.type, null);
    assert.deepEqual(result.attributes, {});
    assert.equal(result.body, md);
  });
});
