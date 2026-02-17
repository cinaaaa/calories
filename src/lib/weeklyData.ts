import { getEntries } from '$lib/storage';
import type { IntakeStore } from '$lib/storage';

/** Get Monday of the week that contains the given date (local time) */
export function getMonday(d: Date): Date {
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1);
	return new Date(d.getFullYear(), d.getMonth(), diff);
}

/** Format date as YYYY-MM-DD */
export function toDateKey(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

export type DayData = {
	label: string;
	dateKey: string;
	calories: number;
	percentage: number;
	isToday: boolean;
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Compute weekly data (Mon–Sun) for the week containing today. Pass intake so derived state updates when entries change. */
export function getWeeklyData(
	dailyAllowance: number,
	intake?: IntakeStore
): DayData[] {
	const today = new Date();
	const monday = getMonday(today);
	const todayKey = toDateKey(today);
	const result: DayData[] = [];

	for (let i = 0; i < 7; i++) {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		const dateKey = toDateKey(d);
		const entries = intake?.[dateKey] ?? getEntries(dateKey);
		const calories = entries.reduce((sum, e) => sum + e.calories, 0);
		const percentage =
			dailyAllowance > 0 ? Math.round((calories / dailyAllowance) * 100) : 0;
		result.push({
			label: DAY_LABELS[i],
			dateKey,
			calories,
			percentage,
			isToday: dateKey === todayKey
		});
	}
	return result;
}
