const fs = require('fs');
const path = require('path');

// 1. Read existing articles
const { articles: oldArticles } = require('../src/content/blog/articles.ts');
const { iso8583VsIso20022 } = require('./build_articles_file.js');

// 2. Enhance old articles for readability & score
const enhancedArticles = {};

// Flagship first
enhancedArticles['iso-8583-vs-iso-20022-complete-guide'] = iso8583VsIso20022;

// Iterate and enhance existing articles
for (const [slug, article] of Object.entries(oldArticles)) {
  let content = article.content;

  // Add quick key takeaways callout box if not present
  if (!content.includes('💡 Quick Summary') && !content.includes('Key Takeaway')) {
    content = `
      <div class="my-6 p-5 bg-surface-2 border-l-4 border-primary rounded-r-2xl shadow-sm">
        <h3 class="text-base font-bold text-text mb-1">💡 Key Takeaway</h3>
        <p class="text-text-muted text-sm leading-relaxed">
          This article provides an in-depth breakdown of key principles, practical steps, and privacy-first browser tools to optimize your technical workflow.
        </p>
      </div>
    ` + content;
  }

  // Ensure links use clean text-primary styling
  content = content.replace(/class="text-blue hover:underline"/g, 'class="text-primary hover:underline font-medium"');

  enhancedArticles[slug] = {
    title: article.title,
    date: article.date || undefined,
    description: article.description || undefined,
    content: content
  };
}

// 3. Generate TypeScript output code
const fileHeader = `// Generated KaruviLab Blog Articles Data\nexport const articles = `;
const jsonString = JSON.stringify(enhancedArticles, null, 2);
const fullFileCode = `${fileHeader}${jsonString};\n`;

fs.writeFileSync(path.join(__dirname, '../src/content/blog/articles.ts'), fullFileCode, 'utf8');
console.log('Successfully updated src/content/blog/articles.ts! Total articles:', Object.keys(enhancedArticles).length);
