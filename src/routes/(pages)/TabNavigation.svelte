<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();

	const tabs = [
		{ name: 'Restaurants', href: '/', color: '#ffd803' },
		{ name: 'Cuisines', href: '/cuisines', color: '#bae8e8' },
		{ name: 'Account', href: '/account', color: '#c3f0ca' },
		{ name: 'About', href: '/about', color: '#a786df' }
	];
	const currentTab = $derived(() => {
		const path = $page.url.pathname;
		if (path.startsWith('/cuisines')) return 'Cuisines';
		if (path.startsWith('/about')) return 'About';
		if (path.startsWith('/account')) return 'Account';
		return 'Restaurants';
	});
</script>

<nav>
	<select onchange={(e) => goto(e.target.value)}>
		{#each tabs as { name, href }}
			<option value={href} selected={currentTab() === name}>{name}</option>
		{/each}
	</select>
	<ul>
		{#each tabs as { name, href, color }}
			<li class:currentTab={currentTab() === name} style:background-color={color}>
				<a {href} aria-current={currentTab() === name}>{name}</a>
			</li>
		{/each}
	</ul>
</nav>
<div class="pageBackground" style:color={tabs.find((item) => item.name === currentTab())?.color}>
	<div class="innerlayout">
		{@render children()}
	</div>
</div>

<style>
	.innerlayout {
		display: flex;
		flex-direction: column;
		gap: var(--grid-4);
		color: var(--fg-primary);
	}

	ul {
		display: none;
	}
	select {
		font-family: 'OldNewspaperTypes';
		background: #fff;
		outline: 2px solid currentColor;
		border-radius: 1.5rem;
		padding: 0.5rem 1rem;
		filter: url(#squiggle);
		border: none;
		font-size: 1.2rem;
		cursor: pointer;
	}

	select:hover {
		box-shadow: var(--subtle-shadow);
	}
	@media (min-width: 768px) {
		select {
			display: none;
		}
		nav {
			margin-bottom: calc(-1 * var(--grid-4));
		}
		.pageBackground {
			padding: 1rem;
			border: 2px solid var(--fg-primary);
			position: relative;
			border-radius: 5px;
			border-top-left-radius: 0;
		}
		.pageBackground::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: -1;
			background-color: rgb(255, 246, 215);
			background-image: linear-gradient(currentColor, currentColor);
			background-size: 100% 24px;
			background-repeat: no-repeat;
		}

		ul {
			display: grid;
			gap: 1rem;
			grid-template-columns: auto auto auto auto 1fr;
		}
		li {
			position: relative;
			border: 2px solid var(--fg-primary);
			border-bottom: none;
			border-radius: 1rem 1rem 0 0;
			min-width: 12ch;
			overflow: hidden;
		}
		.currentTab {
			position: relative;
			z-index: 1;
			overflow: visible;
		}

		.currentTab::before {
			content: '';
			position: absolute;
			top: 20px;
			bottom: -4px;
			left: 0;
			right: 0;
			background-color: inherit;
			z-index: -1;
		}
		a {
			display: block;
			padding: 0 1rem;
		}
	}
</style>
