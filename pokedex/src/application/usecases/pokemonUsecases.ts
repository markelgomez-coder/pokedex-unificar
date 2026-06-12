import type { Pokemon } from "../../domain/entities/pokemon";
import type { PokemonRepository } from "../../domain/ports/pokemonRepository";
import type { DreamTeamStorage } from "../../domain/ports/storage";

export async function cargarInicial(
  pokemonRepository: PokemonRepository,
  dreamTeamStorage: DreamTeamStorage,
): Promise<{ pokemons: Pokemon[]; dreamTeam: Pokemon[] }> {
  const pokemons = await pokemonRepository.obtenerTodos();

  const ids = dreamTeamStorage.get();

  const dreamTeam = ids
    ? pokemons.filter((p) => ids.includes(p.numero))
    : [];

  return { pokemons, dreamTeam };
}

export function toggleDreamTeamList(
  current: Pokemon[],
  nuevo: Pokemon,
): Pokemon[] {
  const existe = current.some((p) => p.numero === nuevo.numero);

  if (existe) return current.filter((p) => p.numero !== nuevo.numero);
  if (!existe && current.length < 6) return [...current, nuevo];
  return current;
}

export function persistirDreamTeam(
  dreamTeamStorage: DreamTeamStorage,
  lista: Pokemon[],
): void {
  const ids = lista.map((p) => p.numero);
  dreamTeamStorage.set(ids);
}

export async function obtenerPokemonDetalle(
  pokemonRepository: PokemonRepository,
  nombre: string,
): Promise<Pokemon | null> {
  return await pokemonRepository.obtenerPorNombre(nombre);
}
