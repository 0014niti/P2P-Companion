import { persistedState } from 'svelte-persisted-state';

export const refreshTimers = {
	'5sec': {
		value: 5 * 1000,
		label: '5 seconds'
	},
	'15sec': {
		value: 15 * 1000,
		label: '15 seconds'
	},
	'30sec': {
		value: 30 * 1000,
		label: '30 seconds'
	},
	'1min': {
		value: 1 * 60 * 1000,
		label: '1 minute'
	},
	'5min': {
		value: 5 * 60 * 1000,
		label: '5 minutes'
	}
} as const;

export const refreshTimersArr = Object.entries(refreshTimers).map(([key, value]) => ({
	key,
	...value
}));

export type RefreshTimer = keyof typeof refreshTimers;

export type UserPrefs = {
	selectedToken: string;
	type: 'buy' | 'sell';
	fiat: string;
	refreshTimer?: RefreshTimer;
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
