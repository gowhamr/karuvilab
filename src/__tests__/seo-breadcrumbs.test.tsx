import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { StructuredData } from '../lib/seo';
import { ToolEntry, CategoryEntry } from '../registry/types';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

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
    const breadcrumbScript = scripts[0] as any;
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

describe('Breadcrumbs Component UI Rendering', () => {
  const mockCategory: CategoryEntry = {
    id: 'image',
    label: 'Image Tools',
    href: '/image-tools/',
    emoji: '🖼️',
    description: 'Image desc',
    color: '#000'
  };

  it('renders Home, Category, and Tool Title when both category and title are provided', () => {
    const el = Breadcrumbs({ category: mockCategory, title: 'AI Background Remover' });
    
    expect(el.props['aria-label']).toBe('Breadcrumb');
    const children = React.Children.toArray(el.props.children);
    
    // First child: Home link
    expect((children[0] as any).props.children).toBe('Home');
    
    // Second child: Category fragment (slash + Link)
    const categoryChildren = React.Children.toArray((children[1] as any).props.children);
    expect((categoryChildren[1] as any).props.children).toBe('Image Tools');
    expect((categoryChildren[1] as any).props.href).toBe('/image-tools/');

    // Third child: Title fragment (slash + span with aria-current="page")
    const titleChildren = React.Children.toArray((children[2] as any).props.children);
    expect((titleChildren[1] as any).props.children).toBe('AI Background Remover');
    expect((titleChildren[1] as any).props['aria-current']).toBe('page');
  });

  it('renders Home and Category only when title is omitted', () => {
    const el = Breadcrumbs({ category: mockCategory });
    const children = React.Children.toArray(el.props.children);
    expect(children).toHaveLength(2); // Home + Category
  });

  it('renders Home and Title when category is omitted (e.g. All Tools)', () => {
    const el = Breadcrumbs({ title: 'All Tools' });
    const children = React.Children.toArray(el.props.children);
    
    expect((children[0] as any).props.children).toBe('Home');
    const titleChildren = React.Children.toArray((children[1] as any).props.children);
    expect((titleChildren[1] as any).props.children).toBe('All Tools');
  });
});
