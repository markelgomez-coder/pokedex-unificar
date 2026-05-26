import * as funcionesGenerales from "./funciones-generales.js";
import * as datosGenerales from "./datos-generales.js";
import * as funcionesDreamTeam from "./dream-team.js";

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

document.addEventListener("click", (e) => {
  if (window.location.pathname.endsWith("pokedex.html")) {
    const target = e.target as HTMLElement;

    if (
      target.classList.contains("icono-dream-team-interior") ||
      target.classList.contains("icono-dream-team-vector1") ||
      target.classList.contains("icono-dream-team-vector2")
    ) {
      const card = target.closest(".carta-pokemon") as HTMLElement;

      if (card) {
        const nombrePokemon = card.querySelector(".pokemon-name");
        if (nombrePokemon) {
          const nombrePokemonMinusculas =
            nombrePokemon.textContent.toLowerCase();

          const icono = card.getElementsByClassName(
            "icono-dream-team-vector2",
          )[0] as HTMLElement;

          funcionesDreamTeam.modificarPokemonDreamTeamDesdeCarta(
            nombrePokemonMinusculas,
            icono,
          );
        }
      }
    } else if (
      target.classList.contains("carta-pokemon") ||
      target.classList.contains("pokemon-name") ||
      target.classList.contains("pokemon-image") ||
      target.classList.contains("pokemon-number") ||
      target.classList.contains("pokemon-info")
    ) {
      const card = target.closest(".carta-pokemon") as HTMLElement;

      if (card) {
        const nombrePokemon = card.querySelector(".pokemon-name");
        if (nombrePokemon) {
          irPanelPokemon(nombrePokemon.textContent.toLowerCase());
        }
      }
    }
  }
});

export function irPanelPokemon(id: string) {
  window.location.href = `panel-pokemon.html?pokemon=${id}`;
}
