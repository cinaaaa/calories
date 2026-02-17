<script lang="ts">
	interface Props {
		protein: number;
	}
	let { protein }: Props = $props();
</script>

<div class="card protein-card">
	<p class="card-title">Protein</p>
	<p class="card-value">
		<span class="card-number">{protein.toLocaleString()}</span>
		<span class="card-unit">g</span>
	</p>
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
		margin: 0;
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
	.protein-card {
		background-color: var(--color-card-dark);
	}
</style>
