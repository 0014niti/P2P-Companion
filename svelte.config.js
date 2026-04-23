import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		// ADD THIS BLOCK BELOW
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// ignore favicon.png 404s specifically
				if (path === '/favicon.png') return;

				// otherwise, throw the error
				throw new Error(message);
			}
		}
	}
};

export default config;
