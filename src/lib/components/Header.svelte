<script lang="ts">
	interface Props {
		onMenuClick?: () => void;
	}
	let { onMenuClick }: Props = $props();
</script>

<header class="header">
	<div class="header-logo" aria-hidden="true"></div>
	<h1 class="header-title">Calories</h1>
	<button
		type="button"
		class="header-menu"
		aria-label="Open menu"
		onclick={onMenuClick}
	>
		<span class="header-menu-dots" aria-hidden="true">
			<span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span>
		</span>
	</button>
</header>

<style>
	.header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
		min-height: 3rem;
	}
	.header-logo {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background-color: var(--color-accent);
		flex-shrink: 0;
	}
	.header-title {
		font-size: var(--font-size-title);
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
		margin: 0;
		flex: 1;
	}
	.header-menu {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-button);
		background-color: var(--color-inverse);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.header-menu-dots {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 2px;
		width: 1rem;
		height: 1rem;
	}
	.dot {
		width: 4px;
		height: 4px;
		background: var(--color-text);
		border-radius: 1px;
	}
</style>
