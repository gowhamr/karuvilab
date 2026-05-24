import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { StructuredData } from '../lib/seo';
import { ToolEntry, CategoryEntry } from '../../registry/types';

// Mock Next.js Script component
vi.mock('next/script', () => ({
  default: ({ dangerouslySetInnerHTML, id }: { dangerouslySetInnerHTML: { __html: string }, id: string }) => (
    <script id={id} dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
  )
}));

// Mock tool registry to avoid large imports
vi.mock('@/src/tool-registry', () => ({
  ALL_TOOLS: [],
  CATEGORIES: []
}));

vi.mock('@/src/tool-content', () => ({
  TOOL_CONTENT: {}
}));

describe('StructuredData Breadcrumb Validation', () => {
  const mockCategory: CategoryEntry = {
    id: 'calculators',
    label: 'Calculators',
    href: 'calculators/',
    emoji: '📊',
    description: 'Calc desc',
    color: '#000'
  };

  const mockTool: ToolEntry = {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    desc: 'EMI desc',
    href: 'calculators/emi-calculator/',
    category: 'calculators',
    keywords: []
  };

  const extractBreadcrumb = (result: React.JSX.Element) => {
    // React elements are objects. Breadcrumb is always the first script (scripts[0])
    const scripts = React.Children.toArray(result.props.children);
    const breadcrumbScript = scripts[0] as React.ReactElement;
    if (!breadcrumbScript) throw new Error('No breadcrumb script found');
    return JSON.parse(breadcrumbScript.props.dangerouslySetInnerHTML.__html);
  };

  it('validates Category-only page has 2 items: Home → Category', () => {
    const result = StructuredData({ category: mockCategory });
    const data = extractBreadcrumb(result);
    const items = data.itemListElement;

    expect(items).toHaveLength(2);
    expect(items[0].name).toBe('Home');
    expect(items[0].item).toBe('https://karuvilab.com/');
    expect(items[1].name).toBe('Calculators');
    expect(items[1].position).toBe(2);
    expect(items[1].item).toBe('https://karuvilab.com/calculators/');
  });

  it('validates Tool-only page (no category) has 2 items: Home → Tool', () => {
    const result = StructuredData({ tool: mockTool });
    const data = extractBreadcrumb(result);
    const items = data.itemListElement;

    expect(items).toHaveLength(2);
    expect(items[1].name).toBe('EMI Calculator');
    expect(items[1].position).toBe(2);
    expect(items[1].item).toBe('https://karuvilab.com/calculators/emi-calculator/');
  });

  it('validates special characters are handled by JSON.stringify', () => {
    const toolWithSpecialChars = { ...mockTool, name: 'JSON & "CSV" Converter' };
    const result = StructuredData({ tool: toolWithSpecialChars });
    // If this doesn't throw, JSON.parse worked, meaning stringify escaped correctly
    const data = extractBreadcrumb(result);
    expect(data.itemListElement[1].name).toBe('JSON & "CSV" Converter');
  });

  it('validates double leading slashes in href are normalized', () => {
    const brokenTool = { ...mockTool, href: '//broken/path//' };
    const result = StructuredData({ tool: brokenTool });
    const data = extractBreadcrumb(result);
    expect(data.itemListElement[1].item).toBe('https://karuvilab.com/broken/path/');
  });

  it('validates root BASE_URL is strictly canonical with trailing slash', () => {
    const result = StructuredData({});
    const data = extractBreadcrumb(result);
    expect(data.itemListElement[0].item).toBe('https://karuvilab.com/');
  });
});
