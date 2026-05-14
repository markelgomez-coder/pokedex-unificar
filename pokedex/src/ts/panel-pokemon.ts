import * as funcionesGenerales from "./funciones-generales.js";
import * as datosGenerales from "./datos-generales.js";
import * as funcionesAPI from "./funciones-API.js";
import * as funcionesDreamTeam from "./dream-team.js";
import * as funcionesPokedex from "./pokedex.js";
import * as mostrarHTML from "./mostrar-html.js";

import type { DanoPokemon, Pokemon } from "./tipos";

const numeroPokemon = new URLSearchParams(window.location.search).get(
  "pokemon",
);

if (numeroPokemon != null)
  funcionesAPI.obtenerPokemon(numeroPokemon).then(async (pokemon: Pokemon) => {
    await funcionesGenerales.setPokemonsDreamTeam();

    let gogokoa: boolean = false;
    gogokoa = funcionesGenerales.pokemonDentroDeLaLista(
      datosGenerales.dreamTeam,
      pokemon,
    );

    let html = mostrarHTML.mostrarPokemon(pokemon, gogokoa);
    const container = document.getElementById("panel-pokemon-izquierda");

    const descripcion =
      await funcionesAPI.obtenerPokemonDescripcion(numeroPokemon);
    const dobleDano = await funcionesAPI.obtenerDebilidadPokemon(numeroPokemon);
    const mitadDano =
      await funcionesAPI.obtenerResistenciaPokemon(numeroPokemon);
    const noDano = await funcionesAPI.obtenerInmunidadPokemon(numeroPokemon);
    const evolucionesLink =
      await funcionesAPI.obtenerPokemonEvolucionesLink(numeroPokemon);
    const evolucion =
      await funcionesAPI.obtenerPokemonEvoluciones(evolucionesLink);

    const evoluciones = await Promise.all(
      evolucion.map((evo: Pokemon) => funcionesAPI.obtenerPokemon(evo.nombre)),
    );
    if (container != null) {
      funcionesGenerales.meterAlHtmlConId("panel-pokemon-izquierda", html);
    }
    mostrarPanelDerecha(descripcion, dobleDano, mitadDano, noDano, evoluciones);
  });

async function mostrarPanelDerecha(
  descripcion: string,
  dobleDano: Array<DanoPokemon>,
  mitadDano: Array<DanoPokemon>,
  noDano: Array<DanoPokemon>,
  evoluciones: Array<Pokemon>,
) {
  const dobleDanoHTML = dobleDano
    .map(
      (d: DanoPokemon) =>
        `<span class="dano ${d.name}">${d.name.charAt(0).toUpperCase() + d.name.slice(1)}</span>`,
    )
    .join("");

  const mitadDanoHTML = mitadDano
    .map(
      (d: DanoPokemon) =>
        `<span class="dano ${d.name}">${d.name.charAt(0).toUpperCase() + d.name.slice(1)}</span>`,
    )
    .join("");

  const noDanoHTML = noDano
    .map(
      (d: DanoPokemon) =>
        `<span class="dano ${d.name}">${d.name.charAt(0).toUpperCase() + d.name.slice(1)}</span>`,
    )
    .join("");

  const container = document.getElementById("panel-pokemon-derecha");

  if (container != null) {
    container.innerHTML += `
    <p class="descripcion-pokemon">${descripcion}</p>

    <p class="subtitulo-panel-pokemon">Evoluciones</p>
    <div class="panel-evoluciones">
      ${evoluciones
        .map(
          (evo: Pokemon) => `
      <a class="evolucion-pokemon" href="panel-pokemon.html?pokemon=${evo.nombre}">
        <img src=${evo.imagen}>
        <p class="evolucion-pokemon-nombre">${evo.nombre.charAt(0).toUpperCase() + evo.nombre.slice(1)}</p>
      </a>`,
        )
        .join("")}
    </div>

    <p class="subtitulo-panel-pokemon">Debilidades</p>
    <div class="panel-debilidades">
      <div class="panel-doble-dano">
        <p class="debilidades-subtitulo"> DEBILIDAD </p>
        <div class="tipos-dano">
        ${dobleDanoHTML}
        </div>
      </div>
      <div class="panel-mitad-dano">
        <p class="debilidades-subtitulo"> RESISTENCIA </p>
        <div class="tipos-dano">
        ${mitadDanoHTML}
        </div>
      </div>
      <div class="panel-no-dano">
        <p class="debilidades-subtitulo"> INMUNIDAD </p>
        <div class="tipos-dano">
        ${noDanoHTML}
        </div>
      </div>
      
    </div>
  `;
  }
}

if (window.location.pathname.endsWith("panel-pokemon.html")) {
  document.addEventListener("click", (e) => {
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
          funcionesPokedex.irPanelPokemon(
            nombrePokemon.textContent.toLowerCase(),
          );
        }
      }
    }
  });
}
