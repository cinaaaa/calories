/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE_NAME = `calories-pwa-${version}`;

// Assets to cache on install
const ASSETS = [
	...build, // SvelteKit build files
	...files  // Static files from /static
];

// Install event - cache assets
self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE_NAME);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		const keys = await caches.keys();
		await Promise.all(
			keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
		);
	}

	event.waitUntil(deleteOldCaches());
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
	// Only cache GET requests
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE_NAME);

		// Try to serve from cache first (Cache First strategy)
		const cached = await cache.match(event.request);
		if (cached) {
			return cached;
		}

		// If not in cache, try to fetch from network
		try {
			const response = await fetch(event.request);
			
			// Cache successful responses for future offline use
			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}
			
			return response;
		} catch (err) {
			// Network failed and resource not in cache
			// For navigation requests, try to return the cached root page
			if (event.request.mode === 'navigate') {
				const cachedPage = await cache.match('/');
				if (cachedPage) {
					return cachedPage;
				}
			}
			
			// For other requests, return a network error
			// The app will handle this gracefully since data is in localStorage
			return new Response('Network error', {
				status: 408,
				statusText: 'Network request failed'
			});
		}
	}

	event.respondWith(respond());
});
