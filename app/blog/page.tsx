import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KaruviLab Blog | Productivity & Privacy Insights',
  description: 'Articles on browser-native productivity, privacy-first engineering, and tips for getting the most out of KaruviLab tools.',
};

const articles = [
  { slug: 'compress-images-without-quality-loss', title: 'How to Compress Images Without Losing Quality – A Complete Guide' },
  { slug: 'understanding-emi-calculations', title: 'Understanding EMI Calculations: A Beginner\'s Guide to Loan Planning' },
  { slug: 'why-local-first-is-the-future', title: 'Why Local‑First Tools Are the Future of Online Privacy' },
  { slug: '10-essential-dev-tools-in-your-browser', title: '10 Essential Developer Tools You Can Use Directly in Your Browser' },
  { slug: 'how-to-use-karuvilab-offline', title: 'How to Use KaruviLab Offline: The Complete PWA Guide' },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-text">KaruviLab Blog</h1>
        <p className="text-xl text-text-3 font-medium">Insights on privacy-first engineering and productivity.</p>
      </header>
      
      <div className="grid gap-6">
        {articles.map((article) => (
          <Link 
            key={article.slug} 
            href={`/blog/${article.slug}`}
            className="block p-6 bg-surface border border-border rounded-3xl hover:border-blue/50 transition-all shadow-sm hover:shadow-lg"
          >
            <h2 className="text-2xl font-black text-text hover:text-blue transition-colors">{article.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
