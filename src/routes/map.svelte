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
	let icon = $state<L.Icon>();
	onMount(() => {
		icon = L.icon({
			iconUrl: 'marker.png',
			iconSize: [50, 50], // size of the icon
			iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
			popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
		});
		map = L.map('map');
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			detectRetina: true,
			maxZoom: 20
		}).addTo(map);
		map.setView([focus.lat, focus.lon], 13);
		map.setView([focus.lat, focus.lon], 13);
	});

	$effect(() => {
		if (map === undefined) return;
		points.forEach((point) => {
			const marker = L.marker([point.lat, point.lon], {
				title: `marker ${point.id.toString()}`,
				alt: point.label,
				icon
			}).addTo(map);
			marker.addEventListener('click', () => {
				document.getElementById(point.id)?.scrollIntoView({ behavior: 'smooth' });
			});
			marker.bindPopup(`<p>${point.label}</p>`);
		});
	});

	$effect(() => {
		const point = points.find((point) => point.id === highlightedId);
		if (point) {
			console.log('hihi');
			map?.setView([point.lat, point.lon], 18);
			document.querySelector(`[title="marker ${point.id}"]`)?.click();
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
		position: relative;
	}

	.mapContainer::before {
		position: absolute;
		content: '';
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		border: 2px solid var(--fg-primary);
		filter: url(#displaced);
		box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
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

	:global(.leaflet-marker-icon) {
		filter: url(#squiggle);
	}

	:global(.leaflet-popup-content-wrapper) {
		position: relative;
		font-family: OldNewspaperTypes;
	}

	:global(.leaflet-popup-content-wrapper::before) {
		position: absolute;
		content: '';
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		border-radius: inherit;
		border: 2px solid var(--fg-primary);
		filter: url(#displaced);
	}

	:global(.leaflet-popup-tip),
	:global(.leaflet-popup-close-button) {
		border: 2px solid var(--fg-primary);
		filter: url(#displaced);
		color: var(--fg-primary) !important	;
	}
</style>
