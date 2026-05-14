import * as funcionesGenerales from "./funciones-generales.js";
import * as datosGenerales from "./datos-generales.js";

import type { Pokemon } from "./tipos";

mostrarDreamTeam();

function mostrarDreamTeam() {
  funcionesGenerales.setPokemonsDreamTeam().then(() => {
    pokemonGrandeDreamTeam();
    pokemonPequenoDreamTeam();
  });
}

function pokemonGrandeDreamTeam() {
  const contenedorGrande = document.getElementById("dream-team-grandes");
  funcionesGenerales.vaciarHtmlConId("dream-team-grandes");
  const dreamTeamOrdenadoTamano = [...datosGenerales.dreamTeam].sort(
    (a, b) => a.altura - b.altura,
  );
  if (contenedorGrande != null) {
    const posiciones = [
      { x: -120, y: 120 },
      { x: 0, y: 140 },
      { x: 120, y: 120 },
      { x: -70, y: 20 },
      { x: 70, y: 20 },
      { x: 0, y: 70 },
    ];

    const htmlGrande = dreamTeamOrdenadoTamano
      .map((p: Pokemon, index: number) => {
        const pos = posiciones[index];

        let inicial = 25;
        let suma = 1.25;

        if (p.peso >= 100) {
          inicial = 150;
          suma = 0.2;
        }

        return `<img 
      class="dream-team-grandes-img" 
      src="${p.imagen}" 
      style="
        position: absolute;
        width: calc(${inicial}px + ${suma} * ${p.peso}px);
        left: calc(50% + ${pos.x}px);
        bottom: calc(${pos.y}px);
        z-index: ${6 - index};
        transform: translate(-50%, -50%);
      " 
    />`;
      })
      .join("");

    funcionesGenerales.meterAlHtmlConId("dream-team-grandes", htmlGrande);
  }
}

function pokemonPequenoDreamTeam() {
  const contenedorPequeno = document.getElementById("dream-team-pequenos");
  const dreamTeamOrdenadoNumero = [...datosGenerales.dreamTeam].sort(
    (a, b) => a.numero - b.numero,
  );

  if (contenedorPequeno != null) {
    const htmlPequeno = dreamTeamOrdenadoNumero
      .map(
        (p: Pokemon) =>
          ` 
        <div class="dream-team-pequenos-container">
          <img class="dream-team-pequenos-img" src="${p.imagen}" />
          <div id="${p.nombre}" class="eliminar-dream-team">
            <div class="eliminar-dream-team-icono-1"> </div>
            <div class="eliminar-dream-team-icono-2"> </div>
            <div class="eliminar-dream-team-icono-3"> </div>
          </div>
        </div>`,
      )
      .join("");

    funcionesGenerales.vaciarHtmlConId("dream-team-pequenos");
    funcionesGenerales.meterAlHtmlConId("dream-team-pequenos", htmlPequeno);
  }
}

document.addEventListener("click", (e) => {
  if (window.location.pathname.endsWith("dream-team.html")) {
    let target = e.target as HTMLElement;

    if (
      target.classList.contains("eliminar-dream-team") ||
      target.classList.contains("eliminar-dream-team-icono-1") ||
      target.classList.contains("eliminar-dream-team-icono-2") ||
      target.classList.contains("eliminar-dream-team-icono-3")
    ) {
      if (!target.classList.contains("eliminar-dream-team")) {
        target = target.closest(".eliminar-dream-team") as HTMLElement;
      }

      const pokemon = funcionesGenerales.sacarPokemonDeListaConElNombre(
        target.id,
        datosGenerales.listaPokemon,
      );
      if (pokemon) {
        funcionesGenerales.quitarDelDreamTeam(pokemon);
        pokemonGrandeDreamTeam();
        pokemonPequenoDreamTeam();
      }
    }
  }
});

export function modificarPokemonDreamTeamDesdeCarta(
  nombre: string,
  icono: HTMLElement,
) {
  const pokemon = datosGenerales.listaPokemon.find((p) => p.nombre === nombre);
  datosGenerales.quitarRepetidosDreamTeam();

  if (
    pokemon != null &&
    !datosGenerales.dreamTeam.includes(pokemon) &&
    datosGenerales.dreamTeam.length < datosGenerales.maxDreamTeam
  ) {
    sumarAlDreamTeamDesdeCarta(pokemon, icono);
  } else if (pokemon != null && datosGenerales.dreamTeam.includes(pokemon)) {
    quitarDelDreamTeamDesdeCarta(pokemon, icono);
  }
}

export function sumarAlDreamTeamDesdeCarta(
  pokemon: Pokemon,
  icono: HTMLElement,
) {
  funcionesGenerales.sumarAlDreamTeam(pokemon);
  icono.classList.add("activo");
}

export function quitarDelDreamTeamDesdeCarta(
  pokemon: Pokemon,
  icono: HTMLElement,
) {
  funcionesGenerales.quitarDelDreamTeam(pokemon);
  icono.classList.remove("activo");
}
