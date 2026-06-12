import "../../css/pokedex.css";
import "../../css/variables.css";
import "../../css/static.css";

import { useEffect, useState } from "react";
import { usePokemonContext } from "../contexts/usePokemonContext";

import ErrorAPI from "../components/ErrorAPI";
import NoHayResultado from "../components/NoHayResultado";
import CartaPokemonVacia from "../components/CartaPokemonVacia";
import * as funcionesPokedex from "../../application/services/pokedexService";
import CartaPokemon from "../components/CartaPokemon";

import type { Pokemon } from "../../domain/entities/pokemon";

function Pokedex() {
  const [busqueda, setBusqueda] = useState("");
  const [busquedaDebounce, setBusquedaDebounce] = useState("");

  const { listaPokemon } = usePokemonContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBusquedaDebounce(busqueda);
    }, 300);

    return () => clearTimeout(timeout);
  }, [busqueda]);

  const loading = busqueda !== busquedaDebounce;

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
        {loading
          ? mostrarCartasVacias()
          : mostrarPokemons(busquedaDebounce, listaPokemon)}
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
  const PokemonsFiltrados = funcionesPokedex.filtrarPokemons(
    busqueda,
    listaPokemon
  );

  if (PokemonsFiltrados == null) {
    return <ErrorAPI />;
  }

  const lista = busqueda === "" ? listaPokemon : PokemonsFiltrados;

  const ordenados =
    busqueda === "" ? [...lista].sort((a, b) => a.numero - b.numero) : lista;

  if (
    ordenados.length === 0 &&
    busqueda !== "" &&
    !ordenados.some((p: Pokemon) =>
      p.nombre.includes(busqueda)
    )
  ) {
    return <NoHayResultado busqueda={busqueda} />;
  }

  return ordenados.map((pokemon: Pokemon) => (
    <CartaPokemon
      key={pokemon.numero}
      pokemon={pokemon}
      dreamTeam={pokemon.dream_team}
    />
  ));
}

export default Pokedex;
