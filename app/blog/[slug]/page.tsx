import { articles } from "@/src/content/blog/articles";
import { notFound } from "next/navigation";

interface BlogArticleProps {
  params: { slug: string };
}

export default function BlogArticlePage({ params }: BlogArticleProps) {
  const article = (articles as any)[params.slug];

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black tracking-tight text-text mb-8">{article.title}</h1>
      <div 
        className="prose prose-invert prose-blue max-w-none text-text-2 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
