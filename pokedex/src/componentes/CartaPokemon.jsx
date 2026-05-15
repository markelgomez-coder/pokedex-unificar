import * as funcionesGenerales from "../js/src/ts/funciones-generales.js";
import "../css/pokedex.css";
import "../css/variables.css";

function CartaPokemon({ pokemon, dreamTeam }) {
  const primeraMayusculas = (texto) =>
    texto.charAt(0).toUpperCase() + texto.slice(1);

  const calcularBarraPintada = (valor) => {
    return `${270 * (valor / 255) - 16}px`;
  };

  return (
    <a className={`carta-pokemon ${pokemon.tipos[0]}`}>
      <header>
        <p className="pokemon-name">
          {primeraMayusculas(pokemon.nombre)}
        </p>

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
        <div className="icono-dream-team">
          <div className="icono-dream-team-interior">
            <div className="icono-dream-team-vector1"></div>

            <div
              className={`icono-dream-team-vector2 ${
                dreamTeam ? "activo" : ""
              }`}
            ></div>
          </div>
        </div>

        <div className="tipo-pokemon">
          {pokemon.tipos.map((tipo) => (
            <div key={tipo} className={`icono-tipo ${tipo}`}>
              <p className="texto-tipo">
                {primeraMayusculas(tipo)}
              </p>
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

          <div className="estadistica">
            <div className="estadistica-datos">
              <p className="estadistica-nombre">HP</p>
              <p className="estadistica-valor">{pokemon.hp}</p>
            </div>

            <div className="barra-estadistica-total"></div>

            <div
              className="barra-estadistica-llena"
              style={{ width: calcularBarraPintada(pokemon.hp) }}
            ></div>
          </div>

          <div className="estadistica">
            <div className="estadistica-datos">
              <p className="estadistica-nombre">ATK</p>
              <p className="estadistica-valor">{pokemon.atk}</p>
            </div>

            <div className="barra-estadistica-total"></div>

            <div
              className="barra-estadistica-llena"
              style={{ width: calcularBarraPintada(pokemon.atk) }}
            ></div>
          </div>

          <div className="estadistica">
            <div className="estadistica-datos">
              <p className="estadistica-nombre">DEF</p>
              <p className="estadistica-valor">{pokemon.def}</p>
            </div>

            <div className="barra-estadistica-total"></div>

            <div
              className="barra-estadistica-llena"
              style={{ width: calcularBarraPintada(pokemon.def) }}
            ></div>
          </div>

          <div className="estadistica">
            <div className="estadistica-datos">
              <p className="estadistica-nombre">SAT</p>
              <p className="estadistica-valor">{pokemon.sat}</p>
            </div>

            <div className="barra-estadistica-total"></div>

            <div
              className="barra-estadistica-llena"
              style={{ width: calcularBarraPintada(pokemon.sat) }}
            ></div>
          </div>

          <div className="estadistica">
            <div className="estadistica-datos">
              <p className="estadistica-nombre">SDF</p>
              <p className="estadistica-valor">{pokemon.sdf}</p>
            </div>

            <div className="barra-estadistica-total"></div>

            <div
              className="barra-estadistica-llena"
              style={{ width: calcularBarraPintada(pokemon.sdf) }}
            ></div>
          </div>

          <div className="estadistica">
            <div className="estadistica-datos">
              <p className="estadistica-nombre">SPD</p>
              <p className="estadistica-valor">{pokemon.spd}</p>
            </div>

            <div className="barra-estadistica-total"></div>

            <div
              className="barra-estadistica-llena"
              style={{ width: calcularBarraPintada(pokemon.spd) }}
            ></div>
          </div>

        </div>
      </div>
    </a>
  );
}

export default CartaPokemon;