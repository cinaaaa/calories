import { getEntries } from './storage';
import type { IntakeStore } from './storage';

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

/** Returns calendar dates for a rolling window ending on endDate. Oldest first. */
export function getRecentDates(days: number, endDate = new Date()): Date[] {
	const result: Date[] = [];
	const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
	for (let offset = days - 1; offset >= 0; offset--) {
		const d = new Date(end);
		d.setDate(end.getDate() - offset);
		result.push(d);
	}
	return result;
}

/** Compute weekly data for a rolling 7-day window ending today. */
export function getWeeklyData(
	dailyAllowance: number,
	intake?: IntakeStore,
	endDate = new Date()
): DayData[] {
	const today = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
	const todayKey = toDateKey(today);
	const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
	const result: DayData[] = [];

	for (const d of getRecentDates(7, endDate)) {
		const dateKey = toDateKey(d);
		const entries = intake?.[dateKey] ?? getEntries(dateKey);
		const calories = entries.reduce((sum, e) => sum + e.calories, 0);
		const percentage =
			dailyAllowance > 0 ? Math.round((calories / dailyAllowance) * 100) : 0;
		result.push({
			label: fmt.format(d),
			dateKey,
			calories,
			percentage,
			isToday: dateKey === todayKey
		});
	}
	return result;
}
