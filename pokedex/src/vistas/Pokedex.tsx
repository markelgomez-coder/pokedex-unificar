import "../css/pokedex.css";
import "../css/variables.css";
import "../css/static.css";
import * as funcionesAPI from "../js/src/ts/funciones-API";
import CartaPokemonVacia from "../componentes/CartaPokemonVacia";
import CartaPokemon from "../componentes/CartaPokemon";
import { useEffect, useState } from "react";
import type { Pokemon } from "../ts/tipos";

function Pokedex() {

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    async function cargarPokemon() {
      const data = await funcionesAPI.obtenerPokemon(1);
      setPokemon(data);
    }

    cargarPokemon();
  }, []);

  useEffect(() => {

    const timeout = setTimeout(async () => {

      if (busqueda.trim() !== "") {
        const data = await funcionesAPI.obtenerPokemon(busqueda);
        setPokemon(data);
      }

    }, 500);

    return () => clearTimeout(timeout);

  }, [busqueda]);

  return (
    <>
      <div className="buscador">

        <div className="lupa-icono">
          <div className="lupa-icono-circulo"></div>
          <div className="lupa-icono-linea"></div>
        </div>

        <form id="formulario-busqueda">
          <input
            type="text"
            id="input-busqueda"
            placeholder="Search Pokémon..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </form>

      </div>

      <section id="resultado-busqueda">

        <CartaPokemonVacia />

        {pokemon && (
          <CartaPokemon
            pokemon={pokemon}
            dreamTeam={true}
          />
        )}

      </section>
    </>
  );
}

export default Pokedex;