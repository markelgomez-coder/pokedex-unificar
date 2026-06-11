import type { Pokemon } from "../../ts/tipos";

export interface PokemonRepository {
  obtenerTodos(): Promise<Pokemon[]>;
}
