<script lang="ts">
	import type { Entry } from '$lib/storage';

	interface Props {
		open: boolean;
		onClose: () => void;
		onAdd: (entry: Entry) => void;
	}
	let { open, onClose, onAdd }: Props = $props();

	let calories = $state('');
	let protein = $state('');
	let error = $state('');

	function submit() {
		error = '';
		const cal = Number(calories);
		const prot = Number(protein) || 0;
		if (Number.isNaN(cal) || cal <= 0) {
			error = 'Calories must be greater than 0';
			return;
		}
		if (Number.isNaN(prot) || prot < 0) {
			error = 'Protein must be 0 or greater';
			return;
		}
		onAdd({ calories: cal, protein: prot });
		calories = '';
		protein = '';
		onClose();
	}

	function cancel() {
		calories = '';
		protein = '';
		error = '';
		onClose();
	}
</script>

{#if open}
	<div class="backdrop" role="dialog" aria-modal="true" aria-label="Add entry">
		<div class="modal">
			<div class="modal-head">
				<h2 class="modal-title">Add entry</h2>
				<button type="button" class="modal-close" aria-label="Close" onclick={cancel}>×</button>
			</div>
			<div class="modal-body">
				<label class="field">
					<span class="field-label">Calories *</span>
					<input
						type="number"
						class="field-input"
						min="1"
						required
						placeholder="e.g. 450"
						bind:value={calories}
					/>
				</label>
				<label class="field">
					<span class="field-label">Protein (g)</span>
					<input
						type="number"
						class="field-input"
						min="0"
						step="1"
						placeholder="e.g. 32"
						bind:value={protein}
					/>
				</label>
				{#if error}
					<p class="field-error">{error}</p>
				{/if}
				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" onclick={cancel}>Cancel</button>
					<button type="button" class="btn btn-primary" onclick={submit}>Add</button>
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
		align-items: flex-end;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease-out;
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	@keyframes slideUp {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}
	
	.modal {
		background: var(--color-inverse);
		border-radius: 1.5rem 1.5rem 0 0;
		width: 100%;
		max-width: 500px;
		height: 90vh;
		box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		animation: slideUp 0.3s ease-out;
	}
	
	.modal-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem 2rem 1rem 2rem;
		flex-shrink: 0;
		border-bottom: 1px solid #f0f0f0;
	}
	
	.modal-title {
		margin: 0;
		font-size: 2rem;
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
	}
	
	.modal-close {
		background: none;
		border: none;
		font-size: 2.5rem;
		line-height: 1;
		cursor: pointer;
		color: var(--color-text-muted);
		padding: 0.5rem;
		margin: -0.5rem;
		min-width: 3rem;
		min-height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.modal-body {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		flex: 1;
		overflow-y: auto;
	}
	
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.field-label {
		font-size: 1.25rem;
		color: var(--color-text);
		font-weight: 500;
	}
	
	.field-input {
		padding: 1.25rem 1rem;
		border: 2px solid #ddd;
		border-radius: 12px;
		font-size: 1.5rem;
		font-family: var(--font-sans);
		transition: border-color 0.2s;
	}
	
	.field-input:focus {
		outline: none;
		border-color: var(--color-accent);
	}
	
	.field-error {
		color: #c00;
		font-size: 1.125rem;
		margin: 0;
		padding: 1rem;
		background: #fee;
		border-radius: 8px;
	}
	
	.modal-actions {
		display: flex;
		gap: 1rem;
		justify-content: stretch;
		margin-top: auto;
		padding-top: 1rem;
	}
	
	.btn {
		padding: 1.25rem 2rem;
		border-radius: 12px;
		font-size: 1.25rem;
		font-weight: 600;
		cursor: pointer;
		border: none;
		flex: 1;
		transition: all 0.2s;
		min-height: 3.5rem;
	}
	
	.btn-primary {
		background: var(--color-accent);
		color: var(--color-inverse);
	}
	
	.btn-primary:active {
		background: var(--color-accent-hover);
		transform: scale(0.98);
	}
	
	.btn-secondary {
		background: #f0f0f0;
		color: var(--color-text);
	}
	
	.btn-secondary:active {
		background: #e0e0e0;
		transform: scale(0.98);
	}
</style>
