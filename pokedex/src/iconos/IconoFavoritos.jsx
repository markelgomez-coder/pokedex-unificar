import { usePokemonContext } from "../context/usePokemonContext";

function IconoFavoritos({ pokemon }) {
  const { listaDreamTeam, agregarADreamTeam, eliminarDeDreamTeam } =
    usePokemonContext();

  const isDreamTeam = listaDreamTeam.some((p) => p.nombre === pokemon.nombre);

  function manejarFavorito(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isDreamTeam) {
      eliminarDeDreamTeam(pokemon.nombre);
    } else {
      agregarADreamTeam(pokemon);
    }
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

export default IconoFavoritos;
