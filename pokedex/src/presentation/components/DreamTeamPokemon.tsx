import { usePokemonContext } from "../contexts/usePokemonContext";
import type { Pokemon } from "../../domain/entities/pokemon";
import { Link } from "react-router-dom";

export default function DreamTeamPokemon({ pokemon }: { pokemon: Pokemon }) {
  const { listaDreamTeam, meterAlDreamTeam } = usePokemonContext();

  function primeraMayusculas(texto: string) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function calcularPuntosTotales(pokemon: Pokemon) {
    return (
      pokemon.hp +
      pokemon.atk +
      pokemon.def +
      pokemon.sat +
      pokemon.sdf +
      pokemon.spd
    );
  }

  const stats = [
    { nombre: "HP", valor: pokemon.hp },
    { nombre: "ATK", valor: pokemon.atk },
    { nombre: "DEF", valor: pokemon.def },
    { nombre: "SAT", valor: pokemon.sat },
    { nombre: "SDF", valor: pokemon.sdf },
    { nombre: "SPD", valor: pokemon.spd },
  ];

  console.log("Lista Dream Team:", listaDreamTeam);
  return (
    <>
      <Link
        to={`/panel-pokemon/${pokemon.nombre}`}
        className={`pokemon-dream-team-tarjeta ${pokemon.tipos[0]}`}
      >
        <div className="pokemon-dream-team-titulo">
          <p>{primeraMayusculas(pokemon.nombre)}</p>
        </div>
        <div className="pokemon-dream-team-imagen">
          <img src={pokemon.imagen} alt={pokemon.nombre} />
        </div>
        <div className="pokemon-dream-team-tipos">
          {pokemon.tipos.map((tipo) => (
            <div key={tipo} className={`pokemon-dream-team-tipo ${tipo}`}>
              {primeraMayusculas(tipo)}
            </div>
          ))}
        </div>
        <div className="estadisticas-pokemon">
          {stats.map((stat) => (
            <div key={stat.nombre} className="estadistica-pokemon">
              {stat.nombre}: {stat.valor}
            </div>
          ))}
        </div>
        <div className="puntos-totales-pokemon">
          <div className="nombre">Puntos Totales:</div>
          <div className="numero">{calcularPuntosTotales(pokemon)}</div>
        </div>
        <div className="eliminar-del-dream-team">
          <div
            className="button-eliminar-del-dream-team"
            onClick={(e) => {
              e.preventDefault();
              meterAlDreamTeam(pokemon);
            }}
          >Eliminar</div>
        </div>
      </Link>
    </>
  );
}
