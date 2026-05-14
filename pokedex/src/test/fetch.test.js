import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { hacerFetch } from "../js/src/ts/fetch.js";

describe("La funcion hacer fetch funciona correctamente", () => {
  beforeAll(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({ name: "bulbasaur" }),
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("El fetch se hace correctamente", async () => {
    const result = await hacerFetch("https://pokeapi.co/api/v2/pokemon/1");

    expect(result.name).toBe("bulbasaur");
  });
});

describe("La API responde", () => {
  it("La pokeAPI responde correctamente", async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/1");

    expect(res.ok).toBe(true);
  });

  it("Al hacerle el request a la API devuelve un json correcto", async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/1");
    const data = await res.json();

    expect(data.name).toBe("bulbasaur");
  });
});