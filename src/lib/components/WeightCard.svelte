<script lang="ts">
	interface Props {
		weight: number | null;
		previousWeight: number | null;
		onEditClick?: () => void;
	}
	let { weight, previousWeight, onEditClick }: Props = $props();

	const change = $derived.by(() => {
		if (weight == null || previousWeight == null || previousWeight <= 0)
			return { text: '', down: true };
		const diff = weight - previousWeight;
		const pct = Math.round((diff / previousWeight) * 10000) / 100;
		return {
			text: `${diff >= 0 ? '+' : ''}${diff.toFixed(1)} (${pct >= 0 ? '+' : ''}${pct}%)`,
			down: diff < 0
		};
	});
</script>

<div class="card weight-card">
	<div class="card-head">
		<span class="card-title">Current Weight</span>
		<button type="button" class="card-action" aria-label="Edit weight" onclick={onEditClick}>⚡</button>
	</div>
	<p class="card-value">
		{#if weight != null}
			<span class="card-number">{weight.toFixed(2)}</span>
			<span class="card-unit">Kg</span>
		{:else}
			<span class="card-placeholder">—</span>
		{/if}
	</p>
	{#if change.text}
		<p class="card-change" class:down={change.down} class:up={!change.down}>
			<span class="arrow">{change.down ? '↓' : '↑'}</span> {change.text}
		</p>
	{/if}
</div>

<style>
	.card {
		border-radius: var(--radius-card);
		padding: 1rem;
	}
	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.card-title {
		font-size: var(--font-size-body);
		color: var(--color-inverse);
	}
	.card-action {
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		color: var(--color-inverse);
		cursor: pointer;
		font-size: 0.75rem;
		line-height: 1;
	}
	.card-value {
		margin: 0 0 0.25rem 0;
	}
	.card-number {
		font-size: 2.25rem;
		font-weight: 800;
		color: var(--color-inverse);
	}
	.card-unit,
	.card-placeholder {
		font-size: var(--font-size-body);
		color: rgba(255, 255, 255, 0.8);
		margin-left: 0.25rem;
	}
	.card-change {
		font-size: var(--font-size-small);
		color: var(--color-inverse);
		margin: 0;
		opacity: 0.9;
	}
	.weight-card {
		background-color: var(--color-card-dark);
	}
</style>
