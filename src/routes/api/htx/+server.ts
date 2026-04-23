import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('target');
	
	if (!targetUrl) {
		return json({ code: 400, message: 'Missing target URL', data: [] });
	}

	try {
		// Fetch directly from Vercel server using clean headers to bypass Cloudflare
		const res = await fetch(targetUrl, {
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
				'Accept': 'application/json',
				'Accept-Language': 'en-US,en;q=0.9',
			}
		});
		
		if (res.ok) {
			const data = await res.json();
			return json(data);
		}
		
		return json({ code: res.status, data: [] });
	} catch (error) {
		return json({ code: 500, message: 'Proxy fetch failed', data: [] });
	}
};
