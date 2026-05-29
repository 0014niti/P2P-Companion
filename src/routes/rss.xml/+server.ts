import type { RequestHandler } from './$types';
import { marked } from 'marked';

export const GET: RequestHandler = async () => {
	const siteUrl = 'https://p2pcompanion.com';
	const feedTitle = 'P2P Terminal Blog';
	const feedDescription = 'Daily insights, strategies, and market analysis for peer-to-peer cryptocurrency traders.';

	const modules = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default' });
	const posts = [];

	for (const path in modules) {
		const raw = await modules[path]() as string;
		const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
		
		if (match) {
			const frontmatter = match[1];
			const markdownContent = match[2];
			
			const title = frontmatter.match(/title:\s*(.*)/)?.[1].trim() || 'Untitled';
			const date = frontmatter.match(/date:\s*(.*)/)?.[1].trim() || new Date().toISOString().split('T')[0];
			const slug = path.split('/').pop()?.replace('.md', '') || '';
			
			// Parse markdown to pure HTML for the RSS readers
			const htmlContent = await marked.parse(markdownContent);
			
			posts.push({ slug, title, date, htmlContent });
		}
	}

	// Sort posts newest to oldest
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
	xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
	xml += `<channel>\n`;
	xml += `<title>${feedTitle}</title>\n`;
	xml += `<description>${feedDescription}</description>\n`;
	xml += `<link>${siteUrl}/blog</link>\n`;
	xml += `<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />\n`;

	for (const post of posts) {
		xml += `  <item>\n`;
		xml += `    <title><![CDATA[${post.title}]]></title>\n`;
		xml += `    <link>${siteUrl}/blog/${post.slug}</link>\n`;
		xml += `    <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>\n`;
		xml += `    <pubDate>${new Date(post.date).toUTCString()}</pubDate>\n`;
		xml += `    <description><![CDATA[${post.htmlContent}]]></description>\n`;
		xml += `  </item>\n`;
	}

	xml += `</channel>\n`;
	xml += `</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};