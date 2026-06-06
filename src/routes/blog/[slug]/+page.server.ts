import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
	try {
		// Import all markdown files as raw text
		const modules = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default' });
		let matchPath = '';
		
		// Clean the slug just in case it contains .md or is capitalized
		const cleanSlug = params.slug.replace(/\.md.*$/i, '').toLowerCase();

		// Find the markdown file that matches the requested slug
		for (const path in modules) {
			if (path.toLowerCase().includes(`/${cleanSlug}.md`)) {
				matchPath = path;
				break;
			}
		}

		if (!matchPath) {
			throw error(404, 'Post not found');
		}

		const raw = await modules[matchPath]() as string;
		// Handle both Windows (\r\n) and Unix (\n) line endings
		const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
		
		if (!match) throw error(500, 'Invalid markdown format');

		const frontmatter = match[1];
		const markdownContent = match[2];
		
		const title = frontmatter.match(/title:\s*(.*)/)?.[1].trim() || 'Untitled';
		const date = frontmatter.match(/date:\s*(.*)/)?.[1].trim() || new Date().toISOString().split('T')[0];
		const description = frontmatter.match(/description:\s*(.*)/)?.[1].trim() || '';
		const author = frontmatter.match(/author:\s*(.*)/)?.[1].trim() || 'P2P Companion';
		const tagsString = frontmatter.match(/tags:\s*\[(.*?)\]/)?.[1] || frontmatter.match(/tags:\s*(.*)/)?.[1] || '';
		const tags = tagsString.split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean);
		
		const wordCount = markdownContent.split(/\s+/).length;
		const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

		// Parse markdown to HTML using the 'marked' package
		const htmlContent = await marked.parse(markdownContent);

		return {
			title, date, description, author, tags, readingTime, htmlContent, slug: cleanSlug
		};
	} catch (e) {
		console.error('Error loading blog post:', e);
		throw error(404, 'Post not found');
	}
};