import { fetchBinance } from '$lib/exchanges/ex-binance';
import { fetchBitget } from '$lib/exchanges/ex-bitget.js';
import { fetchMexc } from '$lib/exchanges/ex-mexc.js';
import { fetchOkx } from '$lib/exchanges/ex-okx.js';
import type { ExchangeP2PAd } from '$lib/exchanges/index.js';

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
		// Future exchanges can be added here
		default:
			break;
	}

	return new Response(
		JSON.stringify({
			responses: response
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}
