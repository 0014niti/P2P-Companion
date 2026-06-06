import type { PageServerLoad } from './$types';

interface PostMetadata {
	slug: string;
	title: string;
	description: string;
	date: string;
	author: string;
	tags: string[];
	readingTime: string;
}

export const load: PageServerLoad = async () => {
	// Import all markdown files as raw text
	const modules = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default' });
	const posts: PostMetadata[] = [];

	for (const path in modules) {
		const raw = await modules[path]() as string;
		// Regex to extract the YAML frontmatter
		const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
		
		if (match) {
			const frontmatter = match[1];
			const markdownContent = match[2];
			const title = frontmatter.match(/title:\s*(.*)/)?.[1].trim() || 'Untitled';
			const date = frontmatter.match(/date:\s*(.*)/)?.[1].trim() || new Date().toISOString().split('T')[0];
			const description = frontmatter.match(/description:\s*(.*)/)?.[1].trim() || '';
			const author = frontmatter.match(/author:\s*(.*)/)?.[1].trim() || 'P2P Companion';
			const tagsString = frontmatter.match(/tags:\s*\[(.*?)\]/)?.[1] || frontmatter.match(/tags:\s*(.*)/)?.[1] || '';
			const tags = tagsString.split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean);
			const slug = path.split('/').pop()?.replace(/\.md.*$/i, '') || '';
			
			const wordCount = markdownContent.split(/\s+/).length;
			const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
			
			posts.push({ slug, title, date, description, author, tags, readingTime });
		}
	}

	// Sort posts by date (newest first)
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	return { posts };
};