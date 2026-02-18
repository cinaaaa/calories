const INTAKE_KEY = 'calories-intake';
const SETTINGS_KEY = 'calories-settings';

export type Entry = { calories: number; protein: number };
export type IntakeStore = Record<string, Entry[]>;

export type Settings = {
	dailyAllowance: number;
	currentWeight: number | null;
	previousWeight: number | null;
	proteinGoal: number;
};

const DEFAULT_SETTINGS: Settings = {
	dailyAllowance: 2267,
	currentWeight: null,
	previousWeight: null,
	proteinGoal: 160
};

function getJson<T>(key: string, fallback: T): T {
	if (typeof window === 'undefined') return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

function setJson(key: string, value: unknown): void {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// ignore
	}
}

/** Entries keyed by YYYY-MM-DD */
export function getIntake(): IntakeStore {
	return getJson<IntakeStore>(INTAKE_KEY, {});
}

export function getEntries(date: string): Entry[] {
	const intake = getIntake();
	return intake[date] ?? [];
}

export function addEntry(date: string, entry: Entry): void {
	const intake = getIntake();
	const list = intake[date] ?? [];
	intake[date] = [...list, entry];
	setJson(INTAKE_KEY, intake);
}

export function removeEntry(date: string, index: number): void {
	const intake = getIntake();
	const list = intake[date] ?? [];
	if (index < 0 || index >= list.length) return;
	intake[date] = list.filter((_, i) => i !== index);
	setJson(INTAKE_KEY, intake);
}

export function setIntake(intake: IntakeStore): void {
	setJson(INTAKE_KEY, intake);
}

/** Daily allowance, current weight, previous weight, protein goal */
export function getSettings(): Settings {
	const raw = getJson<Partial<Settings>>(SETTINGS_KEY, {});
	return { ...DEFAULT_SETTINGS, ...raw };
}

export function setSettings(settings: Partial<Settings>): void {
	const prev = getSettings();
	const next = { ...prev, ...settings };
	setJson(SETTINGS_KEY, next);
}

export function setDailyAllowance(value: number): void {
	setSettings({ dailyAllowance: value });
}

export function setProteinGoal(value: number): void {
	setSettings({ proteinGoal: value });
}

export function setCurrentWeight(value: number | null): void {
	const prev = getSettings();
	setSettings({
		currentWeight: value,
		previousWeight: value != null ? prev.currentWeight : prev.previousWeight
	});
}

/** Call after user updates weight: store current as previous, then set new current */
export function updateWeight(newWeight: number): void {
	const prev = getSettings();
	setSettings({
		previousWeight: prev.currentWeight,
		currentWeight: newWeight
	});
}

/** Remove all intake entries and reset settings to defaults */
export function clearAllData(): void {
	setJson(INTAKE_KEY, {});
	setJson(SETTINGS_KEY, DEFAULT_SETTINGS);
}
