import "../css/pokedex.css";
import "../css/variables.css";
import "../css/static.css";

import { useState } from "react";

import ErrorAPI from "../componentes/ErrorAPI";
import NoHayResultado from "../componentes/NoHayResultado";
import CartaPokemonVacia from "../componentes/CartaPokemonVacia";

function Pokedex() {
  const [busqueda, setBusqueda] = useState("");
  const [cartasPuestas, setCartas] = useState("cargando");

  const renderCartas = () => {
    switch (cartasPuestas) {
      case "cargando":
        return mostrarCartasVacias();

      case "pokemon":
        return mostrarPokemon();

      case "no hay resultado":
        return <NoHayResultado busqueda={busqueda} />;

      case "error API":
        return <ErrorAPI />;

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

              if (e.target.value === "") {
                setCartas("cargando");
              } else {
                setCartas("pokemon");
              }
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

function mostrarPokemon() {
  return <h2>Pokémon cargados</h2>;
}

export default Pokedex;
