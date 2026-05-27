import * as funcionesGenerales from "./funciones-generales.js";
import * as datosGenerales from "./datos-generales.js";

import type { Pokemon } from "./tipos";

export function filtrarPokemons(value: string) {
  if (value === "") {
    return datosGenerales.listaPokemon;
  } else {
    const tipoDato = funcionesGenerales.sacarTipoDato(value);
    switch (tipoDato) {
      case "tipo":
        return filtraPorTipo(value);
      case "numero":
        return filtraPorNumero(value);
      case "nombre":
        return filtraPorNombre(value);
    }
  }
}

export function filtraPorTipo(value: string) {
  const filtrados: Array<Pokemon> = [];
  datosGenerales.listaPokemon.forEach((pokemon) => {
    if (pokemon.tipos.includes(value)) {
      filtrados.push(pokemon);
    }
  });
  return filtrados;
}

export function filtraPorNumero(value: string) {
  const filtrados: Array<Pokemon> = [];
  datosGenerales.listaPokemon.forEach((pokemon) => {
    if (value.charAt(0) === "#") {
      value = value.slice(1);
    }
    if (pokemon.numero.toString().includes(value)) {
      filtrados.push(pokemon);
    }
  });
  return filtrados;
}

export function filtraPorNombre(value: string) {
  const filtrados: Array<Pokemon> = [];
  datosGenerales.listaPokemon.forEach((pokemon) => {
    if (pokemon.nombre.includes(value)) {
      filtrados.push(pokemon);
    }
  });
  return filtrados;
}
