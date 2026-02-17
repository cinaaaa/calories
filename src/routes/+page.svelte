<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import CaloriesHero from '$lib/components/CaloriesHero.svelte';
	import ProteinCard from '$lib/components/ProteinCard.svelte';
	import CaloriesCard from '$lib/components/CaloriesCard.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import AddEntryModal from '$lib/components/AddEntryModal.svelte';
	import { entriesStore } from '$lib/stores/entries';
	import { settingsStore } from '$lib/stores/settings';
	import { toDateKey } from '$lib/weeklyData';
	import { clearAllData } from '$lib/storage';

	let settingsModalOpen = $state(false);
	let addEntryModalOpen = $state(false);

	const intake = $derived($entriesStore);
	const settings = $derived($settingsStore);
	const todayKey = $derived(toDateKey(new Date()));
	const todayEntries = $derived(intake[todayKey] ?? []);
	const totalCalories = $derived(todayEntries.reduce((s, e) => s + e.calories, 0));
	const totalProtein = $derived(todayEntries.reduce((s, e) => s + e.protein, 0));

	function openSettings() {
		settingsModalOpen = true;
	}
	function openAddEntry() {
		addEntryModalOpen = true;
	}
	function addEntry(entry: { calories: number; protein: number }) {
		entriesStore.addEntry(todayKey, entry);
	}
	function resetData() {
		clearAllData();
		entriesStore.reload();
		settingsStore.reload();
	}
</script>

<div class="dashboard">
	<Header onMenuClick={openSettings} />
	<CaloriesHero
		totalCalories={totalCalories}
		dailyAllowance={settings.dailyAllowance}
		totalProtein={totalProtein}
	/>
	<button type="button" class="big-add" onclick={openAddEntry} aria-label="Add entry">
		<span class="big-add-icon">+</span>
	</button>
	<div class="cards">
		<ProteinCard protein={totalProtein} />
		<CaloriesCard calories={totalCalories} trendPct={null} />
	</div>
	<section class="entry-list" aria-label="Today's entries">
		<h2 class="entry-list-title">Today's entries</h2>
		{#if todayEntries.length === 0}
			<p class="entry-list-empty">No entries yet. Tap + to add.</p>
		{:else}
			<ul class="entry-list-items">
				{#each todayEntries as entry}
					<li class="entry-item">
						{entry.calories} Kcal
						{#if entry.protein > 0}
							· {entry.protein}g protein
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>

<SettingsModal
	open={settingsModalOpen}
	dailyAllowance={settings.dailyAllowance}
	currentWeight={settings.currentWeight}
	onClose={() => (settingsModalOpen = false)}
	onSaveAllowance={(v) => settingsStore.setDailyAllowance(v)}
	onSaveWeight={(v) => settingsStore.setCurrentWeight(v)}
	onUpdateWeight={(v) => settingsStore.updateWeight(v)}
	onResetData={resetData}
/>

<AddEntryModal
	open={addEntryModalOpen}
	onClose={() => (addEntryModalOpen = false)}
	onAdd={addEntry}
/>

<style>
	.big-add {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		min-height: 7rem;
		padding: 1.5rem;
		background: #212121;
		color: var(--color-inverse);
		border: none;
		border-radius: var(--radius-card);
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: background 0.15s ease;
	}
	.big-add:hover {
		background: #565656;
	}
	.big-add-icon {
		font-size: 4rem;
		line-height: 1;
		font-weight: 300;
	}
	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	@media (max-width: 380px) {
		.cards {
			grid-template-columns: 1fr;
		}
	}
	.entry-list {
		margin-top: var(--space-section);
		padding-top: var(--space-section);
		border-top: 1px solid rgba(0, 0, 0, 0.08);
	}
	.entry-list-title {
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
		margin: 0 0 0.5rem 0;
	}
	.entry-list-empty {
		font-size: var(--font-size-body);
		color: var(--color-text-muted);
		margin: 0;
	}
	.entry-list-items {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.entry-item {
		font-size: var(--font-size-body);
		color: var(--color-text);
		padding: 0.35rem 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}
</style>
