import { Metadata } from 'next';
import Link from 'next/link';
import { articles } from "@/src/content/blog/articles";
import { getArticleMetadata } from "@/src/content/blog/utils";

export const metadata: Metadata = {
  title: 'KaruviLab Blog | Productivity & Privacy Insights',
  description: 'Articles on browser-native productivity, privacy-first engineering, and tips for getting the most out of KaruviLab tools.',
  alternates: {
    canonical: 'https://karuvilab.com/blog/',
  }
};

export default function BlogPage() {
  const articleList = Object.entries(articles)
    .map(([slug, article]) => getArticleMetadata(slug, article))
    .sort((a, b) => b.timestamp - a.timestamp); // Sort newest first

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
      {/* JSON-LD for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "KaruviLab Blog",
            "description": "Insights on privacy-first engineering and productivity.",
            "url": "https://karuvilab.com/blog/",
            "blogPost": articleList.map(a => ({
              "@type": "BlogPosting",
              "headline": a.title,
              "datePublished": a.isoDate,
              "url": `https://karuvilab.com/blog/${a.slug}/`
            }))
          })
        }}
      />
      
      <header className="space-y-6 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text">KaruviLab Blog</h1>
        <p className="text-xl text-text-3 font-medium">Deep dives into browser-native technology, privacy-first engineering, and practical productivity.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articleList.map((article) => (
          <Link 
            key={article.slug} 
            href={`/blog/${article.slug}/`}
            className="group flex flex-col p-6 bg-surface-2 border border-border rounded-3xl hover:border-primary/50 hover:bg-surface transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
              <time dateTime={article.isoDate}>{article.date}</time>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <span>{article.readingTime} min read</span>
            </div>
            <h2 className="text-xl font-bold text-text group-hover:text-primary transition-colors mb-3 line-clamp-3">
              {article.title}
            </h2>
            <p className="text-text-muted line-clamp-3 text-sm leading-relaxed mt-auto">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
