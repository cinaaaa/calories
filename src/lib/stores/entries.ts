import { writable } from 'svelte/store';
import { getIntake, addEntry as addEntryStorage, type Entry } from '$lib/storage';

function createEntriesStore() {
	const { subscribe, set, update } = writable(getIntake());

	return {
		subscribe,
		reload: () => set(getIntake()),
		addEntry: (date: string, entry: Entry) => {
			addEntryStorage(date, entry);
			set(getIntake());
		}
	};
}

export const entriesStore = createEntriesStore();
