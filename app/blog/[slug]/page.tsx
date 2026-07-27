import { articles } from "@/src/content/blog/articles";
import { notFound } from "next/navigation";
import { StructuredData } from "@/src/lib/seo";
import { sanitizeHtml } from "@/src/lib/security";
import { getArticleMetadata } from "@/src/content/blog/utils";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Params = Promise<{ slug: string }>;

interface BlogArticleProps {
  params: Params;
}

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogArticleProps) {
  const { slug } = await params;
  const article = (articles as any)[slug];

  if (!article) return {};

  const meta = getArticleMetadata(slug, article);

  return {
    title: `${meta.title} | KaruviLab Blog`,
    description: meta.description,
    alternates: {
      canonical: `https://karuvilab.com/blog/${slug}/`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'article',
      publishedTime: meta.isoDate,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticleProps) {
  const { slug } = await params;
  const article = (articles as any)[slug];

  if (!article) {
    notFound();
  }

  const meta = getArticleMetadata(slug, article);

  return (
    <>
      <StructuredData 
        isHead 
        content={{ 
          detailedDescription: meta.description
        }} 
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": meta.title,
            "description": meta.description,
            "datePublished": meta.isoDate,
            "author": {
              "@type": "Organization",
              "name": "KaruviLab"
            },
            "publisher": {
              "@type": "Organization",
              "name": "KaruviLab",
              "logo": {
                "@type": "ImageObject",
                "url": "https://karuvilab.com/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://karuvilab.com/blog/${slug}/`
            }
          })
        }}
      />
      <article className="max-w-3xl mx-auto px-6 py-12 lg:py-20">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-medium text-text-muted hover:text-kv-primary transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-text-muted mb-6 font-medium">
            <time dateTime={meta.isoDate}>{meta.date}</time>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span>{meta.readingTime} min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text leading-tight">
            {meta.title}
          </h1>
        </header>

        <div 
          className="prose prose-invert prose-lg prose-blue max-w-none text-text-2 leading-relaxed prose-headings:text-text prose-a:text-kv-primary hover:prose-a:text-blue-400 prose-strong:text-text prose-code:text-kv-primary prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
        />
        
        <hr className="my-16 border-border" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-8 bg-surface-2 rounded-3xl border border-border">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-text">Enjoyed this article?</h3>
            <p className="text-text-muted text-sm mt-1">Explore our suite of privacy-first, offline-capable engineering tools.</p>
          </div>
          <Link href="/" className="px-6 py-3 bg-kv-primary text-white rounded-full font-medium hover:bg-kv-primary/90 transition-colors shadow-md">
            Explore Tools
          </Link>
        </div>
      </article>
    </>
  );
}
