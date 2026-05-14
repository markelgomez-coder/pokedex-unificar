import { describe, it, expect, beforeEach } from "vitest";
import * as funcionesGenerales from "../js/src/ts/funciones-generales.js";
import * as datosGenerales from "../js/src/ts/datos-generales.js";

describe("Cambiar la lista de los pokemons en el dreamTeam", () => {
  beforeEach(() => {
    datosGenerales.VaciarDreamTeam();
    datosGenerales.dreamTeam.push({
      nombre: "charmander",
      numero: "004",
      tipos: ["fire"],
      dream_team: true,
    });
    datosGenerales.dreamTeam.push({
      nombre: "charmeleon",
      numero: "005",
      tipos: ["fire"],
      dream_team: true,
    });
  });

  it("Añadir un pokemon al dreamTeam", async () => {
    const pokemon = {
      nombre: "bulbasaur",
      numero: 1,
      imagen: "src",
      tipos: ["grass", "poison"],
      peso: 12,
      altura: 7,
      hp: 45,
      atk: 45,
      def: 45,
      sat: 45,
      sdf: 45,
      spd: 45,
      dream_team: false,
    };

    expect(datosGenerales.dreamTeam).not.toContainEqual(pokemon);
    funcionesGenerales.sumarAlDreamTeam(pokemon);
    expect(datosGenerales.dreamTeam).toContainEqual(pokemon);
  });

  it("Quitar un pokemon del dreamTeam", () => {
    const pokemon = {
      nombre: "charmander",
      numero: "004",
      tipos: ["fire"],
      dream_team: true,
    };

    console.log(datosGenerales.dreamTeam);
    expect(datosGenerales.dreamTeam).toContainEqual(pokemon);
    funcionesGenerales.quitarDelDreamTeam(pokemon);
    expect(datosGenerales.dreamTeam).not.toContainEqual(pokemon);
  });
});

describe("Modificar un html en concreto (vaciar o meter un html)", () => {
  it("Vaciar un html", () => {
    document.body.innerHTML = '<div id="uno"><div id="dos"><div id="tres"></div></div></div>';
    const resultadoEsperado = '<div id="uno"></div>';
    funcionesGenerales.vaciarHtmlConId("uno");
    expect(document.body.innerHTML).toBe(resultadoEsperado);
  });

    it("Añadir un elemento html a un html", () => {
    document.body.innerHTML = '<div id="uno"></div>';
    const htmlNuevo = '<div id="dos"></div>'
    const resultadoEsperado = '<div id="uno"><div id="dos"></div></div>';
    funcionesGenerales.meterAlHtmlConId("uno",htmlNuevo);
    expect(document.body.innerHTML).toBe(resultadoEsperado);
  });
});
