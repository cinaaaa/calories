<script lang="ts">
	interface Props {
		calories: number;
		trendPct?: number | null;
	}
	let { calories, trendPct = null }: Props = $props();
</script>

<div class="card calories-card">
	<p class="card-title">Calories</p>
	<p class="card-value">
		<span class="card-number">{calories.toLocaleString()}</span>
		<span class="card-unit">Kcal</span>
	</p>
	{#if trendPct != null}
		<p class="card-change">
			<span class="arrow">↓</span> {Math.abs(trendPct).toFixed(1)}%
		</p>
	{/if}
</div>

<style>
	.card {
		border-radius: var(--radius-card);
		padding: 1rem;
	}
	.card-title {
		font-size: var(--font-size-body);
		color: var(--color-inverse);
		margin: 0 0 0.5rem 0;
	}
	.card-value {
		margin: 0 0 0.25rem 0;
	}
	.card-number {
		font-size: 2.25rem;
		font-weight: 800;
		color: var(--color-inverse);
	}
	.card-unit {
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
	.calories-card {
		background-color: var(--color-card-orange);
	}
</style>
