import * as datosGenerales from "../../domain/constants/datos-generales";
import { hacerFetch } from "../../infra/http/fetch";

import type {
  Pokemon,
  PokemonAPI,
  TipoPokemon,
} from "../../domain/entities/pokemon";

export async function obtenerTodosLosPokemons(): Promise<Pokemon[]> {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=1025`;

  const data = await hacerFetch(url);

  const resultados = await Promise.allSettled(
    data.results.map(async (pokemon: PokemonAPI) => {
      const p = await hacerFetch(pokemon.url);

      const pokemonFormateado: Pokemon = {
        numero: p.id,
        nombre: p.name,

        tipos: p.types.map((t: TipoPokemon) => t.type.name),

        imagen:
          p.sprites.other?.["official-artwork"]?.front_default ??
          p.sprites.front_default ??
          "",

        hp: p.stats[0]?.base_stat ?? 0,
        atk: p.stats[1]?.base_stat ?? 0,
        def: p.stats[2]?.base_stat ?? 0,
        sat: p.stats[3]?.base_stat ?? 0,
        sdf: p.stats[4]?.base_stat ?? 0,
        spd: p.stats[5]?.base_stat ?? 0,

        peso: p.weight / 10,
        altura: p.height / 10,

        dream_team: false,
      };

      return pokemonFormateado;
    }),
  );

  return resultados
    .filter(
      (r): r is PromiseFulfilledResult<Pokemon> => r.status === "fulfilled",
    )
    .map((r) => r.value);
}

export function sacarTipoDato(value: string) {
  value = value.toLowerCase().trim();

  if (datosGenerales.tiposPokemon.includes(value)) {
    return "tipo";
  }
  if (/^#?\d+$/.test(value)) {
    return "numero";
  }
  return "nombre";
}

export function formatearNumero(numero: number) {
  if (numero < 10) {
    return "#00" + numero;
  }
  if (numero < 100) {
    return "#0" + numero;
  }
  return "#" + numero;
}
export function sacarPokemonDeListaConElNombre(
  nombre: string,
  lista: Array<Pokemon>,
) {
  return lista.find((p) => p.nombre === nombre);
}
export function pokemonDentroDeLaLista(
  lista: Array<Pokemon>,
  pokemon: Pokemon,
) {
  return lista.some((p) => p.nombre === pokemon.nombre);
}
