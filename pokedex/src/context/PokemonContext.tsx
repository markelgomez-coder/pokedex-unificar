import { createContext } from "react";
import type { Pokemon } from "../ts/tipos.js";

export interface PokemonContextType {
  listaPokemon: Pokemon[];
  listaDreamTeam: Pokemon[];

  setListaPokemon: React.Dispatch<React.SetStateAction<Pokemon[]>>;

  agregarADreamTeam: (pokemon: Pokemon) => void;
  eliminarDeDreamTeam: (nombre: string) => void;

  inicializar: () => Promise<void>;
}

export const PokemonContext = createContext<
  PokemonContextType | undefined
>(undefined);