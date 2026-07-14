'use client';

import React, { useState, useCallback } from 'react';

// ─────────────────────────────────────────────
// SECTION: Data / Constants
// ─────────────────────────────────────────────

const COLOR_PALETTE = [
  { name: 'Primary', hex: '#4F46E5', label: 'Indigo', tw: 'bg-[#4F46E5]' },
  { name: 'Secondary', hex: '#3B82F6', label: 'Blue', tw: 'bg-[#3B82F6]' },
  { name: 'Success', hex: '#10B981', label: 'Emerald', tw: 'bg-[#10B981]' },
  { name: 'Warning', hex: '#F59E0B', label: 'Amber', tw: 'bg-[#F59E0B]' },
  { name: 'Danger', hex: '#F43F5E', label: 'Rose', tw: 'bg-[#F43F5E]' },
];

const NEUTRAL_SHADES = ['#F8FAFC', '#CBD5E1', '#64748B', '#1E293B', '#0F172A'];

const TYPE_SCALE = [
  { label: 'H1', size: '48px', weight: '800', sample: 'Privacy-First Toolkit' },
  { label: 'H2', size: '36px', weight: '700', sample: 'Browser-Native Tools' },
  { label: 'H3', size: '24px', weight: '600', sample: 'No Uploads. No Login.' },
  { label: 'Title', size: '20px', weight: '500', sample: 'Tool Display Text' },
  { label: 'Body', size: '16px', weight: '400', sample: 'Regular body text for readability and comfort.' },
  { label: 'Caption', size: '12px', weight: '400', sample: 'Small caption text for metadata and labels' },
];

const SPACING = [4, 8, 12, 16, 20, 24, 32, 48, 64];
const RADII = [{ val: 12, label: 'md' }, { val: 16, label: 'lg' }, { val: 20, label: 'xl' }, { val: 24, label: '2xl' }, { val: 32, label: '3xl' }];

const BADGES = [
  { label: 'Offline', color: '#10B981', text: '#fff' },
  { label: 'Worker', color: '#3B82F6', text: '#fff' },
  { label: 'Instant', color: '#8B5CF6', text: '#fff' },
  { label: 'Free', color: '#475569', text: '#fff' },
  { label: 'Premium', color: '#F59E0B', text: '#fff' },
  { label: 'Developer', color: '#06B6D4', text: '#fff' },
  { label: 'Banking', color: '#10B981', text: '#fff' },
  { label: 'Security', color: '#F43F5E', text: '#fff' },
];

const CATEGORIES = [
  { label: 'Developer Tools', count: 47, grad: 'from-[#4F46E5] to-[#7C3AED]', icon: '</>',  lightGrad: 'from-[#EEF2FF] to-[#DDD6FE]', lightIcon: '#4F46E5' },
  { label: 'PDF Tools',       count: 23, grad: 'from-[#3B82F6] to-[#2563EB]', icon: '📄',   lightGrad: 'from-[#EFF6FF] to-[#DBEAFE]', lightIcon: '#3B82F6' },
  { label: 'Banking',         count: 18, grad: 'from-[#10B981] to-[#059669]', icon: '🏦',   lightGrad: 'from-[#ECFDF5] to-[#D1FAE5]', lightIcon: '#059669' },
  { label: 'Security',        count: 15, grad: 'from-[#F43F5E] to-[#E11D48]', icon: '🔒',   lightGrad: 'from-[#FFF1F2] to-[#FFE4E6]', lightIcon: '#E11D48' },
  { label: 'JSON & Data',     count: 12, grad: 'from-[#F59E0B] to-[#D97706]', icon: '{}',   lightGrad: 'from-[#FFFBEB] to-[#FEF3C7]', lightIcon: '#D97706' },
  { label: 'Image Tools',     count: 31, grad: 'from-[#06B6D4] to-[#0891B2]', icon: '🖼️',   lightGrad: 'from-[#ECFEFF] to-[#CFFAFE]', lightIcon: '#0891B2' },
  { label: 'Video Tools',     count: 8,  grad: 'from-[#8B5CF6] to-[#7C3AED]', icon: '▶',    lightGrad: 'from-[#F5F3FF] to-[#EDE9FE]', lightIcon: '#7C3AED' },
  { label: 'Text Tools',      count: 22, grad: 'from-[#64748B] to-[#475569]', icon: 'Tx',   lightGrad: 'from-[#F8FAFC] to-[#F1F5F9]', lightIcon: '#64748B' },
];

const TOOLS = [
  { name: 'JSON Formatter',    sub: 'Format & validate',    icon: '</>',  grad: 'from-[#4F46E5] to-[#7C3AED]', badge: 'Offline', badgeColor: '#10B981', rating: 4.9, fav: true },
  { name: 'PDF Merger',        sub: 'Combine PDF files',    icon: '📄',   grad: 'from-[#3B82F6] to-[#2563EB]', badge: 'Worker',  badgeColor: '#3B82F6', rating: 4.8, fav: false },
  { name: 'Base64 Encoder',    sub: 'Encode & decode',      icon: '#',    grad: 'from-[#8B5CF6] to-[#6D28D9]', badge: 'Offline', badgeColor: '#10B981', rating: 4.7, fav: true },
  { name: 'QR Generator',      sub: 'Create QR codes',      icon: '⬛',   grad: 'from-[#06B6D4] to-[#0891B2]', badge: 'Instant', badgeColor: '#8B5CF6', rating: 4.9, fav: false },
  { name: 'Image Compressor',  sub: 'Lossless compression', icon: '🖼️',   grad: 'from-[#10B981] to-[#059669]', badge: 'Offline', badgeColor: '#10B981', rating: 4.6, fav: false },
  { name: 'Password Gen',      sub: 'Secure passwords',     icon: '🔒',   grad: 'from-[#F43F5E] to-[#E11D48]', badge: 'Offline', badgeColor: '#10B981', rating: 4.8, fav: true },
];

const RECENT_SEARCHES = ['JSON Formatter', 'PDF Merge', 'Base64', 'QR Code'];
const TRENDING = ['JSON Formatter', 'Password Gen', 'Image Compressor', 'PDF Merger', 'Base64'];

