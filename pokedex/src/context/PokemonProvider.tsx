import { type ReactNode, useEffect, useState } from "react";
import { PokemonContext } from "./PokemonContext";
import * as funcionesGenerales from "../ts/funciones-generales.js";
import type { Pokemon } from "../ts/tipos.js";

interface PokemonProviderProps {
  children: ReactNode;
}

export function PokemonProvider({
  children,
}: PokemonProviderProps) {
  const [listaPokemon, setListaPokemon] = useState<Pokemon[]>([]);
  const [listaDreamTeam, setListaDreamTeam] = useState<Pokemon[]>([]);

  useEffect(() => {
    inicializar();
  }, []);

  async function inicializar() {
    const pokemon = await obtenerListaPokemon();
    const dreamTeam = await obtenerListaDreamTeam();

    setListaPokemon(pokemon);
    setListaDreamTeam(dreamTeam);
  }

  return (
    <PokemonContext.Provider
      value={{
        listaPokemon,
        setListaPokemon,
        listaDreamTeam,
        setListaDreamTeam,
        inicializar,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
}

async function obtenerListaPokemon(): Promise<Pokemon[]> {
  return await funcionesGenerales.obtenerTodosLosPokemons();
}

async function obtenerListaDreamTeam(): Promise<Pokemon[]> {
  return [];
}