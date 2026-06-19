"use client";

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

import ImageSeoClient from './components/ImageSeoClient';
import MetaTagsGeneratorClient from './components/MetaTagsGeneratorClient';
import OgPreviewClient from './components/OgPreviewClient';
import RobotsTxtBuilderClient from './components/RobotsTxtBuilderClient';
import SeoTitleTesterClient from './components/SeoTitleTesterClient';
import SitemapGeneratorClient from './components/SitemapGeneratorClient';
import SlugGeneratorClient from './components/SlugGeneratorClient';

const tabs = [
  { id: 'meta-tags', label: 'Meta Tags' },
  { id: 'robots', label: 'Robots.txt' },
  { id: 'sitemap', label: 'Sitemap' },
  { id: 'image-seo', label: 'Image SEO' },
  { id: 'slug', label: 'Slug Generator' },
  { id: 'og-preview', label: 'OG Preview' },
  { id: 'seo-title', label: 'SERP Tester' },
];

export default function SeoToolsClient() {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'meta-tags');

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-text-3 hover:bg-surface-hover hover:text-text'
            }`}
          >
            {activeTab === tab.id && (
              <m.div
                layoutId="seoTabsBg"
                className="absolute inset-0 bg-blue rounded-xl z-0"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Render Active Tool */}
      <AnimatePresence mode="wait">
        <m.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'meta-tags' && <MetaTagsGeneratorClient />}
          {activeTab === 'robots' && <RobotsTxtBuilderClient />}
          {activeTab === 'sitemap' && <SitemapGeneratorClient />}
          {activeTab === 'image-seo' && <ImageSeoClient />}
          {activeTab === 'slug' && <SlugGeneratorClient />}
          {activeTab === 'og-preview' && <OgPreviewClient />}
          {activeTab === 'seo-title' && <SeoTitleTesterClient />}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
