import { browser } from '$app/environment';
import { translations } from './translations';

export type Locale = keyof typeof translations;

class I18nStore {
	locale = $state<Locale>('en');

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('locale') as Locale;
			if (saved && translations[saved]) {
				this.locale = saved;
			} else {
				// Auto-detect browser language (e.g., 'es-ES' -> 'es')
				const browserLang = navigator.language.split('-')[0] as Locale;
				if (translations[browserLang]) {
					this.locale = browserLang;
				}
			}
		}
	}

	setLocale(newLocale: Locale) {
		this.locale = newLocale;
		if (browser) localStorage.setItem('locale', newLocale);
	}

	t(key: string, vars?: Record<string, string | number>): string {
		const keys = key.split('.');
		let text: any = translations[this.locale] || translations['en'];
		
		for (const k of keys) {
			if (text === undefined) break;
			text = text[k];
		}
		
		// Fallback to English if translation is missing in selected language
		if (text === undefined) return key;
		if (typeof text !== 'string') return key;

		if (vars) {
			for (const [k, v] of Object.entries(vars)) {
				text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
			}
		}
		return text;
	}
}

export const i18n = new I18nStore();