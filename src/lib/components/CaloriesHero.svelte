<script lang="ts">
	interface Props {
		totalCalories: number;
		dailyAllowance: number;
		totalProtein: number;
		proteinGoal: number;
	}
	let { totalCalories, dailyAllowance, totalProtein, proteinGoal }: Props = $props();
	const goalDisplay = $derived(proteinGoal > 0 ? proteinGoal : 160);
</script>

<div class="hero">
	<p class="hero-total">
		<span class="hero-number">{totalCalories.toLocaleString('en-US')}</span>
		<span class="hero-unit">Kcal</span>
	</p>
	<p class="hero-allowance">
		Daily allowance: <strong>{dailyAllowance}</strong>
	</p>
	<p class="hero-protein">
		Protein: <strong>{totalProtein}<span class="hero-protein-goal">/{goalDisplay} grams</span></strong>
	</p>
</div>

<style>
	.hero {
		padding: var(--space-section) 0;
	}
	.hero-total {
		margin: 0 0 0.25rem 0;
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
	}
	.hero-number {
		font-size: 100px;
		font-weight: 800;
		color: var(--color-text);
		line-height: 1.1;
		letter-spacing: -0.02em;
	}
	.hero-unit {
		font-size: var(--font-size-hero-unit);
		color: var(--color-text-muted);
		font-weight: var(--font-weight-normal);
	}
	.hero-allowance,
	.hero-protein {
		margin: 0.25rem 0 0 0;
		font-size: 30px;
		color: #6a6a6a;
	}
	.hero-allowance strong,
	.hero-protein strong {
		font-size: 35px;
		color: #212121;
		font-weight: var(--font-weight-bold);
	}
	.hero-protein-goal {
		font-size: 20px;
		color: #6a6a6a;
		font-weight: var(--font-weight-normal);
	}
</style>
