import * as funcionesGenerales from "../ts/funciones-generales.js";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "../css/pokedex.css";
import "../css/variables.css";
import IconoFavoritos from "../iconos/IconoFavoritos.jsx";

function CartaPokemon({ pokemon, dreamTeam }) {  
  const primeraMayusculas = (texto) =>
    texto.charAt(0).toUpperCase() + texto.slice(1);

  const stats = [
    { nombre: "HP", valor: pokemon.hp },
    { nombre: "ATK", valor: pokemon.atk },
    { nombre: "DEF", valor: pokemon.def },
    { nombre: "SAT", valor: pokemon.sat },
    { nombre: "SDF", valor: pokemon.sdf },
    { nombre: "SPD", valor: pokemon.spd },
  ];

  const calcularBarraPintada = (valor) => {
    return `${270 * (valor / 255) - 16}px`;
  };

  return (
    <Link to={`/panel-pokemon/${pokemon.nombre}`} className={`carta-pokemon ${pokemon.tipos[0]}`}>
      <header>
        <p className="pokemon-name">{primeraMayusculas(pokemon.nombre)}</p>

        <p className="pokemon-number">
          {funcionesGenerales.formatearNumero(pokemon.numero)}
        </p>
      </header>

      <img
        className="pokemon-image"
        src={pokemon.imagen}
        alt={`Imagen ${primeraMayusculas(pokemon.nombre)}`}
      />
      <div className="pokemon-info">
        <IconoFavoritos pokemon={pokemon}  />
        <div className="tipo-pokemon">
          {pokemon.tipos.map((tipo) => (
            <div key={tipo} className={`icono-tipo ${tipo}`}>
              <p className="texto-tipo">{primeraMayusculas(tipo)}</p>
            </div>
          ))}
        </div>

        <div className="medidas-pokemon">
          <div className="icono-peso"></div>
          <p>{pokemon.peso} Kg</p>

          <div className="separador-tipos"></div>

          <div className="icono-altura"></div>
          <p>{pokemon.altura} m</p>
        </div>

        <div className="estadisticas-pokemon">
          {stats.map((stat) => (
            <div key={stat.nombre} className="estadistica">
              <div className="estadistica-datos">
                <p className="estadistica-nombre">{stat.nombre}</p>
                <p className="estadistica-valor">{stat.valor}</p>
              </div>

              <div className="barra-estadistica-total"></div>

              <div
                className="barra-estadistica-llena"
                style={{ width: calcularBarraPintada(stat.valor) }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default CartaPokemon;
