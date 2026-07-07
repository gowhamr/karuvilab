#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error("Usage: node scripts/scaffold-tool.js <category> <tool-id>");
  process.exit(1);
}

const [category, toolId] = args;
const featuresDir = path.resolve(process.cwd(), 'src/features', toolId);
const appDir = path.resolve(process.cwd(), 'app/(tools)', category, toolId);

// 1. Create feature directory
fs.mkdirSync(featuresDir, { recursive: true });

const clientWrapperContent = `"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ${toolId}Client = dynamic(
  () => import('./${toolId}Client'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function ${toolId}ClientWrapper() {
  return <${toolId}Client />;
}
`;

const clientContent = `"use client";

import { useState } from 'react';
import { MetricCard } from '@/components/ui/MetricCard';

export default function ${toolId}Client() {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold text-text mb-4">New Tool: ${toolId}</h2>
        <p className="text-text-3">Implementation goes here.</p>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(featuresDir, `${toolId}ClientWrapper.tsx`), clientWrapperContent);
fs.writeFileSync(path.join(featuresDir, `${toolId}Client.tsx`), clientContent);

// 2. Create app route directory
fs.mkdirSync(appDir, { recursive: true });

const pageContent = `import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ${toolId}ClientWrapper from '@/src/features/${toolId}/${toolId}ClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("${toolId}");
}

export default function Page() {
  return (
    <ToolShell toolId="${toolId}" title="${toolId}">
      <${toolId}ClientWrapper />
    </ToolShell>
  );
}
`;

fs.writeFileSync(path.join(appDir, 'page.tsx'), pageContent);

console.log(`✅ Scaffolded tool: ${toolId} in category: ${category}`);
console.log(`- Created ${featuresDir}`);
console.log(`- Created ${appDir}`);
