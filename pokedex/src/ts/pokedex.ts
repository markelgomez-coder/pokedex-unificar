import * as funcionesGenerales from "./funciones-generales.js";

import type { Pokemon } from "./tipos";

export function filtrarPokemons(value: string, listaPokemon: Pokemon[]) {
  if (value === "") {
    return  listaPokemon;
  } else {
    const tipoDato = funcionesGenerales.sacarTipoDato(value);
    switch (tipoDato) {
      case "tipo":
        return filtraPorTipo(value, listaPokemon);
      case "numero":
        return filtraPorNumero(value, listaPokemon);
      case "nombre":
        return filtraPorNombre(value, listaPokemon);
    }
  }
}

export function filtraPorTipo(value: string, listaPokemon: Pokemon[]) {
  const filtrados: Array<Pokemon> = [];
  listaPokemon.forEach((pokemon) => {
    if (pokemon.tipos.includes(value)) {
      filtrados.push(pokemon);
    }
  });
  return filtrados;
}

export function filtraPorNumero(value: string, listaPokemon: Pokemon[]) {
  const filtrados: Array<Pokemon> = [];
  listaPokemon.forEach((pokemon) => {
    if (value.charAt(0) === "#") {
      value = value.slice(1);
    }
    if (pokemon.numero.toString().includes(value)) {
      filtrados.push(pokemon);
    }
  });
  return filtrados;
}

export function filtraPorNombre(value: string, listaPokemon: Pokemon[]) {
  const filtrados: Array<Pokemon> = [];
  listaPokemon.forEach((pokemon) => {
    if (pokemon.nombre.includes(value)) {
      filtrados.push(pokemon);
    }
  });
  return filtrados;
}
