import { describe, it, expect, beforeEach, vi } from "vitest";
import * as funcionesPokedex from "../js/src/ts/pokedex.js";
import { hacerFetch } from "../js/src/ts/fetch.js";

vi.mock("../js/src/ts/datos-generales.js", async (importOriginal) => {
  const actual = await importOriginal();

  const listaPokemonMock = [
    { nombre: "bulbasaur", numero: "001", tipos: ["grass"] },
    { nombre: "charmander", numero: "004", tipos: ["fire"] },
    { nombre: "charmeleon", numero: "005", tipos: ["fire"] },
    { nombre: "charizard", numero: "006", tipos: ["fire", "flying"] },
    { nombre: "squirtle", numero: "007", tipos: ["water"] },
    { nombre: "pikachu", numero: "025", tipos: ["electric"] },
    { nombre: "raichu", numero: "026", tipos: ["electric"] },
  ];

  return {
    ...actual,
    listaPokemon: listaPokemonMock,
  };
});

const listaPokemonMock = [
  { nombre: "bulbasaur", numero: "001", tipos: ["grass"] },
  { nombre: "charmander", numero: "004", tipos: ["fire"] },
  { nombre: "charmeleon", numero: "005", tipos: ["fire"] },
  { nombre: "charizard", numero: "006", tipos: ["fire", "flying"] },
  { nombre: "squirtle", numero: "007", tipos: ["water"] },
  { nombre: "pikachu", numero: "025", tipos: ["electric"] },
  { nombre: "raichu", numero: "026", tipos: ["electric"] },
];

beforeEach(() => {
  document.body.innerHTML = `
    <input id="input-busqueda" value="" />
    <div id="resultado-busqueda"></div>
  `;
});

describe("Escribes algo correcto en el buscador", () => {
  it("Deja vacío el buscador (devuelve todos los Pokémon)", () => {
    const busqueda = "";

    const result = funcionesPokedex.filtraPorNombre(busqueda);

    expect(result).toEqual(listaPokemonMock);
  });

  it("Pone un nombre o parte del nombre", () => {
    const busqueda = "cha";

    const result = funcionesPokedex.filtraPorNombre(busqueda);

    expect(result.length).toBeGreaterThan(0);

    result.forEach((pokemon) => {
      expect(pokemon.nombre).toContain(busqueda);
    });
  });

  it("Pone un tipo de pokemon en el buscador", () => {
    const busqueda = "grass";

    const result = funcionesPokedex.filtraPorTipo(busqueda);

    expect(result.length).toBeGreaterThan(0);

    result.forEach((pokemon) => {
      expect(pokemon.tipos).toContain(busqueda);
    });
  });

  it("Pone un número sin #", () => {
    const busqueda = "02";

    const result = funcionesPokedex.filtraPorNumero(busqueda);

    expect(result.length).toBeGreaterThan(0);

    result.forEach((pokemon) => {
      expect(pokemon.numero).toContain(busqueda);
    });
  });

  it("Pone un número con #", () => {
    const busqueda = "#02";
    const busquedaSinHash = busqueda.replace("#", "");

    const result = funcionesPokedex.filtraPorNumero(busqueda);

    expect(result.length).toBeGreaterThan(0);

    result.forEach((pokemon) => {
      expect(pokemon.numero).toContain(busquedaSinHash);
    });
  });
});

describe("Escribes algo incorrecto en el buscador", () => {
  it("Nombre o texto que no existe", () => {
    const busqueda = "xyz";
    const input = document.getElementById("input-busqueda");

    if (input) input.value = busqueda;

    const filtro = funcionesPokedex.filtraPorNombre(busqueda);
    const result = document.getElementById("resultado-busqueda");

    expect(filtro).toEqual([]);
    expect(result).not.toBeNull();
    expect(result.innerHTML).toContain(`There is no results for "${busqueda}"`);
  });
});

describe("El API no responde a la busqueda y se pone el html de error de API", () => {
  it("El API falla y pone error en el html de la pokedex", async () => {
    
    const result = document.getElementById("resultado-busqueda");

    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon/1");
    } catch (error) {
      if (result) {
        expect(result.innerHTML).toContain(`An error ocurred getting Pokemons`);
      }
    }

  });
});
