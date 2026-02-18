import { writable } from 'svelte/store';
import { getIntake, addEntry as addEntryStorage, removeEntry as removeEntryStorage, type Entry } from '$lib/storage';

function createEntriesStore() {
	const { subscribe, set, update } = writable(getIntake());

	return {
		subscribe,
		reload: () => set(getIntake()),
		addEntry: (date: string, entry: Entry) => {
			addEntryStorage(date, entry);
			set(getIntake());
		},
		removeEntry: (date: string, index: number) => {
			removeEntryStorage(date, index);
			set(getIntake());
		}
	};
}

export const entriesStore = createEntriesStore();
