import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { fetchBinance } from '$lib/exchanges/ex-binance';
import { fetchBybit } from '$lib/exchanges/ex-bybit';
import { fetchOkx } from '$lib/exchanges/ex-okx';
import { fetchKucoin } from '$lib/exchanges/ex-kucoin';
import { fetchBitget } from '$lib/exchanges/ex-bitget';
import { fetchMexc } from '$lib/exchanges/ex-mexc';
import { fetchBingx } from '$lib/exchanges/ex-bingx';   // ADDED
import { fetchGateio } from '$lib/exchanges/ex-gateio'; // ADDED
import { fetchHtx } from '$lib/exchanges/ex-htx';       // ADDED

export const GET: RequestHandler = async ({ url }) => {
	const exchange = url.searchParams.get('exchange');
	const type = url.searchParams.get('type') as 'buy' | 'sell';
	const token = url.searchParams.get('token');
	const fiat = url.searchParams.get('fiat');

	if (!exchange || !type || !token || !fiat) {
		return json({ error: 'Missing required parameters' }, { status: 400 });
	}

	const props = { type, token, fiat };

	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let data: any[] = [];

		switch (exchange) {
			case 'binance': data = await fetchBinance(props); break;
			case 'bybit': data = await fetchBybit(props); break;
			case 'okx': data = await fetchOkx(props); break;
			case 'kucoin': data = await fetchKucoin(props); break;
			case 'bitget': data = await fetchBitget(props); break;
			case 'mexc': data = await fetchMexc(props); break;
			case 'bingx': data = await fetchBingx(props); break;   // ADDED
			case 'gateio': data = await fetchGateio(props); break; // ADDED
			case 'htx': data = await fetchHtx(props); break;       // ADDED
			default:
				return json({ error: 'Unknown exchange' }, { status: 400 });
		}

		return json({ responses: data });
	} catch (error) {
		console.error(`API Error fetching ${exchange}:`, error);
		return json({ error: 'Internal server error', responses: [] }, { status: 500 });
	}
};
