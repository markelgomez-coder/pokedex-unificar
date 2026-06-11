import type { Pokemon } from "../ts/tipos";
import type { PokemonRepository } from "../domain/ports/pokemonRepository";
import * as funcionesGenerales from "../ts/funciones-generales";

export const pokemonRepository: PokemonRepository = {
  async obtenerTodos(): Promise<Pokemon[]> {
    return await funcionesGenerales.obtenerTodosLosPokemons();
  },
};
