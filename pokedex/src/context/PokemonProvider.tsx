import { type ReactNode, useEffect, useState } from "react";
import { PokemonContext } from "./PokemonContext";
import * as funcionesGenerales from "../ts/funciones-generales.js";
import type { Pokemon } from "../ts/tipos.js";
import { obtenerDreamTeamDesdeStorage } from "../ts/storage-funciones.js";

interface PokemonProviderProps {
  children: ReactNode;
}

export function PokemonProvider({ children }: PokemonProviderProps) {
  const [listaPokemon, setListaPokemon] = useState<Pokemon[]>([]);
  const [listaDreamTeam, setListaDreamTeam] = useState<Pokemon[]>([]);

  useEffect(() => {
    void inicializar();
  }, []);

  useEffect(() => {
    const nombres = listaDreamTeam.map((pokemon) => pokemon.nombre);

    localStorage.setItem("dream-team", JSON.stringify(nombres));
  }, [listaDreamTeam]);

  async function inicializar() {
    const pokemon = await obtenerListaPokemon();

    setListaPokemon(pokemon);

    const dreamTeam = obtenerDreamTeamDesdeStorage(pokemon);

    setListaDreamTeam(dreamTeam);
  }

  function agregarADreamTeam(pokemon: Pokemon) {
    setListaDreamTeam((prev) => {
      const existe = prev.some((p) => p.nombre === pokemon.nombre);

      if (existe || prev.length >= 6) return prev;

      pokemon.dream_team = true;

      return [...prev, pokemon];
    });
  }

  function eliminarDeDreamTeam(nombre: string) {
    setListaDreamTeam((prev) =>
      prev.filter((pokemon) => pokemon.nombre !== nombre),
    );
    const pokemon = listaPokemon.find((p) => p.nombre === nombre);
    if (pokemon) {
      pokemon.dream_team = false;
    }
  }

  return (
    <PokemonContext.Provider
      value={{
        listaPokemon,
        setListaPokemon,
        listaDreamTeam,
        agregarADreamTeam,
        eliminarDeDreamTeam,
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
