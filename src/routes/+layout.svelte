<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import UpdateToast from '$lib/components/UpdateToast.svelte';
	import { isSuppressed, setDismissedUntil } from '$lib/pwa-update-dismiss';
	import { onMount } from 'svelte';

	let { children } = $props();

	let registration = $state<ServiceWorkerRegistration | null>(null);
	let updateAvailable = $state(false);
	let dismissTick = $state(0);

	const showToast = $derived.by(() => {
		void dismissTick; // re-run when dismiss triggers tick
		return updateAvailable && !isSuppressed();
	});

	function checkWaiting() {
		if (registration?.waiting) {
			updateAvailable = true;
		}
	}

	function handleDismiss() {
		setDismissedUntil();
		dismissTick++;
	}

	function handleUpdate() {
		if (!registration?.waiting) return;
		const once = () => {
			navigator.serviceWorker.removeEventListener('controllerchange', once);
			window.location.reload();
		};
		navigator.serviceWorker.addEventListener('controllerchange', once);
		registration.waiting.postMessage({ type: 'SKIP_WAITING' });
	}

	onMount(() => {
		if (!('serviceWorker' in navigator)) return;

		navigator.serviceWorker
			.register('/service-worker.js')
			.then((reg) => {
				registration = reg;
				checkWaiting();
				reg.update();
				reg.addEventListener('updatefound', () => {
					const newWorker = reg.installing;
					if (!newWorker) return;
					newWorker.addEventListener('statechange', () => {
						if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
							updateAvailable = true;
						}
					});
				});
			})
			.catch((err) => {
				console.error('Service worker registration failed:', err);
			});

		window.addEventListener('focus', () => {
			registration?.update();
			checkWaiting();
		});

		const interval = setInterval(() => {
			registration?.update();
			checkWaiting();
		}, 30 * 1000); // every 30 seconds

		return () => clearInterval(interval);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
<UpdateToast visible={showToast} onUpdate={handleUpdate} onDismiss={handleDismiss} />
