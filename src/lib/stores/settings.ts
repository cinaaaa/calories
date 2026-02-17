import { writable } from 'svelte/store';
import {
	getSettings,
	setSettings,
	setDailyAllowance as setAllowanceStorage,
	updateWeight as updateWeightStorage
} from '$lib/storage';

function createSettingsStore() {
	const { subscribe, set, update } = writable(getSettings());

	return {
		subscribe,
		reload: () => set(getSettings()),
		setDailyAllowance: (value: number) => {
			setAllowanceStorage(value);
			update((s) => ({ ...s, dailyAllowance: value }));
		},
		setCurrentWeight: (value: number | null) => {
			setSettings({ ...getSettings(), currentWeight: value });
			set(getSettings());
		},
		updateWeight: (newWeight: number) => {
			updateWeightStorage(newWeight);
			set(getSettings());
		}
	};
}

export const settingsStore = createSettingsStore();
