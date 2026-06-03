import { usePokemonContext } from "../context/usePokemonContext";

function IconoFavoritos({ pokemon }) {
  const { listaDreamTeam, meterAlDreamTeam } =
    usePokemonContext();

  const isDreamTeam = esDreamTeam(pokemon, listaDreamTeam);

  function manejarFavorito(e) {
    e.preventDefault();
    e.stopPropagation();

    meterAlDreamTeam(pokemon);
  }

  return (
    <div className="icono-dream-team" onClick={manejarFavorito}>
      <div className="icono-dream-team-interior">
        <div className="icono-dream-team-vector1"></div>

        <div
          className={`icono-dream-team-vector2 ${isDreamTeam ? "activo" : ""}`}
        />
      </div>
    </div>
  );
}

function esDreamTeam(pokemon, listaDreamTeam) {
  return listaDreamTeam.some((p) => p.nombre === pokemon.nombre);
}

export default IconoFavoritos;
