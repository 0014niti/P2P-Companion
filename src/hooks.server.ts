import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	
	// Apply Edge Caching to all successful backend API routes
	if (event.url.pathname.startsWith('/api/') && response.ok) {
		response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=59');
	}

	return response;
};