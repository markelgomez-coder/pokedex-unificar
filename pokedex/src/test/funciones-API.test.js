import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  vi,
} from "vitest";

vi.mock("../js/src/ts/fetch.js", () => ({
  hacerFetch: vi.fn(),
}));

import * as funcionesAPI from "../js/src/ts/funciones-API.js";
import { hacerFetch } from "../js/src/ts/fetch.js";

describe("Obtener diferentes datos de la API", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Obtener pokemon", async () => {
    hacerFetch.mockResolvedValue({
      name: "bulbasaur",
      id: 1,
      sprites: {
        other: { "official-artwork": { front_default: "img.png" } },
      },
      types: [{ type: { name: "grass" } }],
      weight: 100,
      height: 10,
      stats: [
        { base_stat: 45 },
        { base_stat: 49 },
        { base_stat: 49 },
        { base_stat: 65 },
        { base_stat: 65 },
        { base_stat: 45 },
      ],
    });

    const result = await funcionesAPI.obtenerPokemon(1);

    expect(result.nombre).toBe("bulbasaur");
  });

  it("Obtener descripcion del pokemon correctamente", async () => {
    hacerFetch.mockResolvedValue({
      flavor_text_entries: [
        {
          flavor_text:
            "A strange seed was planted on its back at birth.\nThe plant sprouts and grows with this POKéMON.",
          language: { name: "en" },
        },
      ],
    });

    const result = await funcionesAPI.obtenerPokemonDescripcion(1);

    expect(result).toBe(
      "A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.",
    );
  });
  it("Obtener tipos del pokemon correctamente", async () => {
    hacerFetch.mockResolvedValue({
      types: [
        {
          type: {
            name: "grass",
            url: "https://bulbasaur/grass",
          },
        },
        {
          type: {
            name: "poison",
            url: "https://bulbasaur/poison",
          },
        },
      ],
    });

    const result = await funcionesAPI.obtenerPokemonTipos(1);

    expect(result.tipos.length).toBeGreaterThan(0);
    expect(result.tipos_url.length).toBeGreaterThan(0);
    expect(result.tipos_url.length).toBe(result.tipos.length);

    expect(result.tipos).toContain("grass");
    expect(result.tipos_url).toContain("https://bulbasaur/grass");
    expect(result.tipos).toContain("poison");
    expect(result.tipos_url).toContain("https://bulbasaur/poison");
  });
  it("Obtener links de la eficacia ante diferentes tipos de pokemon", async () => {
    hacerFetch.mockResolvedValue({
      damage_relations: {
        double_damage_from: [{ name: "grass" }],
        half_damage_from: [{ name: "poison" }],
        no_damage_from: [{ name: "metal" }],
      },
    });

    const result = await funcionesAPI.obtenerEficaciaPokemon(
      "https://pokeapi.co/api/v2/type/1",
    );

    expect(result.doble_dano.map((t) => t.name)).toContain("grass");
    expect(result.mitad_dano.map((t) => t.name)).toContain("poison");
    expect(result.no_dano.map((t) => t.name)).toContain("metal");
  });
  it("Obtener tipos a los que es debil el pokemon", async () => {
    hacerFetch.mockResolvedValueOnce({
      types: [
        {
          type: {
            name: "grass",
            url: "https://pokeapi.co/api/v2/type/12",
          },
        },
      ],
    });

    hacerFetch.mockResolvedValueOnce({
      damage_relations: {
        double_damage_from: [{ name: "fire" }, { name: "flying" }],
        half_damage_from: [],
        no_damage_from: [],
      },
    });

    const result = await funcionesAPI.obtenerDebilidadPokemon("1");

    expect(result.length).toBe(2);
    expect(result.map((t) => t.name)).toContain("fire");
    expect(result.map((t) => t.name)).toContain("flying");
  });
  it("Obtener tipos a los que resiste el pokemon", async () => {
    hacerFetch.mockResolvedValueOnce({
      types: [
        {
          type: {
            name: "fire",
            url: "https://pokeapi.co/api/v2/type/10",
          },
        },
      ],
    });

    hacerFetch.mockResolvedValueOnce({
      damage_relations: {
        double_damage_from: [],
        half_damage_from: [{ name: "grass" }],
        no_damage_from: [],
      },
    });

    const result = await funcionesAPI.obtenerResistenciaPokemon("1");

    expect(result.length).toBe(1);
    expect(result.map((t) => t.name)).toContain("grass");
  });
  it("Obtener tipos a los que es inmune el pokemon", async () => {
    hacerFetch.mockResolvedValueOnce({
      types: [
        {
          type: {
            name: "metal",
            url: "https://pokeapi.co/api/v2/type/10",
          },
        },
      ],
    });

    hacerFetch.mockResolvedValueOnce({
      damage_relations: {
        double_damage_from: [],
        half_damage_from: [],
        no_damage_from: [
          { name: "metal" },
          { name: "grass" },
          { name: "fire" },
        ],
      },
    });

    const result = await funcionesAPI.obtenerInmunidadPokemon("1");

    expect(result.length).toBe(3);
    expect(result.map((t) => t.name)).toContain("metal");
  });
  it("Obtener evoluciones del pokemon", async () => {
    hacerFetch.mockResolvedValueOnce({
      evolution_chain: {
        url: "http://bulbasaur",
      },
    });

    hacerFetch.mockResolvedValueOnce({
      chain: {
        species: { name: "bulbasaur" },
        evolves_to: [],
      },
    });

    hacerFetch.mockResolvedValueOnce({
      name: "bulbasaur",
      id: 1,
      sprites: {
        other: { "official-artwork": { front_default: "img.png" } },
      },
      types: [{ type: { name: "grass" } }],
      weight: 100,
      height: 10,
      stats: [
        { base_stat: 45 },
        { base_stat: 49 },
        { base_stat: 49 },
        { base_stat: 65 },
        { base_stat: 65 },
        { base_stat: 45 },
      ],
    });

    const link = await funcionesAPI.obtenerPokemonEvolucionesLink(2);
    const result = await funcionesAPI.obtenerPokemonEvoluciones(link);

    expect(link).toBe("http://bulbasaur");
    expect(result.length).toBe(1);
    expect(result[0].nombre).toBe("bulbasaur");
  });
});
