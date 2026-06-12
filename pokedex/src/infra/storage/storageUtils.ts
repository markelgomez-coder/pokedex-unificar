import type { Pokemon } from "../../domain/entities/pokemon";

export function obtenerDreamTeamDesdeStorage(
  listaPokemon: Pokemon[],
): Pokemon[] {
  const storageValue = localStorage.getItem("dream-team");

  if (!storageValue) return [];

  try {
    const ids: number[] = JSON.parse(storageValue);

    if (!Array.isArray(ids) || !ids.every((x) => typeof x === "number")) return [];

    return listaPokemon.filter((pokemon) => ids.includes(pokemon.numero));
  } catch {
    return [];
  }
}
