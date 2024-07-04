export function createRestaurantId(id: number) {
	return `restaurant-${id}`;
}

export function zoomRestaurant(id: number) {
	document.dispatchEvent(new CustomEvent('panMap', { detail: id }));
	document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
}

export function formatDistance(dist: number) {
	const formattedDistance =
		dist > 1000
			? new Intl.NumberFormat('en', {
					style: 'unit',
					unit: 'kilometer',
					maximumFractionDigits: 0
				}).format(dist / 1000)
			: new Intl.NumberFormat('en', {
					style: 'unit',
					unit: 'meter',
					maximumFractionDigits: 0
				}).format(dist);

	return `${formattedDistance} away`;
}

const conjoinFormatter = new Intl.ListFormat('en', {
	style: 'long',
	type: 'conjunction'
});
export function formatConjunction(list: string[]) {
	return conjoinFormatter.format(list);
}
