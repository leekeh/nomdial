<script lang="ts">
	import type { Map } from '@types/leaflet';
	import { onMount } from 'svelte';
	import type { Coordinates } from 'types';
	import Layout from './+layout.svelte';

	type Props = {
		points: Array<{ id: string } & Coordinates>;
		focus: Coordinates;
	};
	let { focus, points }: Props = $props();

	let map = $state<Map>();
	onMount(() => {
		map = L.map('map').setView([focus.lat, focus.lon], 13);
		L.tileLayer(
			'https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg',
			{
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}
		).addTo(map);
	});

	$effect(() => {
		if (map === undefined) return;
		points.forEach((point) => {
			const marker = L.marker([point.lat, point.lon]).addTo(map);
			marker.addEventListener('click', () => {
				console.log('click');
				document.getElementById(point.id)?.scrollIntoView({ behavior: 'smooth' });
			});
		});
	});
</script>

<div class="mapContainer">
	<div id="map">{map}</div>
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
		height: 450px;
	}
</style>
