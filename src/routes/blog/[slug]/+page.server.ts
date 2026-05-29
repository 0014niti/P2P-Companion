import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	// Import all markdown files as raw text
	const modules = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default' });
	
	const targetPath = `/src/posts/${params.slug}.md`;
	
	if (!modules[targetPath]) {
		throw error(404, 'Post not found');
	}

	const raw = await modules[targetPath]() as string;
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	
	if (!match) {
		throw error(500, 'Invalid post format');
	}

	const frontmatter = match[1];
	const markdownContent = match[2];
	
	const title = frontmatter.match(/title:\s*(.*)/)?.[1].trim() || 'Untitled';
	const date = frontmatter.match(/date:\s*(.*)/)?.[1].trim() || new Date().toISOString().split('T')[0];
	const description = frontmatter.match(/description:\s*(.*)/)?.[1].trim() || '';

	// Parse markdown to HTML
	const html = await marked.parse(markdownContent);

	// Cache heavily since it's a static blog post
	setHeaders({ 'Cache-Control': 'max-age=3600, s-maxage=86400' });

	return {
		post: { title, date, description, html }
	};
};