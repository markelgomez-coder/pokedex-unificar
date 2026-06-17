import { type ReactNode, useEffect, useState, useCallback } from "react";
import { PokemonContext } from "./PokemonContext.js";
import type { Pokemon } from "../../domain/entities/pokemon";
import type { PokemonRepository } from "../../domain/ports/pokemonRepository";
import type { DreamTeamStorage } from "../../domain/ports/storage";
import {
  cargarInicial,
  persistirDreamTeam,
  toggleDreamTeamList,
} from "../../application/usecases/pokemonUsecases";
import { obtenerPokemonDetalle } from "../../application/usecases/pokemonUsecases";

interface PokemonProviderProps {
  children: ReactNode;
  pokemonRepository: PokemonRepository;
  dreamTeamStorage: DreamTeamStorage;
}

export function PokemonProvider({
  children,
  pokemonRepository,
  dreamTeamStorage,
}: PokemonProviderProps) {
  const [listaPokemon, setListaPokemon] = useState<Pokemon[]>([]);
  const [listaDreamTeam, setListaDreamTeam] = useState<Pokemon[]>([]);

  const [inicializado, setInicializado] = useState(false);

  const inicializar = useCallback(async () => {
    const { pokemons, dreamTeam } = await cargarInicial(
      pokemonRepository,
      dreamTeamStorage,
    );

    setListaPokemon(pokemons);
    setListaDreamTeam(dreamTeam);

    setInicializado(true);
  }, [pokemonRepository, dreamTeamStorage]);

  useEffect(() => {
    void Promise.resolve().then(() => inicializar());
  }, [inicializar]);

  useEffect(() => {
    if (!inicializado) return;

    persistirDreamTeam(dreamTeamStorage, listaDreamTeam);
  }, [listaDreamTeam, inicializado, dreamTeamStorage]);

  

  function meterAlDreamTeam(nuevo: Pokemon) {
    setListaDreamTeam((prev) => toggleDreamTeamList(prev, nuevo));
  }

  async function obtenerDetalle(nombre: string): Promise<Pokemon | null> {
    return await obtenerPokemonDetalle(pokemonRepository, nombre);
  }

  return (
    <PokemonContext.Provider
      value={{
        listaPokemon,
        listaDreamTeam,
        meterAlDreamTeam,
        inicializar,
        obtenerPokemonDetalle: obtenerDetalle,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
}
