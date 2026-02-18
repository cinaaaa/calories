<script lang="ts">
	import jsQR from 'jsqr';
	import { parseEncodedPayload, type MigrateData } from '$lib/migrate';

	interface Props {
		open: boolean;
		onClose: () => void;
		onSuccess: (data: MigrateData) => void;
	}
	let { open, onClose, onSuccess }: Props = $props();

	let mode = $state<'choice' | 'camera'>('choice');
	let error = $state<string | null>(null);
	let success = $state(false);
	let videoEl = $state<HTMLVideoElement | null>(null);
	let stream = $state<MediaStream | null>(null);
	let fileInputEl = $state<HTMLInputElement | null>(null);

	function tryDecodeAndImport(raw: string) {
		error = null;
		try {
			const data = parseEncodedPayload(raw);
			onSuccess(data);
			success = true;
			setTimeout(() => {
				onClose();
			}, 1500);
		} catch {
			error = 'Invalid or damaged code';
		}
	}

	function captureFromVideo() {
		if (!videoEl || !stream) return;
		const v = videoEl;
		if (v.readyState !== v.HAVE_ENOUGH_DATA) return;
		const canvas = document.createElement('canvas');
		canvas.width = v.videoWidth;
		canvas.height = v.videoHeight;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.drawImage(v, 0, 0);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const result = jsQR(imageData.data, imageData.width, imageData.height);
		if (result?.data) tryDecodeAndImport(result.data);
		else error = 'No QR code found. Try moving the code into view.';
	}

	async function startCamera() {
		error = null;
		mode = 'camera';
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
		} catch {
			error = 'Camera access denied or unavailable.';
			mode = 'choice';
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((t) => t.stop());
			stream = null;
		}
		mode = 'choice';
		error = null;
	}

	function onFileSelected(e: Event) {
		error = null;
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			const canvas = document.createElement('canvas');
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				error = 'Could not read image.';
				return;
			}
			ctx.drawImage(img, 0, 0);
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const result = jsQR(imageData.data, imageData.width, imageData.height);
			if (result?.data) tryDecodeAndImport(result.data);
			else error = 'No QR code found in image.';
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			error = 'Could not load image.';
		};
		img.src = url;
		input.value = '';
	}

	function openFilePicker() {
		error = null;
		fileInputEl?.click();
	}

	function handleClose() {
		stopCamera();
		mode = 'choice';
		error = null;
		success = false;
		onClose();
	}

	$effect(() => {
		if (videoEl && stream) videoEl.srcObject = stream;
	});
	$effect(() => {
		if (!open) stopCamera();
	});
</script>

{#if open}
	<div class="backdrop" role="dialog" aria-modal="true" aria-label="Import data">
		<div class="modal">
			<div class="modal-head">
				<h2 class="modal-title">Import data</h2>
				<button type="button" class="modal-close" aria-label="Close" onclick={handleClose}>×</button>
			</div>
			<div class="modal-body">
				{#if success}
					<p class="message message-success">Data imported. This screen will close.</p>
				{:else}
					{#if mode === 'choice'}
						<p class="hint">Scan a QR code from the other device's Export screen, or choose an image.</p>
						<div class="buttons">
							<button type="button" class="btn" onclick={startCamera}>Use camera</button>
							<button type="button" class="btn" onclick={openFilePicker}>Choose image file</button>
						</div>
						<input
							type="file"
							accept="image/*"
							class="hidden"
							bind:this={fileInputEl}
							onchange={onFileSelected}
						/>
					{:else if mode === 'camera'}
						<div class="video-wrap">
							<video
								bind:this={videoEl}
								autoplay
								playsinline
								muted
								class="video"
							></video>
						</div>
						<div class="buttons">
							<button type="button" class="btn btn-primary" onclick={captureFromVideo}>Scan</button>
							<button type="button" class="btn" onclick={stopCamera}>Cancel</button>
						</div>
					{/if}
					{#if error}
						<p class="message message-error">{error}</p>
					{/if}
				{/if}
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
	.hint {
		margin: 0;
		font-size: var(--font-size-small);
		color: var(--color-text-muted);
		text-align: center;
	}
	.buttons {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}
	.btn {
		width: 100%;
		padding: 0.6rem 1rem;
		font-size: var(--font-size-body);
		color: var(--color-text);
		background: #eee;
		border: 1px solid #ccc;
		border-radius: 6px;
		cursor: pointer;
	}
	.btn:hover {
		background: #e0e0e0;
	}
	.btn-primary {
		background: var(--color-text);
		color: var(--color-inverse);
		border-color: var(--color-text);
	}
	.btn-primary:hover {
		opacity: 0.9;
	}
	.video-wrap {
		width: 100%;
		background: #000;
		border-radius: 8px;
		overflow: hidden;
	}
	.video {
		width: 100%;
		display: block;
	}
	.hidden {
		position: absolute;
		opacity: 0;
		pointer-events: none;
		width: 0;
		height: 0;
	}
	.message {
		margin: 0;
		font-size: var(--font-size-body);
		color: var(--color-text);
		text-align: center;
	}
	.message-error {
		color: #c00;
	}
	.message-success {
		color: #080;
	}
</style>
