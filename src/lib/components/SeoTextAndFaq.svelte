<script lang="ts">
    export let crypto: string;
    export let fiat: string;
    export let monthYear: string;

    // Generate full names for better readability
    const cryptoNames: Record<string, string> = {
        'USDT': 'Tether (USDT)',
        'BTC': 'Bitcoin (BTC)',
        'ETH': 'Ethereum (ETH)'
    };

    const fiatNames: Record<string, string> = {
        'NGN': 'Nigerian Naira (NGN)',
        'TRY': 'Turkish Lira (TRY)',
        'ARS': 'Argentine Peso (ARS)',
        'USD': 'US Dollar (USD)',
        'EUR': 'Euro (EUR)',
        'GBP': 'British Pound (GBP)',
        'PHP': 'Philippine Peso (PHP)',
        'VND': 'Vietnamese Dong (VND)',
        'INR': 'Indian Rupee (INR)',
        'RUB': 'Russian Ruble (RUB)',
        'BRL': 'Brazilian Real (BRL)',
        'ZAR': 'South African Rand (ZAR)'
    };

    $: cName = cryptoNames[crypto] || crypto;
    $: fName = fiatNames[fiat] || fiat;

    // Structured JSON-LD Data for Google Rich Snippets
    $: jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What is the cheapest way to buy  with ?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The cheapest way to buy  with  varies by the minute based on P2P market liquidity. By checking our live aggregated table above, you can compare merchants across major exchanges like Binance, Bybit, and OKX to secure the lowest spread.`
                }
            },
            {
                "@type": "Question",
                "name": `Is KYC required to buy  using  on P2P?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Most major centralized exchanges require KYC (Identity Verification) to participate in P2P trading. However, you can use our tool to browse current / rates freely before creating an account.`
                }
            },
            {
                "@type": "Question",
                "name": `How do I avoid P2P scams when trading ?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `To safely trade  for , always trade within the exchange platform so your funds are protected by escrow. Never release your  until the  has definitively cleared in your bank account, and avoid clicking external links sent by the counterparty.`
                }
            }
        ]
    };
</script>

<svelte:head>
    <!-- Inject FAQ Structured Data for Google Rich Snippets -->
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<section class="seo-content-container mt-12 mb-8 px-4 text-gray-800 dark:text-gray-200">
    <div class="max-w-4xl mx-auto">
        
        <div class="prose dark:prose-invert max-w-none">
            <h2 class="text-2xl font-bold mb-4">About the {crypto} to {fiat} P2P Market</h2>
            <p class="mb-4 leading-relaxed">
                Welcome to the ultimate comparison tool for buying and selling <strong>{cName}</strong> using <strong>{fName}</strong>. 
                As of <strong>{monthYear}</strong>, peer-to-peer (P2P) trading remains one of the most cost-effective and flexible ways 
                to enter or exit the cryptocurrency market. Instead of relying on a single exchange's order book, our aggregator 
                monitors active advertisements across major global exchanges in real-time.
            </p>
            <p class="mb-6 leading-relaxed">
                Whether you are looking for arbitrage opportunities, trying to bypass high credit card fees, or simply searching for 
                merchants supporting local payment methods like bank transfers or mobile money, the live data above helps you identify 
                the most competitive exchange rates without needing to juggle multiple browser tabs.
            </p>
        </div>

        <div class="faq-section mt-10">
            <h3 class="text-xl font-bold mb-6">Frequently Asked Questions ({crypto}/{fiat})</h3>
            
            <div class="space-y-6">
                <!-- FAQ 1 -->
                <div class="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-5 shadow-sm">
                    <h4 class="font-semibold text-lg mb-2">What is the cheapest way to buy {cName} with {fName}?</h4>
                    <p class="text-sm md:text-base opacity-90">
                        The cheapest way to buy {crypto} with {fiat} varies constantly based on P2P market liquidity. 
                        By checking our live aggregated table above, you can compare merchants across major exchanges 
                        like Binance, Bybit, and OKX to secure the lowest spread.
                    </p>
                </div>

                <!-- FAQ 2 -->
                <div class="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-5 shadow-sm">
                    <h4 class="font-semibold text-lg mb-2">Is KYC required to buy {crypto} using {fiat} on P2P?</h4>
                    <p class="text-sm md:text-base opacity-90">
                        Most major centralized exchanges require KYC (Identity Verification) to participate in P2P trading. 
                        However, you can use our tool to browse current {crypto}/{fiat} rates freely without logging in or 
                        providing any personal information.
                    </p>
                </div>

                <!-- FAQ 3 -->
                <div class="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-5 shadow-sm">
                    <h4 class="font-semibold text-lg mb-2">How do I avoid P2P scams when trading {fiat}?</h4>
                    <p class="text-sm md:text-base opacity-90">
                        To safely trade {fiat} for {crypto}, always trade within the exchange platform so your funds are protected 
                        by escrow. Never release your {crypto} until the {fiat} has definitively cleared in your bank account, 
                        and avoid communicating on third-party apps like WhatsApp or Telegram.
                    </p>
                </div>
            </div>
        </div>

    </div>
</section>
