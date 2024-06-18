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
						referencedRelation: 'cuisinerestaurants';
						referencedColumns: ['cuisine_id'];
					},
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
						referencedRelation: 'cuisinerestaurants';
						referencedColumns: ['restaurant_id'];
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
			restaurants: {
				Row: {
					address_lines: string[] | null;
					city: string | null;
					country_code: string;
					created_at: string;
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
			cuisinerestaurants: {
				Row: {
					cuisine_id: number | null;
					cuisine_name: string | null;
					restaurant_id: number | null;
					restaurant_name: string | null;
				};
				Relationships: [];
			};
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

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;
