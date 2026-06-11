import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import * as funcionesGenerales from "../ts/funciones-generales";
import * as datosGenerales from "../ts/datos-generales";
import { usePokemonContext } from "../context/usePokemonContext";


describe("Cambiar la lista de los pokemons en el dreamTeam", () => {

  const { listaDreamTeam, meterAlDreamTeam } = usePokemonContext();

  beforeAll(() => {
    meterAlDreamTeam({
      nombre: "charmander",
      numero: "004",
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

    expect(listaDreamTeam).not.toContainEqual(pokemon);
    meterAlDreamTeam(pokemon);
    expect(listaDreamTeam).toContainEqual(pokemon);
  });

  it("Quitar un pokemon del dreamTeam", () => {
    const pokemon = {
      nombre: "charmander",
      numero: "004",
      tipos: ["fire"],
      dream_team: true,
    };

    expect(listaDreamTeam).toContainEqual(pokemon);
    meterAlDreamTeam(pokemon);
    expect(listaDreamTeam).not.toContainEqual(pokemon);
  });
});
