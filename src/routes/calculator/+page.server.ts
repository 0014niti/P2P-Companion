import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	const fiat = url.searchParams.get('fiat')?.toUpperCase() || 'USD';
	const crypto = url.searchParams.get('crypto')?.toUpperCase() || 'USDT';
	const buy = Number(url.searchParams.get('buy')) || 1.00;
	const sell = Number(url.searchParams.get('sell')) || 1.02;

	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});

	return {
		fiat,
		crypto,
		buy,
		sell,
		metaTitle: `True Net Profit P2P Calculator - ${crypto}/${fiat} | P2P Terminal`,
		metaDescription: `Calculate your true peer-to-peer crypto arbitrage margins for ${crypto} to ${fiat}. Factor in exchange maker/taker fees and local banking transfer costs.`
	};
};