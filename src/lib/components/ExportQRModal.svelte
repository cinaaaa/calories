<script lang="ts">
	import { toDataURL } from 'qrcode';
	import { buildAndEncodePayload } from '$lib/migrate';

	interface Props {
		open: boolean;
		onClose: () => void;
	}
	let { open, onClose }: Props = $props();

	let encoded = $state<string | null>(null);
	let qrDataUrl = $state<string | null>(null);
	let tooLarge = $state(false);
	let loading = $state(true);

	$effect(() => {
		if (!open) return;
		loading = true;
		tooLarge = false;
		qrDataUrl = null;
		encoded = null;
		const payload = buildAndEncodePayload();
		if (payload === null) {
			tooLarge = true;
			loading = false;
			return;
		}
		encoded = payload;
		toDataURL(payload, { margin: 1, width: 260 })
			.then((url: string) => {
				qrDataUrl = url;
			})
			.catch(() => {
				qrDataUrl = null;
			})
			.finally(() => {
				loading = false;
			});
	});
</script>

{#if open}
	<div class="backdrop" role="dialog" aria-modal="true" aria-label="Export data">
		<div class="modal">
			<div class="modal-head">
				<h2 class="modal-title">Export data</h2>
				<button type="button" class="modal-close" aria-label="Close" onclick={onClose}>×</button>
			</div>
			<div class="modal-body">
				{#if loading}
					<p class="message">Preparing QR code…</p>
				{:else if tooLarge}
					<p class="message message-error">Too much data for one QR. Try removing some older entries.</p>
				{:else if qrDataUrl}
					<p class="hint">Show this code on your other device, then use Import there to load the data.</p>
					<div class="qr-wrap">
						<img src={qrDataUrl} alt="QR code for data export" class="qr-img" />
					</div>
				{:else}
					<p class="message message-error">Could not generate QR code.</p>
				{/if}
				<button type="button" class="btn-done" onclick={onClose}>Done</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1001;
		padding: var(--space-page);
	}
	.modal {
		background: var(--color-inverse);
		border-radius: var(--radius-card);
		max-width: 20rem;
		width: 100%;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}
	.modal-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1rem 0 1rem;
	}
	.modal-title {
		margin: 0;
		font-size: var(--font-size-title);
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
	}
	.modal-close {
		background: none;
		border: none;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		color: var(--color-text-muted);
		padding: 0.25rem;
	}
	.modal-body {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}
	.message {
		margin: 0;
		font-size: var(--font-size-body);
		color: var(--color-text);
	}
	.message-error {
		color: #c00;
	}
	.hint {
		margin: 0;
		font-size: var(--font-size-small);
		color: var(--color-text-muted);
		text-align: center;
	}
	.qr-wrap {
		padding: 0.5rem;
		background: #fff;
		border-radius: 8px;
	}
	.qr-img {
		display: block;
		width: 260px;
		height: 260px;
	}
	.btn-done {
		width: 100%;
		padding: 0.6rem 1rem;
		font-size: var(--font-size-body);
		color: var(--color-inverse);
		background: var(--color-text);
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}
	.btn-done:hover {
		opacity: 0.9;
	}
</style>
