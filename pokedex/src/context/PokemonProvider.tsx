import { type ReactNode, useEffect, useState } from "react";
import { PokemonContext } from "./PokemonContext";
import * as funcionesGenerales from "../ts/funciones-generales";
import type { Pokemon } from "../ts/tipos.js";
import { obtenerDreamTeamDesdeStorage } from "../ts/storage-funciones";

interface PokemonProviderProps {
  children: ReactNode;
}

export function PokemonProvider({ children }: PokemonProviderProps) {
  const [listaPokemon, setListaPokemon] = useState<Pokemon[]>([]);
  const [listaDreamTeam, setListaDreamTeam] = useState<Pokemon[]>([]);

const [inicializado, setInicializado] = useState(false);

useEffect(() => {
  void inicializar();
}, []);

useEffect(() => {
  if (!inicializado) return;

  const nombres = listaDreamTeam.map((pokemon) => pokemon.nombre);

  localStorage.setItem("dream-team", JSON.stringify(nombres));
}, [listaDreamTeam, inicializado]);

async function inicializar() {
  const pokemon = await obtenerListaPokemon();

  setListaPokemon(pokemon);

  const dreamTeam = obtenerDreamTeamDesdeStorage(pokemon);

  setListaDreamTeam(dreamTeam);

  setInicializado(true);
}

  function meterAlDreamTeam(nuevo: Pokemon) {
    setListaDreamTeam((prev) => {
      const existe = prev.some((p) => p.nombre === nuevo.nombre);

      if (existe) {
        return prev.filter((pokemon) => pokemon.nombre !== nuevo.nombre);
      } else if (!existe && prev.length < 6) {
        return [...prev, nuevo];
      }
      return prev;
    });
  }

  return (
    <PokemonContext.Provider
      value={{
        listaPokemon,
        setListaPokemon,
        listaDreamTeam,
        meterAlDreamTeam,
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
