<script lang="ts">
	interface Props {
		open: boolean;
		dailyAllowance: number;
		proteinGoal: number;
		onClose: () => void;
		onSaveAllowance: (value: number) => void;
		onSaveProteinGoal: (value: number) => void;
		onExport: () => void;
		onImport: () => void;
	}
	let {
		open,
		dailyAllowance,
		proteinGoal,
		onClose,
		onSaveAllowance,
		onSaveProteinGoal,
		onExport,
		onImport
	}: Props = $props();

	let allowance = $state(2267);
	let protein = $state(160);

	$effect(() => {
		if (open) {
			allowance = dailyAllowance;
			protein = proteinGoal;
		}
	});

	const allowanceNum = $derived(Number(allowance));
	const proteinNum = $derived(Number(protein));
	const hasChanges = $derived(
		(Number.isFinite(allowanceNum) && allowanceNum > 0 && allowanceNum !== dailyAllowance) ||
			(Number.isFinite(proteinNum) && proteinNum > 0 && proteinNum !== proteinGoal)
	);

	function saveAllowance() {
		const n = Number(allowance);
		if (!Number.isNaN(n) && n > 0) onSaveAllowance(n);
	}

	function saveProteinGoal() {
		const n = Number(protein);
		if (!Number.isNaN(n) && n > 0) onSaveProteinGoal(n);
	}

	function handleClose() {
		saveAllowance();
		saveProteinGoal();
		onClose();
	}

	function handleSave() {
		saveAllowance();
		saveProteinGoal();
		onClose();
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
					<span class="field-label">Protein goal (g)</span>
					<input
						type="number"
						class="field-input"
						min="1"
						bind:value={protein}
						onblur={saveProteinGoal}
					/>
				</label>
				<div class="migrate-section">
					<p class="migrate-label">Move data to another device</p>
					<button type="button" class="btn-migrate" onclick={onExport}>
						Export — Show QR to move data to another device
					</button>
					<button type="button" class="btn-migrate" onclick={onImport}>
						Import — Scan QR to load data from another device
					</button>
				</div>
				{#if hasChanges}
					<button type="button" class="btn-save" onclick={handleSave}>
						Save
					</button>
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
	.migrate-section {
		padding-top: 0.5rem;
		border-top: 1px solid rgba(0, 0, 0, 0.08);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.migrate-label {
		font-size: var(--font-size-small);
		color: var(--color-text-muted);
		margin: 0;
	}
	.btn-migrate {
		width: 100%;
		padding: 0.6rem 1rem;
		font-size: var(--font-size-small);
		color: var(--color-text);
		background: #f0f0f0;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 6px;
		cursor: pointer;
		text-align: left;
	}
	.btn-migrate:hover {
		background: #e5e5e5;
	}
	.btn-save {
		width: 100%;
		padding: 0.6rem 1rem;
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-bold);
		color: white;
		background: #4caf50;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		margin-top: 0.25rem;
	}
	.btn-save:hover {
		background: #66bb6a;
	}
</style>
