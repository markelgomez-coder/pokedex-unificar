import "../css/pokedex.css";
import "../css/variables.css";
import "../css/static.css";

import { useEffect, useState, type JSX } from "react";

import ErrorAPI from "../componentes/ErrorAPI";
import NoHayResultado from "../componentes/NoHayResultado";
import CartaPokemonVacia from "../componentes/CartaPokemonVacia";
import * as funcionesGenerales from "../ts/funciones-generales.js";
import * as funcionesPokedex from "../ts/pokedex.js";
import * as datosGenerales from "../ts/datos-generales.js";
import CartaPokemon from "../componentes/CartaPokemon";

function Pokedex() {
  const [busqueda, setBusqueda] = useState("");
  const [cartasPuestas, setCartas] = useState("cargando");

  useEffect(() => {
    const loadPokemons = async () => {
      await funcionesGenerales.obtenerTodosLosPokemons();
    };

    loadPokemons();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      console.log("Buscar:", busqueda);
      setCartas("pokemon");
    }, 300);
    return () => clearTimeout(timeout);
  }, [busqueda]);

  const renderCartas = () => {
    switch (cartasPuestas) {
      case "cargando":
        return mostrarCartasVacias();
      case "pokemon":
        return mostrarPokemons(busqueda);

      default:
        return null;
    }
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
            onChange={(e) => {
              setBusqueda(e.target.value);
              setCartas("pokemon");
            }}
          />
        </form>
      </div>
      <section id="resultado-busqueda">{renderCartas()}</section>
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

function mostrarPokemons(busqueda: string) {
  const cartas: JSX.Element[] = [];
  const PokemonsFiltrados = funcionesPokedex.filtrarPokemons(busqueda);
  if (PokemonsFiltrados == null) {
    return <ErrorAPI />;
  }
  if (
    PokemonsFiltrados != null &&
    PokemonsFiltrados.length === 0 &&
    busqueda !== ""
  ) {
    return <NoHayResultado busqueda={busqueda} />;
  } else if (busqueda === "") {
    const cartasOrdenadas = [...datosGenerales.listaPokemon].sort((a, b) => a.numero - b.numero);
    cartasOrdenadas.forEach((pokemon) => {
      cartas.push(
        <CartaPokemon
          key={pokemon.numero}
          pokemon={pokemon}
          dreamTeam={pokemon.dream_team}
        />,
      );
    });
  } else if (PokemonsFiltrados != null) {
    PokemonsFiltrados.forEach((pokemon) => {
      cartas.push(
        <CartaPokemon
          key={pokemon.numero}
          pokemon={pokemon}
          dreamTeam={pokemon.dream_team}
        />,
      );
    });
  }

  return cartas;
}

export default Pokedex;
