import { createContext } from "react";
import type { Pokemon } from "../ts/tipos.js";

export interface PokemonContextType {
  listaPokemon: Pokemon[];
  listaDreamTeam: Pokemon[];

  setListaPokemon: React.Dispatch<React.SetStateAction<Pokemon[]>>;
  setListaDreamTeam: React.Dispatch<React.SetStateAction<Pokemon[]>>;

  inicializar: () => Promise<void>;
}

export const PokemonContext = createContext<
  PokemonContextType | undefined
>(undefined);