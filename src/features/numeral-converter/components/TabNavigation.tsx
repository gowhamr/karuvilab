import React from 'react';
import { ArrowLeftRight, Hash, TextCursorInput, ShieldCheck } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs = [
    { id: 'smart', label: 'Smart Converter', icon: ArrowLeftRight },
    { id: 'number', label: 'Single Number', icon: Hash },
    { id: 'encode', label: 'Encode ⇄ Decode', icon: ArrowLeftRight },
    { id: 'text', label: 'Text / Bytes', icon: TextCursorInput },
    { id: 'jwt', label: 'JWT Decoder', icon: ShieldCheck }
  ];

  return (
    <div className="flex overflow-x-auto p-1 bg-bg border border-border rounded-2xl w-full scrollbar-none">
      {tabs.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            aria-label={t.label}
            className={'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all ' + (activeTab === t.id ? 'bg-blue text-white shadow-md shadow-blue/10' : 'text-text-3 hover:text-text hover:bg-bg/50')}
          >
            <Icon size={16} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
};
