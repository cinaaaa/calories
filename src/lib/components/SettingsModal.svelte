<script lang="ts">
	interface Props {
		open: boolean;
		dailyAllowance: number;
		currentWeight: number | null;
		onClose: () => void;
		onSaveAllowance: (value: number) => void;
		onSaveWeight: (value: number | null) => void;
		onUpdateWeight: (value: number) => void;
		onResetData: () => void;
	}
	let {
		open,
		dailyAllowance,
		currentWeight,
		onClose,
		onSaveAllowance,
		onSaveWeight,
		onUpdateWeight,
		onResetData
	}: Props = $props();

	let allowance = $state(2267);
	let weight = $state('');

	$effect(() => {
		if (open) {
			allowance = dailyAllowance;
			weight = currentWeight != null ? String(currentWeight) : '';
		}
	});

	function saveAllowance() {
		const n = Number(allowance);
		if (!Number.isNaN(n) && n > 0) onSaveAllowance(n);
	}

	function saveWeight() {
		const n = parseFloat(weight);
		if (!Number.isNaN(n) && n > 0) {
			onUpdateWeight(n);
		} else if (weight === '') {
			onSaveWeight(null);
		}
	}

	function handleClose() {
		saveAllowance();
		saveWeight();
		onClose();
	}

	function handleReset() {
		if (!confirm('Delete all entries and reset settings? This cannot be undone.')) return;
		onResetData();
		handleClose();
	}
</script>

{#if open}
	<div class="backdrop" role="dialog" aria-modal="true" aria-label="Settings">
		<div class="modal">
			<div class="modal-head">
				<h2 class="modal-title">Settings</h2>
				<button type="button" class="modal-close" aria-label="Close" onclick={handleClose}>×</button>
			</div>
			<div class="modal-body">
				<label class="field">
					<span class="field-label">Daily allowance (Kcal)</span>
					<input
						type="number"
						class="field-input"
						min="1"
						bind:value={allowance}
						onblur={saveAllowance}
					/>
				</label>
				<label class="field">
					<span class="field-label">Current weight (Kg)</span>
					<input
						type="number"
						class="field-input"
						step="0.01"
						min="0"
						placeholder="—"
						bind:value={weight}
						onblur={saveWeight}
					/>
				</label>
				<p class="field-hint">Updating weight saves the previous value so the card can show change %.</p>
				<div class="reset-section">
					<button type="button" class="btn-reset" onclick={handleReset}>
						Reset data
					</button>
				</div>
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
		z-index: 1000;
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
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.field-label {
		font-size: var(--font-size-small);
		color: var(--color-text);
	}
	.field-input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: var(--font-size-body);
	}
	.field-hint {
		font-size: var(--font-size-small);
		color: var(--color-text-muted);
		margin: 0;
	}
	.reset-section {
		padding-top: 0.5rem;
		border-top: 1px solid rgba(0, 0, 0, 0.08);
	}
	.btn-reset {
		width: 100%;
		padding: 0.6rem 1rem;
		font-size: var(--font-size-body);
		color: var(--color-text);
		background: red;
		border: 1px solid rgba(0, 0, 0, 0.15);
		border-radius: 6px;
		cursor: pointer;
	}
	.btn-reset:hover {
		background: #e61414;
		color: var(--color-text);
	}
</style>
