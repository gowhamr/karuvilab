import { articles } from "@/src/content/blog/articles";
import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>;

interface BlogArticleProps {
  params: Params;
}

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({
    slug,
  }));
}

import { StructuredData } from "@/src/lib/seo";

export default async function BlogArticlePage({ params }: BlogArticleProps) {
  const { slug } = await params;
  const article = (articles as any)[slug];

  if (!article) {
    notFound();
  }

  return (
    <>
      <StructuredData 
        isHead 
        content={{ 
          detailedDescription: article.content 
        }} 
        // We will need to update StructuredData to support BlogPosting schema 
      />
      <article className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black tracking-tight text-text mb-8">{article.title}</h1>
        <div 
          className="prose prose-invert prose-blue max-w-none text-text-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </>
  );
}