const JSON_CODE = `{
  "name": "KaruviLab",
  "version": "2.0.0",
  "privacy": true,
  "tools": 150,
  "features": [
    "offline",
    "browser-native",
    "zero-upload"
  ]
}`;

const BREAKPOINTS = ['320', '375', '390', '768', '1024', '1440'];

// ─────────────────────────────────────────────
// SECTION: Shared Sub-components
// ─────────────────────────────────────────────

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {children}
    </div>
  );
}

function GlassCardLight({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: '#FFFFFF',
        borderColor: 'rgba(0,0,0,0.07)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: '#94A3B8' }}>
      {label}
    </p>
  );
}

function SectionLabelLight({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: '#94A3B8' }}>
      {label}
    </p>
  );
}

// ─────────────────────────────────────────────
// SECTION: Phone Frame
// ─────────────────────────────────────────────

function PhoneFrame({ children, label, light = false }: { children: React.ReactNode; label: string; light?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Phone shell */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{
          width: 240,
          height: 500,
          borderRadius: 36,
          background: light ? '#D1D5DB' : '#1C1C1E',
          boxShadow: light
            ? '0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'
            : '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
          padding: 3,
        }}
      >
        {/* Screen */}
        <div
          className="w-full h-full overflow-hidden"
          style={{
            borderRadius: 34,
            background: light ? '#F8FAFC' : '#0A0F1E',
            position: 'relative',
          }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute top-[10px] left-1/2 -translate-x-1/2 z-content"
            style={{
              width: 80,
              height: 22,
              borderRadius: 20,
              background: light ? '#1C1C1E' : '#000',
            }}
          />
          {/* Status Bar */}
          <div className="absolute top-[14px] left-4 right-4 flex justify-between items-center z-content" style={{ height: 14 }}>
            <span className="text-[8px] font-semibold" style={{ color: light ? '#1C1C1E' : '#fff' }}>9:41</span>
            <div className="flex gap-1 items-center">
              {/* signal bars */}
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                {[2, 4, 6, 8].map((h, i) => (
                  <rect key={i} x={i * 2.5} y={8 - h} width={1.8} height={h} rx={0.5}
                    fill={light ? '#1C1C1E' : '#fff'} />
                ))}
              </svg>
              {/* wifi */}
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M5 6.5a1 1 0 110-2 1 1 0 010 2zM2 3.5a4.5 4.5 0 016 0M0 1.5A7 7 0 0110 1.5" stroke={light ? '#1C1C1E' : '#fff'} strokeWidth="1" strokeLinecap="round" fill="none" />
              </svg>
              {/* battery */}
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <rect x="0" y="1" width="11" height="6" rx="1.5" stroke={light ? '#1C1C1E' : '#fff'} strokeWidth="1" />
                <rect x="11.5" y="2.5" width="1.5" height="3" rx="0.5" fill={light ? '#1C1C1E' : '#fff'} />
                <rect x="1" y="2" width="8" height="4" rx="0.5" fill={light ? '#1C1C1E' : '#fff'} />
              </svg>
            </div>
          </div>
          {/* Content area */}
          <div className="absolute inset-0 pt-[36px] overflow-hidden">
            {children}
          </div>
        </div>
      </div>
      {/* Label */}
      <span
        className="text-[11px] font-semibold tracking-wide uppercase"
        style={{ color: light ? '#64748B' : '#94A3B8' }}
      >
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION: Dark Screens
// ─────────────────────────────────────────────

function BottomNav({ active, light = false }: { active: number; light?: boolean }) {
  const tabs = [
    { icon: '⌂', label: 'Home' },
    { icon: '⌕', label: 'Search' },
    { icon: '⊞', label: 'Tools' },
    { icon: '♡', label: 'Favs' },
    { icon: '⚙', label: 'Settings' },
  ];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-2 py-2"
      style={{
        background: light ? 'rgba(255,255,255,0.92)' : 'rgba(10,15,30,0.9)',
        backdropFilter: 'blur(16px)',
        borderTop: light ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.06)',
        height: 52,
      }}
    >
      {tabs.map((t, i) => (
        <div key={t.label} className="flex flex-col items-center gap-0.5" style={{ width: 40 }}>
          <span className="text-[14px]" style={{ color: i === active ? '#4F46E5' : light ? '#94A3B8' : '#64748B' }}>
            {t.icon}
          </span>
          <span className="text-[8px] font-medium" style={{ color: i === active ? '#4F46E5' : light ? '#94A3B8' : '#64748B' }}>
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScreenHome({ light = false }: { light?: boolean }) {
  const t = light ? '#111827' : '#F8FAFC';
  const m = light ? '#64748B' : '#94A3B8';
  const card = light
    ? { bg: '#FFFFFF', border: 'rgba(0,0,0,0.06)', shadow: '0 2px 12px rgba(0,0,0,0.08)' }
    : { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.07)', shadow: 'none' };
  const searchBg = light ? '#F1F5F9' : 'rgba(255,255,255,0.06)';

  const quickActions = ['</> JSON', '📄 PDF', '# Base64', '⬛ QR'];
  const favorites = [
    { name: 'JSON', icon: '</>', grad: 'from-[#4F46E5] to-[#7C3AED]' },
    { name: 'Base64', icon: '#', grad: 'from-[#8B5CF6] to-[#6D28D9]' },
    { name: 'PDF', icon: '📄', grad: 'from-[#3B82F6] to-[#2563EB]' },
    { name: 'QR', icon: '⬛', grad: 'from-[#06B6D4] to-[#0891B2]' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ color: t }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-2 pb-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black text-white"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}>KV</div>
        <div className="flex gap-2">
          <span style={{ color: m }}>🔔</span>
          <div className="w-7 h-7 rounded-full" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }} />
        </div>
      </div>
      {/* Greeting */}
      <div className="px-4 mb-2">
        <p className="text-[15px] font-bold leading-tight" style={{ color: t }}>Good Evening, Alex 👋</p>
        <p className="text-[10px]" style={{ color: m }}>What would you like to do today?</p>
      </div>
      {/* Search */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: searchBg, border: `1px solid ${card.border}` }}>
          <span className="text-[10px]" style={{ color: '#4F46E5' }}>⌕</span>
          <span className="text-[9px]" style={{ color: m }}>Search 150+ tools…</span>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="px-4 mb-3">
        <p className="text-[9px] font-semibold mb-1.5" style={{ color: t }}>Quick Actions</p>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {quickActions.map(a => (
            <span key={a} className="px-2 py-1 rounded-full text-[8px] font-medium whitespace-nowrap flex-shrink-0"
              style={{ background: card.bg, border: `1px solid ${card.border}`, color: t, boxShadow: card.shadow }}>
              {a}
            </span>
          ))}
        </div>
      </div>
      {/* Continue */}
      <div className="px-4 mb-3">
        <p className="text-[9px] font-semibold mb-1.5" style={{ color: t }}>Continue where you left off →</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {[{ n: 'JSON Formatter', g: 'from-[#4F46E5] to-[#7C3AED]' }, { n: 'PDF Merger', g: 'from-[#3B82F6] to-[#2563EB]' }].map(c => (
            <div key={c.n} className="flex-shrink-0 rounded-xl p-2.5" style={{ width: 110, background: card.bg, border: `1px solid ${card.border}`, boxShadow: card.shadow }}>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.g} flex items-center justify-center text-[10px] text-white mb-2`}>{c.n[0]}</div>
              <p className="text-[9px] font-semibold leading-tight mb-0.5" style={{ color: t }}>{c.n}</p>
              <p className="text-[8px]" style={{ color: m }}>2 min ago</p>
              <div className="mt-1.5 h-0.5 rounded-full" style={{ background: light ? '#E2E8F0' : 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full w-3/5" style={{ background: '#4F46E5' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Favorites */}
      <div className="px-4 mb-2">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-[9px] font-semibold" style={{ color: t }}>⭐ Favorites</p>
          <span className="text-[8px]" style={{ color: '#4F46E5' }}>See all</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {favorites.map(f => (
            <div key={f.name} className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl" style={{ background: card.bg, border: `1px solid ${card.border}`, boxShadow: card.shadow }}>
              <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${f.grad} flex items-center justify-center text-[8px] text-white flex-shrink-0`}>{f.icon}</div>
              <div>
                <p className="text-[8px] font-semibold" style={{ color: t }}>{f.name}</p>
                <span className="text-[7px] px-1 rounded-full text-white" style={{ background: '#10B981' }}>Offline</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Trending */}
      <div className="px-4 mb-16">
        <p className="text-[9px] font-semibold mb-1.5" style={{ color: t }}>🔥 Trending</p>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {TRENDING.slice(0, 3).map((tr, i) => (
            <div key={tr} className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-xl" style={{ background: card.bg, border: `1px solid ${card.border}`, boxShadow: card.shadow }}>
              <span className="text-[8px] font-black" style={{ color: '#4F46E5' }}>{i + 1}</span>
              <span className="text-[8px]" style={{ color: t }}>{tr}</span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active={0} light={light} />
    </div>
  );
}

function ScreenTools({ light = false }: { light?: boolean }) {
  const t = light ? '#111827' : '#F8FAFC';
  const m = light ? '#64748B' : '#94A3B8';
  const card = light
    ? { bg: '#FFFFFF', border: 'rgba(0,0,0,0.07)', shadow: '0 2px 12px rgba(0,0,0,0.07)' }
    : { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.07)', shadow: 'none' };
  const searchBg = light ? '#F1F5F9' : 'rgba(255,255,255,0.06)';
  const filters = ['All', 'PDF', 'Dev', 'Banking', 'JSON', 'Image'];

  return (
    <div className="flex flex-col h-full" style={{ color: t }}>
      <div className="px-4 pt-2 pb-2 flex justify-between items-center">
        <p className="text-[16px] font-extrabold" style={{ color: t }}>All Tools</p>
        <div className="flex gap-1">
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px]" style={{ background: '#4F46E5', color: '#fff' }} aria-label="Grid view">⊞</button>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px]" style={{ background: card.bg, border: `1px solid ${card.border}`, color: m }} aria-label="List view">≡</button>
        </div>
      </div>
      {/* Search */}
      <div className="px-4 mb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: searchBg, border: `1px solid ${card.border}` }}>
          <span className="text-[10px]" style={{ color: '#4F46E5' }}>⌕</span>
          <span className="text-[9px]" style={{ color: m }}>Search tools…</span>
        </div>
      </div>
      {/* Filters */}
      <div className="px-4 mb-3 flex gap-1.5 overflow-x-auto scrollbar-none">
        {filters.map((f, i) => (
          <span key={f} className="px-2.5 py-1 rounded-full text-[8px] font-semibold whitespace-nowrap flex-shrink-0"
            style={{
              background: i === 0 ? '#4F46E5' : card.bg,
              border: `1px solid ${i === 0 ? '#4F46E5' : card.border}`,
              color: i === 0 ? '#fff' : m,
              boxShadow: card.shadow,
            }}>
            {f}
          </span>
        ))}
      </div>
      {/* Tool Cards Grid */}
      <div className="px-4 grid grid-cols-2 gap-2 overflow-y-auto scrollbar-none pb-16" style={{ flex: 1 }}>
        {TOOLS.map(tool => (
          <div key={tool.name} className="rounded-xl p-2.5" style={{ background: card.bg, border: `1px solid ${card.border}`, boxShadow: card.shadow }}>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tool.grad} flex items-center justify-center text-[11px] text-white mb-2`}>
              {tool.icon}
            </div>
            <p className="text-[9px] font-semibold leading-tight mb-0.5" style={{ color: t }}>{tool.name}</p>
            <p className="text-[8px] mb-1.5" style={{ color: m }}>{tool.sub}</p>
            <div className="flex items-center justify-between">
              <span className="text-[7px] px-1.5 py-0.5 rounded-full text-white font-medium" style={{ background: tool.badgeColor }}>
                {tool.badge}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[7px]" style={{ color: '#F59E0B' }}>★</span>
                <span className="text-[7px]" style={{ color: m }}>{tool.rating}</span>
                <span className="text-[10px]" style={{ color: tool.fav ? '#F43F5E' : m }}>{tool.fav ? '♥' : '♡'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active={2} light={light} />
    </div>
  );
}

function ScreenCategories({ light = false }: { light?: boolean }) {
  const t = light ? '#111827' : '#F8FAFC';
  const m = light ? '#64748B' : '#94A3B8';

  return (
    <div className="flex flex-col h-full" style={{ color: t }}>
      <div className="px-4 pt-2 pb-2">
        <p className="text-[16px] font-extrabold" style={{ color: t }}>Categories</p>
        <p className="text-[9px]" style={{ color: m }}>150+ tools organized by type</p>
      </div>
      <div className="px-4 grid grid-cols-2 gap-2 overflow-y-auto scrollbar-none pb-14" style={{ flex: 1 }}>
        {CATEGORIES.map(cat => (
          <div
            key={cat.label}
            className="rounded-2xl p-3 flex flex-col justify-between"
            style={{
              height: 90,
              background: light
                ? `linear-gradient(135deg, ${(cat.lightGrad.split(' ')[0] || '').replace('from-[', '').replace(']', '')}, ${(cat.lightGrad.split(' ')[1] || '').replace('to-[', '').replace(']', '')})`
                : undefined,
            }}
          >
            {!light && (
              <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${cat.grad} absolute inset-0 rounded-2xl`} />
            )}
            <div className={`relative ${!light ? `rounded-2xl bg-gradient-to-br ${cat.grad}` : ''} flex flex-col justify-between h-full`}
              style={light ? {
                background: `linear-gradient(135deg, ${cat.lightGrad.replace('from-[', '').replace('] to-[', ', ').replace(']', '')})`,
                borderRadius: 16,
                padding: 12,
              } : { padding: 12 }}>
              <span className="text-[18px]">{cat.icon}</span>
              <div>
                <p className="text-[9px] font-bold leading-tight" style={{ color: light ? cat.lightIcon : '#fff' }}>{cat.label}</p>
                <span className="text-[7px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)', color: light ? cat.lightIcon : '#fff' }}>
                  {cat.count} tools
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active={2} light={light} />
    </div>
  );
}

function ScreenToolDetail({ light = false }: { light?: boolean }) {
  const [activeTab, setActiveTab] = useState(0);
  const t = light ? '#111827' : '#F8FAFC';
  const m = light ? '#64748B' : '#94A3B8';
  const card = light
    ? { bg: '#FFFFFF', border: 'rgba(0,0,0,0.07)', shadow: '0 2px 12px rgba(0,0,0,0.07)' }
    : { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.07)', shadow: 'none' };
  const codeBg = light ? '#F8FAFC' : '#0D1117';
  const tabs = ['Tool', 'Examples', 'Docs', 'Related'];

  const handleTabClick = useCallback((i: number) => setActiveTab(i), []);

  return (
    <div className="flex flex-col h-full" style={{ color: t }}>
      {/* Top nav */}
      <div className="px-4 pt-2 pb-2 flex items-center justify-between">
        <span className="text-[14px]" style={{ color: '#4F46E5' }}>‹</span>
        <p className="text-[11px] font-semibold" style={{ color: t }}>JSON Formatter</p>
        <div className="flex gap-2">
          <span className="text-[12px]" style={{ color: '#F43F5E' }}>♥</span>
          <span className="text-[12px]" style={{ color: m }}>↗</span>
        </div>
      </div>
      {/* Hero */}
      <div className="mx-4 mb-2 rounded-2xl p-3 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px]"
          style={{ background: 'rgba(255,255,255,0.15)' }}>{'</>'}</div>
        <div>
          <p className="text-[12px] font-bold text-white">JSON Formatter</p>
          <p className="text-[9px] text-white/70">Format, validate & minify JSON</p>
          <div className="flex gap-1 mt-1">
            {['Offline', 'Worker', 'Free'].map((b, i) => (
              <span key={b} className="text-[7px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="px-4 mb-2 flex gap-0 rounded-xl overflow-hidden" style={{ background: card.bg, border: `1px solid ${card.border}` }}>
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => handleTabClick(i)}
            className="flex-1 py-1.5 text-[8px] font-semibold transition-colors"
            style={{ color: activeTab === i ? '#4F46E5' : m, background: activeTab === i ? (light ? '#EEF2FF' : 'rgba(79,70,229,0.12)') : 'transparent', borderRadius: 8 }}
            aria-pressed={activeTab === i}>
            {tab}
          </button>
        ))}
      </div>
      {/* Code Editor */}
      <div className="px-4 flex-1 overflow-hidden mb-2">
        <p className="text-[8px] font-semibold mb-1" style={{ color: m }}>Input JSON</p>
        <div className="rounded-xl overflow-hidden" style={{ background: codeBg, border: `1px solid ${card.border}`, height: 130 }}>
          <div className="flex h-full">
            {/* Line numbers */}
            <div className="px-2 pt-2 text-right" style={{ minWidth: 24, borderRight: `1px solid ${card.border}` }}>
              {JSON_CODE.split('\n').slice(0, 10).map((_, i) => (
                <p key={i} className="text-[7px] leading-[14px]" style={{ color: '#475569' }}>{i + 1}</p>
              ))}
            </div>
            {/* Code */}
            <pre className="flex-1 p-2 text-[7px] leading-[14px] overflow-hidden" style={{ fontFamily: 'monospace', color: light ? '#1E293B' : '#E2E8F0' }}>
              {'{'}
              {'\n'}
              {'  '}
              <span style={{ color: '#79C0FF' }}>&quot;name&quot;</span>
              {': '}
              <span style={{ color: '#FFA657' }}>&quot;KaruviLab&quot;</span>
              {',\n'}
              {'  '}
              <span style={{ color: '#79C0FF' }}>&quot;version&quot;</span>
              {': '}
              <span style={{ color: '#FFA657' }}>&quot;2.0.0&quot;</span>
              {',\n'}
              {'  '}
              <span style={{ color: '#79C0FF' }}>&quot;privacy&quot;</span>
              {': '}
              <span style={{ color: '#FF7B72' }}>true</span>
              {',\n'}
              {'  '}
              <span style={{ color: '#79C0FF' }}>&quot;tools&quot;</span>
              {': '}
              <span style={{ color: '#7EE787' }}>150</span>
              {',\n'}
              {'  '}
              <span style={{ color: '#79C0FF' }}>&quot;features&quot;</span>
              {': [\n'}
              {'    '}
              <span style={{ color: '#FFA657' }}>&quot;offline&quot;</span>
              {',\n'}
              {'    '}
              <span style={{ color: '#FFA657' }}>&quot;browser-native&quot;</span>
              {'\n'}
              {'  ]\n}'}
            </pre>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-1.5 mt-2">
          {[
            { label: 'Format', style: { background: '#4F46E5', color: '#fff', border: 'none' } },
            { label: 'Minify', style: { background: card.bg, color: m, border: `1px solid ${card.border}` } },
            { label: 'Validate', style: { background: card.bg, color: m, border: `1px solid ${card.border}` } },
            { label: 'Clear', style: { background: light ? '#FFF1F2' : 'rgba(244,63,94,0.12)', color: '#F43F5E', border: 'none' } },
          ].map(btn => (
            <button key={btn.label} className="flex-1 py-1.5 rounded-lg text-[8px] font-semibold" style={btn.style}
              aria-label={btn.label}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      <BottomNav active={2} light={light} />
    </div>
  );
}

function ScreenSearch({ light = false }: { light?: boolean }) {
  const t = light ? '#111827' : '#F8FAFC';
  const m = light ? '#64748B' : '#94A3B8';
  const card = light
    ? { bg: '#FFFFFF', border: 'rgba(0,0,0,0.07)', shadow: '0 2px 12px rgba(0,0,0,0.07)' }
    : { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.07)', shadow: 'none' };
  const searchBg = light ? '#F1F5F9' : 'rgba(255,255,255,0.08)';

  return (
    <div className="flex flex-col h-full px-4 pt-2" style={{ color: t }}>
      <p className="text-[14px] font-extrabold mb-3" style={{ color: t }}>Search</p>
      {/* Active search bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4"
        style={{ background: searchBg, border: `1.5px solid #4F46E5`, boxShadow: '0 0 0 3px rgba(79,70,229,0.12)' }}>
        <span className="text-[11px]" style={{ color: '#4F46E5' }}>⌕</span>
        <span className="text-[9px] font-medium" style={{ color: '#4F46E5' }}>JSON form|</span>
      </div>
      {/* Recent */}
      <p className="text-[8px] font-semibold uppercase tracking-wider mb-2" style={{ color: m }}>Recent Searches</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {RECENT_SEARCHES.map(r => (
          <span key={r} className="px-2 py-1 rounded-full text-[8px]"
            style={{ background: card.bg, border: `1px solid ${card.border}`, color: t, boxShadow: card.shadow }}>
            🕐 {r}
          </span>
        ))}
      </div>
      {/* Trending */}
      <p className="text-[8px] font-semibold uppercase tracking-wider mb-2" style={{ color: m }}>🔥 Trending</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {TRENDING.map(tr => (
          <span key={tr} className="px-2 py-1 rounded-full text-[8px]"
            style={{ background: light ? '#EEF2FF' : 'rgba(79,70,229,0.12)', color: '#4F46E5', border: `1px solid rgba(79,70,229,0.2)` }}>
            {tr}
          </span>
        ))}
      </div>
      {/* Popular tools */}
      <p className="text-[8px] font-semibold uppercase tracking-wider mb-2" style={{ color: m }}>Popular Tools</p>
      <div className="flex flex-col gap-1.5 mb-4">
        {TOOLS.slice(0, 3).map(tool => (
          <div key={tool.name} className="flex items-center gap-2 px-2 py-1.5 rounded-xl"
            style={{ background: card.bg, border: `1px solid ${card.border}`, boxShadow: card.shadow }}>
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${tool.grad} flex items-center justify-center text-[9px] text-white flex-shrink-0`}>{tool.icon}</div>
            <div>
              <p className="text-[9px] font-semibold" style={{ color: t }}>{tool.name}</p>
              <p className="text-[7px]" style={{ color: m }}>{tool.sub}</p>
            </div>
            <span className="ml-auto text-[7px] px-1.5 rounded-full text-white" style={{ background: tool.badgeColor }}>{tool.badge}</span>
          </div>
        ))}
      </div>
      {/* Keyboard shortcuts */}
      <p className="text-[8px] font-semibold uppercase tracking-wider mb-2" style={{ color: m }}>Keyboard Shortcuts</p>
      <div className="flex flex-wrap gap-1.5">
        {['⌘K Search', '⌘/ Help', 'Esc Close'].map(k => (
          <span key={k} className="px-2 py-1 rounded-lg text-[8px] font-mono"
            style={{ background: card.bg, border: `1px solid ${card.border}`, color: m, boxShadow: card.shadow }}>
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScreenSettings({ light = false }: { light?: boolean }) {
  const t = light ? '#111827' : '#F8FAFC';
  const m = light ? '#64748B' : '#94A3B8';
  const card = light
    ? { bg: '#FFFFFF', border: 'rgba(0,0,0,0.07)', shadow: '0 2px 12px rgba(0,0,0,0.07)' }
    : { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.07)', shadow: 'none' };
  const accentColors = ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'];

  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-16 overflow-y-auto scrollbar-none" style={{ color: t }}>
      <p className="text-[15px] font-extrabold mb-3" style={{ color: t }}>Settings</p>
      {/* Theme */}
      <div className="rounded-xl p-2.5 mb-2" style={{ background: card.bg, border: `1px solid ${card.border}`, boxShadow: card.shadow }}>
        <p className="text-[8px] font-semibold uppercase tracking-wider mb-2" style={{ color: m }}>Theme</p>
        <div className="flex gap-1.5">
          {['Dark', 'Light', 'System'].map((th, i) => (
            <button key={th} className="flex-1 py-1.5 rounded-lg text-[8px] font-semibold flex items-center justify-center gap-1"
              style={{
                background: (!light && i === 0) || (light && i === 1) ? '#4F46E5' : 'transparent',
                color: (!light && i === 0) || (light && i === 1) ? '#fff' : m,
                border: `1px solid ${((!light && i === 0) || (light && i === 1)) ? '#4F46E5' : card.border}`,
              }}
              aria-pressed={(!light && i === 0) || (light && i === 1)}>
              {(!light && i === 0) || (light && i === 1) ? '✓ ' : ''}{th}
            </button>
          ))}
        </div>
      </div>
      {/* Accent Color */}
      <div className="rounded-xl p-2.5 mb-2" style={{ background: card.bg, border: `1px solid ${card.border}`, boxShadow: card.shadow }}>
        <p className="text-[8px] font-semibold uppercase tracking-wider mb-2" style={{ color: m }}>Accent Color</p>
        <div className="flex gap-2">
          {accentColors.map(c => (
            <div key={c} className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: c, boxShadow: c === '#4F46E5' ? `0 0 0 2px ${light ? '#fff' : '#0A0F1E'}, 0 0 0 3px ${c}` : 'none' }}>
              {c === '#4F46E5' && <span className="text-[7px] text-white">✓</span>}
            </div>
          ))}
        </div>
      </div>
      {/* Settings rows */}
      {[
        { label: 'Language', value: 'English' },
        { label: 'Performance', value: 'High' },
        { label: 'Offline Storage', value: '2.4 GB' },
        { label: 'Privacy', value: '→' },
        { label: 'Accessibility', value: '', toggle: true, on: true },
        { label: 'Developer Mode', value: '', toggle: true, on: false },
        { label: 'Experimental', value: 'Beta', badge: true },
        { label: 'About', value: 'v2.0.0' },
      ].map(row => (
        <div key={row.label} className="flex items-center justify-between px-2.5 py-2 mb-1.5 rounded-xl"
          style={{ background: card.bg, border: `1px solid ${card.border}`, boxShadow: card.shadow }}>
          <span className="text-[9px] font-medium" style={{ color: t }}>{row.label}</span>
          {row.toggle ? (
            <div className="w-7 h-4 rounded-full flex items-center px-0.5" style={{ background: row.on ? '#4F46E5' : (light ? '#E2E8F0' : '#334155') }}>
              <div className="w-3 h-3 rounded-full bg-white shadow" style={{ marginLeft: row.on ? 'auto' : 0 }} />
            </div>
          ) : row.badge ? (
            <span className="px-1.5 py-0.5 rounded-full text-[7px] font-medium text-white" style={{ background: '#F59E0B' }}>{row.value}</span>
          ) : (
            <span className="text-[9px]" style={{ color: m }}>{row.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION: Design System Panel
// ─────────────────────────────────────────────

function DesignSystemPanel() {
  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-2xl shadow-[#4F46E5]/40"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)', fontFamily: 'var(--font-dm-serif)' }}>
            KV
          </div>
          <div>
            <p className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-dm-serif)' }}>KaruviLab</p>
            <p className="text-xs" style={{ color: '#94A3B8' }}>Privacy-First Browser-Native Toolkit</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {['150+ Tools', 'Offline First', '100% Private', 'No Uploads', 'No Login'].map(b => (
            <span key={b} className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
              style={{ background: 'rgba(79,70,229,0.18)', color: '#A5B4FC', border: '1px solid rgba(79,70,229,0.3)' }}>
              {b}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* Color Palette */}
      <GlassCard className="p-5">
        <SectionLabel label="Color Palette" />
        <div className="flex gap-2 mb-3">
          {COLOR_PALETTE.map(c => (
            <div key={c.name} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full rounded-xl h-14" style={{ background: c.hex, boxShadow: `0 8px 24px ${c.hex}50` }} />
              <span className="text-[9px] font-semibold" style={{ color: '#94A3B8' }}>{c.name}</span>
              <span className="text-[8px] font-mono" style={{ color: '#64748B' }}>{c.hex}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {NEUTRAL_SHADES.map(s => (
            <div key={s} className="flex-1 h-8 rounded-lg" style={{ background: s, border: s === '#F8FAFC' ? '1px solid rgba(255,255,255,0.1)' : 'none' }} />
          ))}
        </div>
        <p className="text-[9px] text-center mt-1" style={{ color: '#64748B' }}>Neutral Scale</p>
      </GlassCard>

      {/* Typography */}
      <GlassCard className="p-5">
        <SectionLabel label="Typography" />
        <div className="mb-4">
          <p style={{ fontFamily: 'var(--font-poppins)', fontSize: 28, fontWeight: 700, color: '#F8FAFC', lineHeight: 1.1 }}>Poppins</p>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 20, color: 'rgba(248,250,252,0.7)', lineHeight: 1.2 }}>Inter</p>
        </div>
        <div className="flex flex-col gap-2">
          {TYPE_SCALE.map(ts => (
            <div key={ts.label} className="flex items-baseline gap-3">
              <span className="text-[9px] font-semibold w-10 flex-shrink-0" style={{ color: '#4F46E5' }}>{ts.label}</span>
              <span className="text-[8px] w-8 flex-shrink-0" style={{ color: '#475569' }}>{ts.size}</span>
              <span style={{ fontSize: ts.label === 'H1' ? 18 : ts.label === 'H2' ? 15 : ts.label === 'H3' ? 13 : ts.label === 'Title' ? 12 : ts.label === 'Body' ? 11 : 9, fontWeight: parseInt(ts.weight), color: '#CBD5E1', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {ts.sample}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Spacing */}
      <GlassCard className="p-5">
        <SectionLabel label="Spacing Scale" />
        <div className="flex items-end gap-2">
          {SPACING.map(s => (
            <div key={s} className="flex flex-col items-center gap-1">
              <div className="rounded" style={{ width: s > 32 ? 32 : s, height: s > 32 ? 32 : s, background: `rgba(79,70,229,${0.3 + s / 160})`, minWidth: 4 }} />
              <span className="text-[8px]" style={{ color: '#475569' }}>{s}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Radius */}
      <GlassCard className="p-5">
        <SectionLabel label="Border Radius" />
        <div className="flex gap-3 items-center">
          {RADII.map(r => (
            <div key={r.val} className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 bg-white/10 border border-white/15" style={{ borderRadius: r.val }} />
              <span className="text-[9px]" style={{ color: '#475569' }}>{r.val}px</span>
              <span className="text-[8px] font-semibold" style={{ color: '#4F46E5' }}>{r.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Buttons */}
      <GlassCard className="p-5">
        <SectionLabel label="Buttons" />
        <div className="flex flex-col gap-2.5">
          <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-transform active:scale-98"
            style={{ background: '#4F46E5', boxShadow: '0 8px 24px rgba(79,70,229,0.4)' }}
            aria-label="Primary action button">
            Primary Action
          </button>
          <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-transform active:scale-98"
            style={{ background: 'transparent', border: '1.5px solid #4F46E5', color: '#A5B4FC' }}
            aria-label="Secondary action button">
            Secondary Action
          </button>
          <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-transform active:scale-98"
            style={{ background: 'transparent', color: '#94A3B8' }}
            aria-label="Ghost action button">
            Ghost Button
          </button>
          <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-transform active:scale-98"
            style={{ background: '#F43F5E', boxShadow: '0 8px 24px rgba(244,63,94,0.35)' }}
            aria-label="Danger action button">
            Danger Action
          </button>
        </div>
      </GlassCard>

      {/* Inputs */}
      <GlassCard className="p-5">
        <SectionLabel label="Input Components" />
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-sm" style={{ color: '#4F46E5' }}>⌕</span>
            <span className="text-sm" style={{ color: '#475569' }}>Search 150+ tools…</span>
          </div>
          {/* Dropdown */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-sm" style={{ color: '#94A3B8' }}>Select Category</span>
            <span style={{ color: '#4F46E5' }}>▾</span>
          </div>
          {/* Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: '#94A3B8' }}>Toggle Switch</span>
            <div className="flex gap-2">
              <div className="w-10 h-5.5 rounded-full flex items-center px-0.5" style={{ background: '#4F46E5', width: 40, height: 22 }}>
                <div className="w-4 h-4 rounded-full bg-white shadow ml-auto" />
              </div>
              <div className="w-10 h-5.5 rounded-full flex items-center px-0.5" style={{ background: '#334155', width: 40, height: 22 }}>
                <div className="w-4 h-4 rounded-full bg-white/60 shadow" />
              </div>
            </div>
          </div>
          {/* Checkbox */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded flex items-center justify-center text-white text-[10px]" style={{ background: '#4F46E5', flexShrink: 0 }}>✓</div>
            <span className="text-sm" style={{ color: '#94A3B8' }}>Checked state</span>
            <div className="w-4 h-4 rounded border" style={{ border: '1.5px solid #334155', flexShrink: 0 }} />
            <span className="text-sm" style={{ color: '#94A3B8' }}>Unchecked</span>
          </div>
          {/* Slider */}
          <div>
            <div className="h-1.5 rounded-full relative" style={{ background: '#1E293B' }}>
              <div className="h-full rounded-full absolute left-0" style={{ width: '65%', background: '#4F46E5' }} />
              <div className="w-4 h-4 rounded-full bg-white shadow-lg absolute -top-1.5" style={{ left: 'calc(65% - 8px)', boxShadow: '0 2px 8px rgba(79,70,229,0.5)' }} />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Badges */}
      <GlassCard className="p-5">
        <SectionLabel label="Badges" />
        <div className="flex flex-wrap gap-2">
          {BADGES.map(b => (
            <span key={b.label} className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: b.color, color: b.text }}>
              {b.label}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* Icons */}
      <GlassCard className="p-5">
        <SectionLabel label="Icons · Lucide" />
        <div className="grid grid-cols-6 gap-2">
          {['⌕', '⌂', '⚙', '</>', '📄', '🔒', '🖼️', '▶', '✕', '↗', '📋', '🔑'].map((icon, i) => (
            <div key={i} className="w-9 h-9 rounded-xl flex items-center justify-center text-[14px]"
              style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.2)' }}>
              {icon}
            </div>
          ))}
        </div>
        <p className="text-[10px] mt-2" style={{ color: '#64748B' }}>Lucide React — consistent icon library</p>
      </GlassCard>

      {/* Accessibility */}
      <GlassCard className="p-5">
        <SectionLabel label="Accessibility & Responsive" />
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: '#10B981' }}>WCAG AA</span>
          <span className="text-sm" style={{ color: '#94A3B8' }}>WCAG 2.2 AA Compliant</span>
        </div>
        <p className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>Responsive Breakpoints</p>
        <div className="flex items-end gap-2">
          {BREAKPOINTS.map((bp, i) => (
            <div key={bp} className="flex flex-col items-center gap-1">
              <div className="rounded-sm" style={{ width: 6 + i * 4, height: 20 + i * 3, background: `rgba(79,70,229,${0.3 + i * 0.12})` }} />
              <span className="text-[7px]" style={{ color: '#475569' }}>{bp}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION: Main Case Study Board
// ─────────────────────────────────────────────

const DARK_SCREENS: { label: string; Screen: React.ComponentType<{ light?: boolean }> }[] = [
  { label: 'Home', Screen: ScreenHome },
  { label: 'All Tools', Screen: ScreenTools },
  { label: 'Categories', Screen: ScreenCategories },
  { label: 'Tool Detail', Screen: ScreenToolDetail },
  { label: 'Search', Screen: ScreenSearch },
  { label: 'Settings', Screen: ScreenSettings },
];

export default function CaseStudyClient() {
  const [activeSection, setActiveSection] = useState<'overview' | 'dark' | 'light' | 'system'>('overview');

  const handleSectionChange = useCallback((s: 'overview' | 'dark' | 'light' | 'system') => {
    setActiveSection(s);
  }, []);

  const navTabs: { key: 'overview' | 'dark' | 'light' | 'system'; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'dark', label: 'Dark Mode' },
    { key: 'light', label: 'Light Mode' },
    { key: 'system', label: 'Design System' },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: '#0A0F1E', fontFamily: 'var(--font-inter)' }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-modal border-b"
        style={{
          background: 'rgba(10,15,30,0.85)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)', fontFamily: 'var(--font-dm-serif)' }}>
              KV
            </div>
            <div>
              <p className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif)' }}>KaruviLab</p>
              <p className="text-[10px]" style={{ color: '#64748B' }}>UI/UX Case Study</p>
            </div>
          </div>
          {/* Nav tabs */}
          <nav className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} aria-label="Case study sections">
            {navTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleSectionChange(tab.key)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: activeSection === tab.key ? '#4F46E5' : 'transparent',
                  color: activeSection === tab.key ? '#fff' : '#94A3B8',
                }}
                aria-current={activeSection === tab.key ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {['✓ No Uploads', '✓ Offline', '✓ Private'].map(b => (
              <span key={b} className="px-2.5 py-1 rounded-full text-[10px] font-semibold hidden lg:inline-flex"
                style={{ background: 'rgba(16,185,129,0.12)', color: '#34D399', border: '1px solid rgba(16,185,129,0.2)' }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4F46E5, transparent)' }} />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />

        <div className="max-w-screen-2xl mx-auto px-6 py-16 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-xs font-semibold"
            style={{ background: 'rgba(79,70,229,0.15)', color: '#A5B4FC', border: '1px solid rgba(79,70,229,0.3)' }}>
            ✦ Behance Case Study · 2026
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-poppins)' }}>
            KaruviLab
          </h1>
          <p className="text-lg lg:text-xl mb-3" style={{ color: '#94A3B8' }}>
            Privacy-First Browser-Native Productivity Toolkit
          </p>
          <p className="text-sm mb-8 max-w-2xl mx-auto" style={{ color: '#64748B' }}>
            A complete UI/UX case study — from design system to pixel-perfect screens,
            covering 6 core app flows in both dark and light themes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: '150+ Tools', icon: '⚙' },
              { label: 'Offline First', icon: '📡' },
              { label: '100% Private', icon: '🔒' },
              { label: 'No Uploads', icon: '✓' },
              { label: 'No Login', icon: '🔑' },
              { label: 'WCAG AA', icon: '♿' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#CBD5E1' }}>
                <span>{stat.icon}</span> {stat.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-screen-2xl mx-auto px-6 py-12">

        {/* OVERVIEW: all screens at once */}
        {(activeSection === 'overview' || activeSection === 'dark') && (
          <section aria-label="Dark mode screens">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #4F46E5, #7C3AED)' }} />
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Dark Mode</h2>
              </div>
              <p className="text-sm pl-5" style={{ color: '#64748B' }}>
                Deep navy base · Glassmorphism surfaces · Indigo accent system
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
              {DARK_SCREENS.map(({ label, Screen }) => (
                <PhoneFrame key={label} label={label}>
                  <Screen light={false} />
                </PhoneFrame>
              ))}
            </div>
          </section>
        )}

        {/* LIGHT MODE */}
        {(activeSection === 'overview' || activeSection === 'light') && (
          <section aria-label="Light mode screens">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #E2E8F0, #94A3B8)' }} />
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Light Mode</h2>
              </div>
              <p className="text-sm pl-5" style={{ color: '#64748B' }}>
                Pure white surfaces · Soft shadows · Minimal borders · Blue-slate accents
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
              {DARK_SCREENS.map(({ label, Screen }) => (
                <PhoneFrame key={label} label={label} light>
                  <Screen light />
                </PhoneFrame>
              ))}
            </div>
          </section>
        )}

        {/* DESIGN SYSTEM */}
        {(activeSection === 'overview' || activeSection === 'system') && (
          <section aria-label="Design system panel">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #F59E0B, #F43F5E)' }} />
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Design System</h2>
              </div>
              <p className="text-sm pl-5" style={{ color: '#64748B' }}>
                Tokens · Components · Typography · Spacing · Motion
              </p>
            </div>
            <div className="max-w-2xl">
              <DesignSystemPanel />
            </div>
          </section>
        )}

        {/* SIDE-BY-SIDE COMPARISON (overview only) */}
        {activeSection === 'overview' && (
          <section aria-label="Dark vs Light comparison" className="mt-4 mb-16">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #06B6D4, #3B82F6)' }} />
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Dark / Light Comparison</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
              {DARK_SCREENS.slice(0, 3).map(({ label, Screen }) => (
                <div key={label} className="flex flex-col gap-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-center" style={{ color: '#64748B' }}>{label}</p>
                  <div className="flex gap-4 justify-center">
                    <PhoneFrame label="Dark" light={false}>
                      <Screen light={false} />
                    </PhoneFrame>
                    <PhoneFrame label="Light" light>
                      <Screen light />
                    </PhoneFrame>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(10,15,30,0.6)' }}>
        <div className="max-w-screen-2xl mx-auto px-6 py-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)', fontFamily: 'var(--font-dm-serif)' }}>KV</div>
            <p className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif)' }}>KaruviLab</p>
          </div>
          <p className="text-sm mb-5" style={{ color: '#64748B' }}>
            Built for Privacy. Designed for Speed. Made for Everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {['✓ No Server Uploads', '✓ 100% Browser Processing', '✓ Works Offline', '✓ No Account Required', '✓ Zero Tracking'].map(b => (
              <span key={b} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(16,185,129,0.08)', color: '#34D399', border: '1px solid rgba(16,185,129,0.15)' }}>
                {b}
              </span>
            ))}
          </div>
          <p className="text-[11px]" style={{ color: '#334155' }}>
            Designed with precision · WCAG AA Accessible · 150+ Tools · Open Source
          </p>
        </div>
      </footer>
    </div>
  );
}
