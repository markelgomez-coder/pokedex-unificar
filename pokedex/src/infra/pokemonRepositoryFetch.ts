import type { Pokemon } from "../domain/entities/pokemon";
import type { PokemonRepository } from "../domain/ports/pokemonRepository";
import * as funcionesGenerales from "../application/services/pokemonService";
import * as funcionesAPI from "./adapters/pokemonApi";

export const pokemonRepository: PokemonRepository = {
  async obtenerTodos(): Promise<Pokemon[]> {
    return await funcionesGenerales.obtenerTodosLosPokemons();
  },

  async obtenerPorNombre(nombre: string): Promise<Pokemon | null> {
    try {
      const p = await funcionesAPI.obtenerPokemon(nombre);
      return p;
    } catch {
      return null;
    }
  },
};
