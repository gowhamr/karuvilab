"use client";

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

import CoreBankingParserClient from './components/CoreBankingParserClient';
import EmvTlvTreeClient from './components/EmvTlvTreeClient';
import SwiftMtMxClient from './components/SwiftMtMxClient';
import Track2ParserClient from './components/Track2ParserClient';

const tabs = [
  { id: 'core-banking-parser', label: 'Core Banking Parser' },
  { id: 'emv-tlv-tree', label: 'EMV TLV Tree' },
  { id: 'swift-mt-mx', label: 'SWIFT MT/MX' },
  { id: 'track-2-parser', label: 'Track 2 Parser' },
];

export default function BankingToolsClient() {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'core-banking-parser');

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
                layoutId="bankingTabsBg"
                className="absolute inset-0 bg-blue rounded-xl z-base"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-content">{tab.label}</span>
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
          {activeTab === 'core-banking-parser' && <CoreBankingParserClient />}
          {activeTab === 'emv-tlv-tree' && <EmvTlvTreeClient />}
          {activeTab === 'swift-mt-mx' && <SwiftMtMxClient />}
          {activeTab === 'track-2-parser' && <Track2ParserClient />}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
