<script lang="ts">
	import type { Map } from '@types/leaflet';
	import { onMount } from 'svelte';
	import type { Coordinates } from 'types';

	type Props = {
		points: Array<{ id: number; label: string } & Coordinates>;
		focus: Coordinates;
		highlightedId?: number;
	};
	let { focus, points, highlightedId }: Props = $props();

	let map = $state<Map>();
	onMount(() => {
		map = L.map('map').setView([focus.lat, focus.lon], 13);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			detectRetina: true
		}).addTo(map);
	});

	$effect(() => {
		if (map === undefined) return;
		points.forEach((point) => {
			const marker = L.marker([point.lat, point.lon], {
				title: `marker ${point.id.toString()}`,
				alt: point.label
			}).addTo(map);
			marker.addEventListener('click', () => {
				document.getElementById(point.id)?.scrollIntoView({ behavior: 'smooth' });
			});
			marker.bindPopup(`<p>${point.label}</p>`).openPopup();
		});
	});

	$effect(() => {
		const point = points.find((point) => point.id === highlightedId);
		if (point) {
			map?.setView([point.lat, point.lon], 18);
			const marker = document.querySelector(`[title="marker ${point.id}"]`)?.click();
		}
	});
</script>

<div class="mapContainer">
	<div id="map"></div>
</div>

<style>
	.mapContainer {
		padding: var(--grid-2);
		background-color: rgb(255, 255, 241);
		background-clip: padding-box;
		border-image: url('data:image/svg+xml,<svg viewBox="0 0 4 4" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="2" fill="rgb(255,255,241)"/></svg>');
		border-image-slice: 10;
		border-image-width: 4px;
		border-image-repeat: round;
		border-width: 4px;
		border-style: solid;
	}

	@media (min-width: 992px) {
		.mapContainer {
			padding: var(--grid-4);
			position: sticky;
			top: 0;
			align-self: start;
			order: 1;
		}
	}
	#map {
		height: 90vh;
	}
</style>
