import { createContext } from "react";
import type { Pokemon } from "../../ts/tipos";

export interface PokemonContextType {
  listaPokemon: Pokemon[];
  listaDreamTeam: Pokemon[];

  setListaPokemon: React.Dispatch<React.SetStateAction<Pokemon[]>>;

  meterAlDreamTeam: (pokemon: Pokemon) => void;

  inicializar: () => Promise<void>;
}

export const PokemonContext = createContext<
  PokemonContextType | undefined
>(undefined);
