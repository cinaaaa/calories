<script lang="ts">
	interface Props {
		visible: boolean;
		onUpdate: () => void;
		onDismiss: () => void;
	}
	let { visible, onUpdate, onDismiss }: Props = $props();

	// For exit animation: keep rendering until fade out finishes
	let leaving = $state(false);
	let show = $derived(visible || leaving);

	$effect(() => {
		if (!visible && show) {
			leaving = true;
			const t = setTimeout(() => {
				leaving = false;
			}, 300);
			return () => clearTimeout(t);
		}
	});
</script>

{#if show}
	<div
		class="update-toast"
		class:update-toast--visible={visible}
		class:update-toast--leaving={leaving}
		role="status"
		aria-live="polite"
		aria-label="New version available"
	>
		<p class="update-toast__message">New version available</p>
		<div class="update-toast__actions">
			<button type="button" class="update-toast__btn update-toast__btn--primary" onclick={onUpdate}>
				Update
			</button>
			<button type="button" class="update-toast__btn update-toast__btn--secondary" onclick={onDismiss}>
				Later
			</button>
		</div>
	</div>
{/if}

<style>
	.update-toast {
		position: fixed;
		left: 50%;
		transform: translateX(-50%) translateY(100%);
		bottom: 0;
		width: 100%;
		max-width: 500px;
		box-sizing: border-box;
		padding: var(--space-page, 1rem);
		padding-bottom: max(var(--space-page, 1rem), env(safe-area-inset-bottom));
		background: var(--color-toast-bg, #1a1a1a);
		color: var(--color-toast-text, #f5f5f5);
		font-family: var(--font-sans);
		font-size: var(--font-size-body);
		box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
		opacity: 0;
		transition:
			transform 0.3s ease-out,
			opacity 0.3s ease-out;
		z-index: 1000;
	}

	.update-toast--visible {
		transform: translateX(-50%) translateY(0);
		opacity: 1;
	}

	.update-toast--leaving {
		opacity: 0;
		transform: translateX(-50%) translateY(100%);
	}

	.update-toast__message {
		margin: 0 0 0.75rem 0;
		font-weight: var(--font-weight-normal);
	}

	.update-toast__actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.update-toast__btn {
		font-family: var(--font-sans);
		font-size: var(--font-size-body);
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: var(--font-weight-bold);
	}

	.update-toast__btn--primary {
		background: var(--color-accent);
		color: var(--color-inverse, #fff);
	}

	.update-toast__btn--primary:hover {
		background: var(--color-accent-hover, #cf5304);
	}

	.update-toast__btn--secondary {
		background: transparent;
		color: var(--color-toast-text, #f5f5f5);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.update-toast__btn--secondary:hover {
		background: rgba(255, 255, 255, 0.1);
	}
</style>
