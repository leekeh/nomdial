export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			countries: {
				Row: {
					iso_code: string;
					iso_name: string | null;
				};
				Insert: {
					iso_code: string;
					iso_name?: string | null;
				};
				Update: {
					iso_code?: string;
					iso_name?: string | null;
				};
				Relationships: [];
			};
			cuisine_restaurants: {
				Row: {
					cuisine_id: number;
					id: number;
					restaurant_id: number;
				};
				Insert: {
					cuisine_id: number;
					id?: number;
					restaurant_id: number;
				};
				Update: {
					cuisine_id?: number;
					id?: number;
					restaurant_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Rel Cuisine Restaurants_cuisine_id_fkey';
						columns: ['cuisine_id'];
						isOneToOne: false;
						referencedRelation: 'cuisines';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Rel Cuisine Restaurants_restaurant_id_fkey';
						columns: ['restaurant_id'];
						isOneToOne: false;
						referencedRelation: 'restaurants';
						referencedColumns: ['id'];
					}
				];
			};
			cuisines: {
				Row: {
					created_at: string;
					id: number;
					name: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					name: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			'geocoding-cache': {
				Row: {
					query: string;
					result: Json;
				};
				Insert: {
					query: string;
					result: Json;
				};
				Update: {
					query?: string;
					result?: Json;
				};
				Relationships: [];
			};
			restaurants: {
				Row: {
					address_lines: string[] | null;
					city: string | null;
					country_code: string;
					created_at: string;
					description: string | null;
					id: number;
					location: unknown;
					maps_id: string | null;
					name: string;
					osm_id: number | null;
					website: string | null;
				};
				Insert: {
					address_lines?: string[] | null;
					city?: string | null;
					country_code: string;
					created_at?: string;
					description?: string | null;
					id?: number;
					location: unknown;
					maps_id?: string | null;
					name: string;
					osm_id?: number | null;
					website?: string | null;
				};
				Update: {
					address_lines?: string[] | null;
					city?: string | null;
					country_code?: string;
					created_at?: string;
					description?: string | null;
					id?: number;
					location?: unknown;
					maps_id?: string | null;
					name?: string;
					osm_id?: number | null;
					website?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'restaurants_country_code_fkey';
						columns: ['country_code'];
						isOneToOne: false;
						referencedRelation: 'countries';
						referencedColumns: ['iso_code'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			nearby_restaurants:
				| {
						Args: {
							lat: number;
							lon: number;
						};
						Returns: {
							id: number;
							name: string;
							lat: number;
							long: number;
							dist_meters: number;
							city: string;
							website: string;
							maps_id: string;
							address_lines: string[];
							cuisines: string[];
						}[];
				  }
				| {
						Args: {
							lat: number;
							lon: number;
							cuisine_filter: string;
						};
						Returns: {
							id: number;
							name: string;
							lat: number;
							long: number;
							dist_meters: number;
							city: string;
							website: string;
							maps_id: string;
							address_lines: string[];
							cuisines: string[];
						}[];
				  }
				| {
						Args: {
							lat: number;
							lon: number;
							cuisine_filter: string;
							maxdist: number;
						};
						Returns: {
							id: number;
							name: string;
							lat: number;
							long: number;
							dist_meters: number;
							city: string;
							website: string;
							maps_id: string;
							address_lines: string[];
							cuisines: string[];
						}[];
				  }
				| {
						Args: {
							lat: number;
							lon: number;
							maxdist: number;
						};
						Returns: {
							id: number;
							name: string;
							lat: number;
							long: number;
							dist_meters: number;
							city: string;
							website: string;
							maps_id: string;
							address_lines: string[];
							cuisines: string[];
						}[];
				  };
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];
