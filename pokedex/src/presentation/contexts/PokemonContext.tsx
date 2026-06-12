import { createContext } from "react";
import type { Pokemon } from "../../domain/entities/pokemon";

export interface PokemonContextType {
  listaPokemon: Pokemon[];
  listaDreamTeam: Pokemon[];
  inicializar: () => Promise<void>;
  obtenerPokemonDetalle: (nombre: string) => Promise<Pokemon | null>;
  meterAlDreamTeam: (pokemon: Pokemon) => void;
}

export const PokemonContext = createContext<
  PokemonContextType | undefined
>(undefined);
