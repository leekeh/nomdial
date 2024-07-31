<script lang="ts">
	import type { Map, Icon, LayerGroup } from 'leaflet';
	import { onMount, onDestroy } from 'svelte';
	import type { Coordinates } from 'types';
	import { createRestaurantId } from './util';

	type Props = {
		points?: Array<{ id: number; label: string } & Coordinates>;
		focus: Coordinates;
	};
	let { focus, points }: Props = $props();

	let map = $state<Map>();
	let markerGroup = $state<LayerGroup>();
	let icon = $state<Icon>();
	onMount(() => {
		icon = L.icon({
			iconUrl: 'marker.png',
			iconSize: [50, 50],
			iconAnchor: [25, 50],
			popupAnchor: [0, -50]
		});
		map = L.map('map');
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			detectRetina: true,
			maxZoom: 20
		}).addTo(map);
		markerGroup = L.layerGroup().addTo(map);
		map!.setView([focus.lat, focus.lon], 13);
		map!.setView([focus.lat, focus.lon], 13);

		function panRestaurant(e: CustomEvent) {
			const id = e.detail;
			const point = points?.find((point) => point.id === id);
			if (point) {
				map?.setView([point.lat, point.lon], undefined);
				(document.querySelector(`[title="marker ${id}"]`) as HTMLElement)?.click();
			}
		}
		document.addEventListener('panMap', panRestaurant);
		return () => {
			document.removeEventListener('panMap', panRestaurant);
		};
	});

	$effect(() => {
		if (map === undefined) return;
		points?.forEach((point) => {
			const marker = L.marker([point.lat, point.lon], {
				title: `marker ${point.id.toString()}`,
				alt: point.label,
				icon
			}).addTo(markerGroup);
			const popup = document.createElement('div');
			const label = document.createElement('p');
			label.innerHTML = point.label;
			popup.appendChild(label);
			const button = document.createElement('button');
			button.innerHTML = 'Show in list';
			button.className = 'marker-button';
			button.onclick = () => {
				document
					.getElementById(createRestaurantId(point.id))
					?.scrollIntoView({ behavior: 'smooth' });
			};
			popup.appendChild(button);
			marker.bindPopup(popup);
		});
		return () => {
			markerGroup!.clearLayers();
		};
	});

	$effect(() => {
		map?.flyTo({ lat: focus.lat, lng: focus.lon });
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

	/* Adjust leaflet styles */
	:global(.leaflet-marker-icon) {
		filter: url(#squiggle);
	}
	:global(.leaflet-popup-content-wrapper) {
		position: relative;
		font-family: OldNewspaperTypes;
	}
	:global(.leaflet-popup-content-wrapper::before, .leaflet-bar::before) {
		position: absolute;
		content: '';
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		border-radius: inherit;
		border: 2px solid var(--fg-primary);
		filter: url(#displaced);
		pointer-events: none;
	}
	:global(.leaflet-popup-tip),
	:global(.leaflet-popup-close-button) {
		border: 2px solid var(--fg-primary);
		border-left: none;
		border-top: none;
		filter: url(#displaced);
		color: var(--fg-primary) !important	;
		box-shadow: none;
	}
	:global(.leaflet-popup-tip-container) {
		overflow: visible;
	}
	:global(.leaflet-touch .leaflet-bar) {
		border: none;
	}
	:global(.leaflet-touch .leaflet-bar a) {
		border-color: var(--fg-primary);
		border-width: 2px;
	}

	:global(.marker-button) {
		text-decoration: underline solid;
		text-underline-offset: 0.2rem;
	}
</style>
