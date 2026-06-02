import "../css/pokedex.css";
import "../css/variables.css";
import "../css/static.css";

import { useEffect, useState } from "react";
import { usePokemonContext } from "../context/usePokemonContext";

import ErrorAPI from "../componentes/ErrorAPI";
import NoHayResultado from "../componentes/NoHayResultado";
import CartaPokemonVacia from "../componentes/CartaPokemonVacia";
import * as funcionesPokedex from "../ts/pokedex.js";
import CartaPokemon from "../componentes/CartaPokemon";

import type { Pokemon } from "../ts/tipos";

function Pokedex() {
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const { listaPokemon } = usePokemonContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("Buscar:", busqueda);
      setLoading(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, [busqueda]);

  const renderCartas = () => {
    if (loading) {
      setLoading(false);
      return mostrarCartasVacias();
    }

    return mostrarPokemons(busqueda, listaPokemon);
  };

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

      <section id="resultado-busqueda" key={busqueda}>
        {renderCartas()}
      </section>
    </>
  );
}

function mostrarCartasVacias() {
  const cartas = [];

  for (let i = 0; i < 9; i++) {
    cartas.push(<CartaPokemonVacia key={i} />);
  }

  return cartas;
}

function mostrarPokemons(busqueda: string, listaPokemon: Pokemon[]) {
  const PokemonsFiltrados = funcionesPokedex.filtrarPokemons(busqueda);

  if (PokemonsFiltrados == null) {
    return <ErrorAPI />;
  }

  const lista = busqueda === "" ? listaPokemon : PokemonsFiltrados;

  const ordenados =
    busqueda === "" ? [...lista].sort((a, b) => a.numero - b.numero) : lista;

  if (
    ordenados.length === 0 &&
    busqueda !== "" &&
    !ordenados.some((p) => p.nombre.includes(busqueda))
  ) {
    return <NoHayResultado busqueda={busqueda} />;
  }

  return ordenados.map((pokemon) => (
    <CartaPokemon
      key={pokemon.numero}
      pokemon={pokemon}
      dreamTeam={pokemon.dream_team}
    />
  ));
}

export default Pokedex;
