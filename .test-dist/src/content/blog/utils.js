export function getArticleMetadata(slug, article) {
    const textContent = article.content.replace(/<[^>]*>?/gm, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    const match = article.content.match(/<p>(.*?)<\/p>/);
    const description = article.description || (match ? match[1].replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : article.title);
    const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const date = article.date ? new Date(article.date) : new Date(2026, 0, 1 + (hash % 180));
    return {
        slug,
        title: article.title,
        description,
        readingTime,
        date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        isoDate: date.toISOString(),
        timestamp: date.getTime(),
    };
}
