import { useContext } from "react";
import { PokemonContext } from "./PokemonContext";

export function usePokemonContext() {
  const context = useContext(PokemonContext);

  if (!context) {
    throw new Error(
      "usePokemonContext debe usarse dentro de PokemonProvider"
    );
  }

  return context;
}