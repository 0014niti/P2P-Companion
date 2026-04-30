import { fetchBinance } from '$lib/exchanges/ex-binance';
import { fetchBitget } from '$lib/exchanges/ex-bitget.js';
import { fetchMexc } from '$lib/exchanges/ex-mexc.js';
import { fetchOkx } from '$lib/exchanges/ex-okx.js';
import { fetchBybit } from '$lib/exchanges/ex-bybit.js';
import { fetchKucoin } from '$lib/exchanges/ex-kucoin.js';
import { fetchRemitano } from '$lib/exchanges/ex-remitano.js'; // ADDED
import { fetchPaxful } from '$lib/exchanges/ex-paxful.js';     // ADDED
import type { ExchangeP2PAd } from '$lib/exchanges/index.js';

// NOTE: If you are using the Vercel Edge runtime we discussed earlier, 
// make sure to keep `export const config = { runtime: 'edge' };` here!
export const config = {
	runtime: 'edge'
};

export async function GET({ request }) {
	const querys = new URL(request.url).searchParams;

	const type = querys.get('type') || 'buy';
	const token = querys.get('token') || 'USDT';
	const fiat = querys.get('fiat') || 'USD';
	const exchange = querys.get('exchange') || 'binance';

	let response: ExchangeP2PAd[] | null = null;

	switch (exchange) {
		case 'binance':
			response = await fetchBinance({ type: type as 'buy' | 'sell', token, fiat });
			break;
		case 'okx':
			response = await fetchOkx({ type: type as 'buy' | 'sell', token, fiat });
			break;
		case 'mexc':
			response = await fetchMexc({ type: type as 'buy' | 'sell', token, fiat });
			break;
		case 'bitget':
			response = await fetchBitget({ type: type as 'buy' | 'sell', token, fiat });
			break;
		case 'bybit':
			response = await fetchBybit({ type: type as 'buy' | 'sell', token, fiat });
			break;
		case 'kucoin':
			response = await fetchKucoin({ type: type as 'buy' | 'sell', token, fiat });
			break;
		case 'remitano':
			response = await fetchRemitano({ type: type as 'buy' | 'sell', token, fiat }); // ADDED
			break;
		case 'paxful':
			response = await fetchPaxful({ type: type as 'buy' | 'sell', token, fiat }); // ADDED
			break;
		default:
			break;
	}

	return new Response(
		JSON.stringify({
			responses: response || []
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}
