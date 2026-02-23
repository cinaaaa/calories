<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import CaloriesHero from '$lib/components/CaloriesHero.svelte';
	import ProteinCard from '$lib/components/ProteinCard.svelte';
	import CaloriesCard from '$lib/components/CaloriesCard.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import AddEntryModal from '$lib/components/AddEntryModal.svelte';
	import ExportQRModal from '$lib/components/ExportQRModal.svelte';
	import ImportQRModal from '$lib/components/ImportQRModal.svelte';
	import { entriesStore } from '$lib/stores/entries';
	import { settingsStore } from '$lib/stores/settings';
	import { getWeeklyData, toDateKey } from '$lib/weeklyData';
	import { setIntake, setSettings } from '$lib/storage';
	import type { MigrateData } from '$lib/migrate';

	let settingsModalOpen = $state(false);
	let addEntryModalOpen = $state(false);
	let exportModalOpen = $state(false);
	let importModalOpen = $state(false);
	let deleteMode = $state(false);

	const intake = $derived($entriesStore);
	const settings = $derived($settingsStore);
	const todayKey = $derived(toDateKey(new Date()));
	const todayEntries = $derived(intake[todayKey] ?? []);
	const totalCalories = $derived(todayEntries.reduce((s, e) => s + e.calories, 0));
	const totalProtein = $derived(todayEntries.reduce((s, e) => s + e.protein, 0));
	const weeklyData = $derived(getWeeklyData(settings.dailyAllowance, intake));
	const weeklyTotalCalories = $derived(weeklyData.reduce((s, d) => s + d.calories, 0));
	const weeklyTargetCalories = $derived(settings.dailyAllowance * 7);
	const hasWeeklyIntake = $derived(weeklyTotalCalories > 0);
	const weeklyTargetPercent = $derived(
		weeklyTargetCalories > 0 ? Math.round((weeklyTotalCalories / weeklyTargetCalories) * 100) : 0
	);
	const weeklyMaxCalories = $derived(Math.max(...weeklyData.map((d) => d.calories), settings.dailyAllowance, 1));
	const kcalFormatter = new Intl.NumberFormat();

	function openSettings() {
		settingsModalOpen = true;
	}
	function openAddEntry() {
		addEntryModalOpen = true;
	}
	function addEntry(entry: { calories: number; protein: number }) {
		entriesStore.addEntry(todayKey, entry);
	}
	function removeEntryAtIndex(index: number) {
		entriesStore.removeEntry(todayKey, index);
	}
	function openExport() {
		settingsModalOpen = false;
		exportModalOpen = true;
	}
	function openImport() {
		settingsModalOpen = false;
		importModalOpen = true;
	}
	function onImportSuccess(data: MigrateData) {
		setIntake(data.intake);
		setSettings(data.settings);
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
		proteinGoal={settings.proteinGoal}
	/>
	<button type="button" class="big-add" onclick={openAddEntry} aria-label="Add entry">
		<span class="big-add-icon">+</span>
	</button>
	<!-- <div class="cards">
		<ProteinCard protein={totalProtein} />
		<CaloriesCard calories={totalCalories} trendPct={null} />
	</div> -->
	<section class="weekly-progress" aria-label="Last 7 days progress">
		<div class="weekly-progress-head">
			<p class="weekly-progress-kicker">Last 7 days</p>
			<p class="weekly-progress-target">
				Target: {kcalFormatter.format(weeklyTargetCalories)} kcal
			</p>
		</div>
		<div class="weekly-progress-summary">
			<p class="weekly-progress-total">{kcalFormatter.format(weeklyTotalCalories)} kcal</p>
			<!-- <p class="weekly-progress-percent">{weeklyTargetPercent}% of weekly target</p> -->
		</div>
		<div class="weekly-bars" role="img" aria-label="Daily calories for the last 7 days">
			{#each weeklyData as day}
				<div class="weekly-bar-col">
					<div class="weekly-bar-track">
						<div
							class="weekly-bar-fill"
							style={`height:${Math.round((day.calories / weeklyMaxCalories) * 100)}%`}
						></div>
					</div>
					<span class="weekly-bar-label">{day.label}</span>
				</div>
			{/each}
		</div>
		{#if !hasWeeklyIntake}
			<p class="weekly-progress-empty">No entries in the last 7 days yet.</p>
		{/if}
	</section>
	<section class="entry-list" aria-label="Today's entries">
		<div class="entry-list-head">
			<h2 class="entry-list-title">Today's entries</h2>
			{#if todayEntries.length > 0}
				<button
					type="button"
					class="entry-list-action"
					onclick={() => (deleteMode = !deleteMode)}
					aria-label={deleteMode ? 'Done' : 'Delete entries'}
				>
					{deleteMode ? 'done' : 'edit'}
				</button>
			{/if}
		</div>
		{#if todayEntries.length === 0}
			<p class="entry-list-empty">No entries yet. Tap + to add.</p>
		{:else}
			<ul class="entry-list-items">
				{#each todayEntries as entry, i}
					<li class="entry-item">
						<span class="entry-item-text">
							{entry.calories} Kcal
							{#if entry.protein > 0}
								· {entry.protein}g protein
							{/if}
						</span>
						{#if deleteMode}
							<button
								type="button"
								class="entry-item-delete"
								aria-label="Remove entry"
								onclick={() => removeEntryAtIndex(i)}
							>
								<span aria-hidden="true">×</span>
							</button>
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
	proteinGoal={settings.proteinGoal}
	onClose={() => (settingsModalOpen = false)}
	onSaveAllowance={(v) => settingsStore.setDailyAllowance(v)}
	onSaveProteinGoal={(v) => settingsStore.setProteinGoal(v)}
	onExport={openExport}
	onImport={openImport}
/>

<ExportQRModal open={exportModalOpen} onClose={() => (exportModalOpen = false)} />

<ImportQRModal
	open={importModalOpen}
	onClose={() => (importModalOpen = false)}
	onSuccess={onImportSuccess}
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
	/* .cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	} */
	.weekly-progress {
		background: #ffffff;
		border-radius: var(--radius-card);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.weekly-progress-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.weekly-progress-kicker {
		margin: 0;
		font-size: var(--font-size-small);
		color: var(--color-text-muted);
	}
	.weekly-progress-target {
		margin: 0;
		font-size: var(--font-size-small);
		color: var(--color-text-muted);
	}
	.weekly-progress-summary {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.weekly-progress-total {
		margin: 0;
		font-size: 2rem;
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
		line-height: 1.1;
	}
	.weekly-progress-percent {
		margin: 0;
		font-size: var(--font-size-small);
		color: var(--color-text-muted);
	}
	.weekly-bars {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		align-items: end;
		gap: 0.5rem;
		min-height: 8.5rem;
	}
	.weekly-bar-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	.weekly-bar-track {
		width: 100%;
		max-width: 1.5rem;
		height: 6.5rem;
		border-radius: 999px;
		background: #dfe5de;
		position: relative;
		overflow: hidden;
	}
	.weekly-bar-fill {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 999px;
		background: #85ba8e;
		min-height: 0;
	}
	.weekly-bar-label {
		font-size: var(--font-size-small);
		color: var(--color-text-muted);
	}
	.weekly-progress-empty {
		margin: 0;
		font-size: var(--font-size-small);
		color: var(--color-text-muted);
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
	.entry-list-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.entry-list-title {
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
		margin: 0;
	}
	.entry-list-action {
		background: none;
		border: none;
		font-size: var(--font-size-small);
		color: var(--color-text-muted);
		cursor: pointer;
		padding: 0.25rem 0;
	}
	.entry-list-action:hover {
		color: var(--color-text);
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
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		font-size: var(--font-size-body);
		color: var(--color-text);
		padding: 0.35rem 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}
	.entry-item-text {
		flex: 1;
	}
	.entry-item-delete {
		background: none;
		border: none;
		color: var(--color-text-muted);
		cursor: pointer;
		padding: 0.2rem;
		font-size: 1.25rem;
		line-height: 1;
	}
	.entry-item-delete:hover {
		color: var(--color-text);
	}
</style>
