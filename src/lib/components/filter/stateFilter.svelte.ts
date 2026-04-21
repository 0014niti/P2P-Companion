import { persistedState } from 'svelte-persisted-state';

export type UserPrefs = {
	selectedToken: string;
	type: 'buy' | 'sell';
	fiat: string;
	viewMode: 'grid' | 'horizontal';
};

export const filterState = persistedState<UserPrefs>(
	'user-prefs',
	{
		selectedToken: 'USDT',
		type: 'buy',
		fiat: 'USD',
		viewMode: 'grid'
	},
	{
		storage: 'local',
		syncTabs: true,
		beforeWrite: (value) => {
			return value;
		},
		onWriteError: (error) => {
			console.error('Error writing to persisted state:', error);
		}
	}
);
