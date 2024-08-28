type Props = {
	name?: string;
	maps_id?: string | null;
};

export function createNavigationLink({ maps_id, name }: Props) {
	return `https://www.google.com/maps/dir/?api=1&destination=${name}${maps_id ? `&destination_place_id=${maps_id}` : ''}`;
}
