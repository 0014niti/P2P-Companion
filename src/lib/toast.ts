import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';
export type Toast = { id: string; message: string; type: ToastType };

const { subscribe, update } = writable<Toast[]>([]);

export const toastStore = {
	subscribe,
	add: (message: string, type: ToastType = 'info', duration = 3500) => {
		const id = Math.random().toString(36).substring(2, 9);
		update(toasts => [...toasts, { id, message, type }]);
		setTimeout(() => {
			update(toasts => toasts.filter(t => t.id !== id));
		}, duration);
	},
	remove: (id: string) => {
		update(toasts => toasts.filter(t => t.id !== id));
	}
};