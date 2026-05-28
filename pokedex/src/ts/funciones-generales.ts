import * as datosGenerales from "./datos-generales.js";
import { hacerFetch } from "./fetch.js";
import * as funcionesAPI from "./funciones-API.js";
import * as funcionesStorage from "./storage-funciones.js";

import type {
  Pokemon,
  PokemonAPI,
  TipoPokemon,
} from "./tipos";

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

export async function setPokemonsPokedex() {
  let pokemonsGuardados: Array<Pokemon> = [];
  datosGenerales.VaciarListaPokemon();

  for (let i = 1; i <= 9; i++) {
    pokemonsGuardados.push(...(await obtenerGeneracion(i)));
    datosGenerales.listaPokemon.push(...pokemonsGuardados);
    funcionesStorage.cargarDreamTeamDesdeStorage();
    pokemonsGuardados = [];
  }

  datosGenerales.quitarRepetidosListaPokemon();
}

export async function setPokemonsDreamTeam() {
  let pokemonsGuardados: Array<Pokemon> = [];
  datosGenerales.VaciarListaPokemon();

  for (let i = 1; i <= 9; i++) {
    pokemonsGuardados.push(...(await obtenerGeneracion(i)));
    datosGenerales.listaPokemon.push(...pokemonsGuardados);
    pokemonsGuardados = [];
  }
  funcionesStorage.cargarDreamTeamDesdeStorage();
  datosGenerales.quitarRepetidosListaPokemon();
}

async function obtenerGeneracion(id: number) {
  const promesas = [];
  const pokemonsAnteriores: number = sacarPokemonsAnteriores(id);
  try {
    for (
      let i = pokemonsAnteriores;
      i <
      pokemonsAnteriores + datosGenerales.generaciones[id - 1].cantidadPokemon;
      i++
    ) {
      promesas.push(funcionesAPI.obtenerPokemon(String(i)));
    }

    const pokemons: Array<Pokemon> = await Promise.all(promesas);

    return pokemons;
  } catch (error) {
    console.error(error);
    return [1 as unknown as Pokemon];
  }
}

export function sumarAlDreamTeam(pokemon: Pokemon) {
  datosGenerales.dreamTeam.push(pokemon);
  pokemon.dream_team = true;
  funcionesStorage.guardarDreamTeamEnStorage();
}
export function quitarDelDreamTeam(pokemon: Pokemon) {
  const index = datosGenerales.dreamTeam.indexOf(pokemon);
  datosGenerales.dreamTeam.splice(index, 1);
  pokemon.dream_team = false;
  funcionesStorage.guardarDreamTeamEnStorage();
}

export function vaciarHtmlConId(htmlId: string) {
  const container = document.getElementById(htmlId);
  if (container != null) {
    container.innerHTML = "";
  }
}

export function meterAlHtmlConId(htmlId: string, html: string) {
  const container = document.getElementById(htmlId);
  if (container != null) {
    container.innerHTML += html;
  }
}

function sacarPokemonsAnteriores(id: number) {
  let pokemonsAnteriores = 0;
  for (let i = 1; i < id; i++) {
    pokemonsAnteriores += datosGenerales.generaciones[i - 1].cantidadPokemon;
  }
  if (pokemonsAnteriores === 0) {
    return 1;
  }
  return pokemonsAnteriores + 1;
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
