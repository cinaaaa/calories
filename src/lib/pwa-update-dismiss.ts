/**
 * PWA update toast: dismiss suppression (≥1 week).
 * localStorage key `pwa-update-dismissed-until` stores an ISO timestamp.
 * Show toast only when key is missing or stored timestamp is in the past.
 */

const KEY = 'pwa-update-dismissed-until';
const SUPPRESS_DAYS = 7;

export function getDismissedUntil(): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem(KEY);
}

/** Set suppression to now + 7 days. Call when user dismisses the update toast. */
export function setDismissedUntil(): void {
	if (typeof localStorage === 'undefined') return;
	const until = new Date();
	until.setDate(until.getDate() + SUPPRESS_DAYS);
	localStorage.setItem(KEY, until.toISOString());
}

/** True if we should suppress the toast (dismissed recently). */
export function isSuppressed(): boolean {
	const until = getDismissedUntil();
	if (!until) return false;
	try {
		return new Date(until).getTime() > Date.now();
	} catch {
		return false;
	}
}
