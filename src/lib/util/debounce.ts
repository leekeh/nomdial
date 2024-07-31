export function debounce(callback: () => void, delay: number = 500) {
	let timer: NodeJS.Timeout;
	return function () {
		clearTimeout(timer);
		timer = setTimeout(() => {
			callback();
		}, delay);
	};
}
