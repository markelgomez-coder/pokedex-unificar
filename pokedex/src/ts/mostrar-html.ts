import * as funcionesGenerales from "./funciones-generales.js";

import { Pokemon } from "./tipos";

export function mostrarPokemon(pokemon: Pokemon, dreamTeam: boolean) {
  const htmlDreamTeam = `
  <div class="icono-dream-team-vector2 ${dreamTeam ? "activo" : ""}"></div>`;
  return `
      <a class="carta-pokemon ${pokemon.tipos[0]}">
            <header>
              <p class="pokemon-name">${pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</p>
              <p class="pokemon-number">${funcionesGenerales.formatearNumero(pokemon.numero)}</p>
            </header>
            <img
              class="pokemon-image"
              src="${pokemon.imagen}"
              alt="Imagen ${pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}"
            />
            <div class="pokemon-info">
              <div class="icono-dream-team">
                <div class="icono-dream-team-interior">
                  <div class="icono-dream-team-vector1"></div>
                  ${htmlDreamTeam}
                </div>
              </div>
              <div class="tipo-pokemon">
                ${pokemon.tipos
                  .map(
                    (tipo) => `
                  <div class="icono-tipo ${tipo}">
                    <p class="texto-tipo">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</p>
                  </div>`,
                  )
                  .join("")}
              </div>
              <div class="medidas-pokemon">
                <div class="icono-peso"></div>
                <p>${pokemon.peso} Kg</p>
                <div class="separador-tipos"></div>
                <div class="icono-altura"></div>
                <p>${pokemon.altura} m</p>
              </div>
              <div class="estadisticas-pokemon">
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">HP</p>
                    <p class="estadistica-valor">${pokemon.hp}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.hp / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">ATK</p>
                    <p class="estadistica-valor">${pokemon.atk}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.atk / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">DEF</p>
                    <p class="estadistica-valor">${pokemon.def}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.def / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SAT</p>
                    <p class="estadistica-valor">${pokemon.sat}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.sat / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SDF</p>
                    <p class="estadistica-valor">${pokemon.sdf}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.sdf / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SPD</p>
                    <p class="estadistica-valor">${pokemon.spd}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.spd / 255) - 16 + "px"}"></div>
                </div>
              </div>
            </div>
          </a>
      `;
}

export function mostrarCartasVacias() {
  const container = document.getElementById("resultado-busqueda");

  if (container != null) {
    funcionesGenerales.vaciarHtmlConId("resultado-busqueda");

    let vaciasHtml = "";

    for (let i = 0; i < 9; i++) {
      vaciasHtml += `
      <div class="carta-pokemon-vacia">
        <div class="carta-pokemon-vacia-interior"> 
          <div class="carta-pokemon-vacia-icono-interior">
            <div class="carta-pokemon-vacia-icono-interior-circulo-fuera"></div>
            <div class="carta-pokemon-vacia-icono-interior-circulo-dentro"></div>
            <div class="carta-pokemon-vacia-icono-interior-linea-derecha"></div>
            <div class="carta-pokemon-vacia-icono-interior-linea-izquierda"></div>
          </div>
        </div>
      </div>
      `;
    }

    funcionesGenerales.meterAlHtmlConId("resultado-busqueda", vaciasHtml);
  }
}

export function mostrarNoHayResultado() {
  const container = document.getElementById("resultado-busqueda");
  const input = document.getElementById("input-busqueda") as HTMLInputElement;

  let htmlNoHayResultado = `
    <div class="no-hay-resultado">
      <div class="icono-no-hay-resultado">
        <div class="icono-no-hay-resultado-interior"></div>
        <div class="icono-no-hay-resultado-vector1"></div>
        <div class="icono-no-hay-resultado-vector2"></div>
        <div class="icono-no-hay-resultado-vector3"></div>
        <div class="icono-no-hay-resultado-vector4"></div>
        <div class="icono-no-hay-resultado-vector5"></div>
      </div>
      <p> There is no results for "${input.value}" </p>
    </div>
    `;

  if (container != null) {
    funcionesGenerales.vaciarHtmlConId("resultado-busqueda");
    funcionesGenerales.meterAlHtmlConId(
      "resultado-busqueda",
      htmlNoHayResultado,
    );
  }
}

export function mostrarErrorAPI() {
  const container = document.getElementById("resultado-busqueda");
  
  const htmlErrorAPI = `
  <div class="error-api-pokemon">
    <div class="icono-error-api-pokemon">
      <div class="icono-error-api-pokemon-interior"></div>
      <div class="icono-error-api-pokemon-vector1"></div>
      <div class="icono-error-api-pokemon-vector2"></div>
      <div class="icono-error-api-pokemon-vector3"></div>
      <div class="icono-error-api-pokemon-vector4"></div>
    </div>
    <p> An error ocurred getting Pokemons.</p>
    <p> <br>Please try later</p>
  </div>
  `;


  if (container != null){
    funcionesGenerales.vaciarHtmlConId("resultado-busqueda");
    funcionesGenerales.meterAlHtmlConId(
      "resultado-busqueda",
      htmlErrorAPI,
    );
  }}
