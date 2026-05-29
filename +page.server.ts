import type { PageServerLoad } from './$types';

interface PostMetadata {
	slug: string;
	title: string;
	description: string;
	date: string;
}

export const load: PageServerLoad = async () => {
	// Import all markdown files as raw text
	const modules = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default' });
	const posts: PostMetadata[] = [];

	for (const path in modules) {
		const raw = await modules[path]() as string;
		// Simple Regex to extract the YAML frontmatter
		const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
		
		if (match) {
			const frontmatter = match[1];
			const title = frontmatter.match(/title:\s*(.*)/)?.[1].trim() || 'Untitled';
			const date = frontmatter.match(/date:\s*(.*)/)?.[1].trim() || new Date().toISOString().split('T')[0];
			const description = frontmatter.match(/description:\s*(.*)/)?.[1].trim() || '';
			const slug = path.split('/').pop()?.replace('.md', '') || '';
			
			posts.push({ slug, title, date, description });
		}
	}

	// Sort posts by date (newest first)
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
};
