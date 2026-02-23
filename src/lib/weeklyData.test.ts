import test from 'node:test';
import assert from 'node:assert/strict';
import { getWeeklyData } from './weeklyData.ts';
import type { IntakeStore } from './storage.ts';

test('getWeeklyData returns rolling last 7 days ending on provided date', () => {
	const intake: IntakeStore = {
		'2026-01-04': [{ calories: 400, protein: 10 }],
		'2026-01-08': [{ calories: 1100, protein: 40 }],
		'2026-01-10': [{ calories: 900, protein: 30 }]
	};
	const endDate = new Date(2026, 0, 10, 12); // Jan 10, 2026
	const weekly = getWeeklyData(2000, intake, endDate);

	assert.equal(weekly.length, 7);
	assert.equal(weekly[0]?.dateKey, '2026-01-04');
	assert.equal(weekly[6]?.dateKey, '2026-01-10');
	assert.equal(weekly[0]?.calories, 400);
	assert.equal(weekly[4]?.dateKey, '2026-01-08');
	assert.equal(weekly[4]?.calories, 1100);
	assert.equal(weekly[6]?.calories, 900);
	assert.equal(weekly[2]?.calories, 0);
	assert.equal(weekly[6]?.isToday, true);
});
