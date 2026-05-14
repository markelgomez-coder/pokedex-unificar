import * as funcionesGenerales from "./funciones-generales.js";
import * as datosGenerales from "./datos-generales.js";
import * as funcionesStorage from "./storage-funciones.js";
import * as mostrarHTML from "./mostrar-html.js";
import * as funcionesPokedex from "./pokedex.js";
import * as funcionesDreamTeam from "./dream-team.js";

import type { Pokemon } from "./tipos";

let timeoutId: ReturnType<typeof window.setTimeout> | null = null;

if (window.location.pathname.endsWith("pokedex.html")) {
  main();
}

function main() {
  mostrarHTML.mostrarCartasVacias();
  funcionesGenerales.setPokemonsPokedex();
}

document.addEventListener("keyup", (e) => {
  const container = document.getElementById("resultado-busqueda");
  const target = e.target as HTMLInputElement;
  if (target != null && container != null) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      if (target.matches("#input-busqueda")) {
        const value = target.value;

        if (value === "") {
          funcionesGenerales.vaciarHtmlConId("resultado-busqueda");
          funcionesPokedex.ensenarCartas(datosGenerales.listaPokemon);
        } else {
          const tipoDato = funcionesGenerales.sacarTipoDato(value);
          funcionesGenerales.vaciarHtmlConId("resultado-busqueda");
          switch (tipoDato) {
            case "tipo":
              filtraPorTipo(value);
              break;
            case "numero":
              filtraPorNumero(value);
              break;
            case "nombre":
              filtraPorNombre(value);
              break;
          }
        }
      }
    }, 1000);
  }
});

export function filtraPorTipo(value: string) {
  const filtrados: Array<Pokemon> = [];
  datosGenerales.listaPokemon.forEach((pokemon) => {
    if (pokemon.tipos.includes(value)) {
      filtrados.push(pokemon);
    }
  });
  funcionesPokedex.ensenarCartas(filtrados);
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
  ensenarCartas(filtrados);
  return filtrados;
}

export function filtraPorNombre(value: string) {
  const filtrados: Array<Pokemon> = [];
  datosGenerales.listaPokemon.forEach((pokemon) => {
    if (pokemon.nombre.includes(value)) {
      filtrados.push(pokemon);
    }
  });
  funcionesPokedex.ensenarCartas(filtrados);
  return filtrados;
}

export function ensenarCartas(pokemons: Array<Pokemon>) {
  funcionesStorage.cargarDreamTeamDesdeStorage();
  let html = "";
  const container = document.getElementById("resultado-busqueda");
  let gogokoa = false;
  if (pokemons.length === 0) {
    mostrarHTML.mostrarNoHayResultado();
  } else {
    pokemons.forEach((pokemon) => {
      if (datosGenerales.dreamTeam.includes(pokemon)) gogokoa = true;
      html += mostrarHTML.mostrarPokemon(pokemon, gogokoa);
      gogokoa = false;
    });
    if (container != null) {
      funcionesGenerales.meterAlHtmlConId("resultado-busqueda", html);
    }
  }
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
