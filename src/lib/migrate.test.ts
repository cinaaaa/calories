import test from 'node:test';
import assert from 'node:assert/strict';
import { filterIntakeToRecentDays } from './migrate.ts';
import type { IntakeStore } from './storage.ts';

test('filterIntakeToRecentDays keeps only latest 7 calendar days', () => {
	const intake: IntakeStore = {
		'2026-01-01': [{ calories: 100, protein: 10 }],
		'2026-01-02': [{ calories: 200, protein: 20 }],
		'2026-01-03': [{ calories: 300, protein: 30 }],
		'2026-01-04': [{ calories: 400, protein: 40 }],
		'2026-01-05': [{ calories: 500, protein: 50 }],
		'2026-01-06': [{ calories: 600, protein: 60 }],
		'2026-01-07': [{ calories: 700, protein: 70 }],
		'2026-01-08': [{ calories: 800, protein: 80 }],
		'2026-01-09': [{ calories: 900, protein: 90 }]
	};
	const endDate = new Date(2026, 0, 9, 12); // Jan 9, 2026
	const filtered = filterIntakeToRecentDays(intake, 7, endDate);

	assert.deepEqual(Object.keys(filtered).sort(), [
		'2026-01-03',
		'2026-01-04',
		'2026-01-05',
		'2026-01-06',
		'2026-01-07',
		'2026-01-08',
		'2026-01-09'
	]);
	assert.equal(filtered['2026-01-02'], undefined);
	assert.equal(filtered['2026-01-09']?.[0]?.calories, 900);
});
