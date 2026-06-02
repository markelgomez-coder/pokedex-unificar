import type { Pokemon } from "./tipos.js";

export function obtenerDreamTeamDesdeStorage(
  listaPokemon: Pokemon[],
): Pokemon[] {
  const storageValue = localStorage.getItem("dream-team");

  if (!storageValue) return [];

  try {
    const nombres: string[] = JSON.parse(storageValue);

    return listaPokemon.filter((pokemon) => nombres.includes(pokemon.nombre));
  } catch {
    return [];
  }
}
