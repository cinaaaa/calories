import pako from 'pako';
import type { IntakeStore, Entry, Settings } from './storage';
import { getIntake, getSettings } from './storage';
import { getRecentDates, toDateKey } from './weeklyData';

const VERSION = 'v1:';
const MAX_ENCODED_BYTES = 1800; // safe for one QR (~2KB payload)

/** Compact payload: i = intake (date -> [c,p][]), s = settings (a,c,p,g) */
type CompactPayload = {
	i: Record<string, [number, number][]>;
	s: { a: number; c: number | null; p: number | null; g?: number };
};

export type MigrateData = {
	intake: IntakeStore;
	settings: Settings;
};

export function filterIntakeToRecentDays(
	intake: IntakeStore,
	days = 7,
	endDate = new Date()
): IntakeStore {
	const recentKeys = new Set(getRecentDates(days, endDate).map((d) => toDateKey(d)));
	const filtered: IntakeStore = {};
	for (const [date, entries] of Object.entries(intake)) {
		if (recentKeys.has(date)) filtered[date] = entries;
	}
	return filtered;
}

function buildCompactPayload(intake: IntakeStore, settings: Settings): CompactPayload {
	const i: Record<string, [number, number][]> = {};
	const recentIntake = filterIntakeToRecentDays(intake, 7);
	for (const [date, entries] of Object.entries(recentIntake)) {
		i[date] = entries.map((e: Entry) => [e.calories, e.protein]);
	}
	return {
		i,
		s: {
			a: settings.dailyAllowance,
			c: settings.currentWeight,
			p: settings.previousWeight,
			g: settings.proteinGoal
		}
	};
}

function base64urlEncode(bytes: Uint8Array): string {
	let b64 = '';
	const bin = Array.from(bytes);
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	for (let i = 0; i < bin.length; i += 3) {
		const a = bin[i];
		const b = bin[i + 1];
		const c = bin[i + 2];
		b64 += chars[a! >> 2];
		b64 += chars[((a! & 3) << 4) | (b! >> 4)];
		b64 += b !== undefined ? chars[((b & 15) << 2) | (c! >> 6)] : '=';
		b64 += c !== undefined ? chars[c & 63] : '=';
	}
	return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(str: string): Uint8Array {
	str = str.replace(/-/g, '+').replace(/_/g, '/');
	while (str.length % 4) str += '=';
	const binary = atob(str);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

/**
 * Build compact payload from current storage, compress and base64url-encode.
 * Returns null if encoded size exceeds MAX_ENCODED_BYTES.
 */
export function buildAndEncodePayload(): string | null {
	const intake = getIntake();
	const settings = getSettings();
	const payload = buildCompactPayload(intake, settings);
	const json = JSON.stringify(payload);
	const withVersion = VERSION + json;
	const compressed = pako.deflate(withVersion, { level: 9 });
	const encoded = base64urlEncode(compressed);
	if (new TextEncoder().encode(encoded).length > MAX_ENCODED_BYTES) return null;
	return encoded;
}

function parseCompactPayload(raw: unknown): MigrateData {
	if (!raw || typeof raw !== 'object') throw new Error('Invalid payload');
	const o = raw as Record<string, unknown>;
	const i = o.i;
	const s = o.s;
	if (!i || typeof i !== 'object' || !s || typeof s !== 'object') throw new Error('Invalid payload');

	const intake: IntakeStore = {};
	for (const [date, arr] of Object.entries(i)) {
		if (!Array.isArray(arr)) throw new Error('Invalid payload');
		intake[date] = arr.map((tuple: unknown) => {
			if (!Array.isArray(tuple) || tuple.length < 2) throw new Error('Invalid payload');
			const c = Number(tuple[0]);
			const p = Number(tuple[1]);
			if (!Number.isFinite(c) || !Number.isFinite(p)) throw new Error('Invalid payload');
			return { calories: c, protein: p };
		});
	}

	const sa = s as { a?: unknown; c?: unknown; p?: unknown; g?: unknown };
	const a = Number(sa.a);
	const c = sa.c === null || sa.c === undefined ? null : Number(sa.c);
	const p = sa.p === null || sa.p === undefined ? null : Number(sa.p);
	const g = sa.g === undefined ? undefined : Number(sa.g);
	if (!Number.isFinite(a) || (c !== null && !Number.isFinite(c)) || (p !== null && !Number.isFinite(p)))
		throw new Error('Invalid payload');
	if (g !== undefined && !Number.isFinite(g)) throw new Error('Invalid payload');
	const proteinGoal = typeof g === 'number' && g > 0 ? g : 160;

	return {
		intake,
		settings: {
			dailyAllowance: a,
			currentWeight: c ?? null,
			previousWeight: p ?? null,
			proteinGoal
		}
	};
}

/**
 * Decode base64url, decompress, validate version and structure, return intake + settings.
 * Throws on invalid or unknown version.
 */
export function parseEncodedPayload(encoded: string): MigrateData {
	const bytes = base64urlDecode(encoded);
	const decompressed = pako.inflate(bytes, { to: 'string' });
	if (!decompressed.startsWith(VERSION)) throw new Error('Invalid or damaged code');
	const json = decompressed.slice(VERSION.length);
	const raw = JSON.parse(json) as unknown;
	return parseCompactPayload(raw);
}
