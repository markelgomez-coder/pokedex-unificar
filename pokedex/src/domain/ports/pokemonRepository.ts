import type { Pokemon } from "../entities/pokemon";

export interface PokemonRepository {
  obtenerTodos(): Promise<Pokemon[]>;
  obtenerPorNombre(nombre: string): Promise<Pokemon | null>;
}
