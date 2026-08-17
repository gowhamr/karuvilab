// src/seo/robots.ts
const BASE_URL = "https://karuvilab.com";
/**
 * Generates the robots.txt rules programmatically.
 */
export function generateRobotsRules() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/_next/",
                    "/static/",
                    "/downloads/",
                    "/offline/",
                ],
            },
            {
                userAgent: "GPTBot",
                disallow: "/", // Protect local tools IP and content from AI scrapers if desired
            }
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
/**
 * Converts robots rules to plain text representation.
 */
export function generateRobotsText() {
    const { rules, sitemap } = generateRobotsRules();
    let text = "";
    const rulesList = Array.isArray(rules) ? rules : [rules];
    rulesList.forEach((rule) => {
        const agents = Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent || "*"];
        agents.forEach((agent) => {
            text += `User-agent: ${agent}\n`;
        });
        const allows = Array.isArray(rule.allow) ? rule.allow : [rule.allow].filter(Boolean);
        allows.forEach((allow) => {
            text += `Allow: ${allow}\n`;
        });
        const disallows = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow].filter(Boolean);
        disallows.forEach((disallow) => {
            text += `Disallow: ${disallow}\n`;
        });
        if (rule.crawlDelay) {
            text += `Crawl-delay: ${rule.crawlDelay}\n`;
        }
        text += "\n";
    });
    text += `Sitemap: ${sitemap}\n`;
    return text;
}
