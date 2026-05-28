import { useState } from "react";
import * as funcionesDreamTeam from "../ts/dream-team";

function IconoFavoritos({ dreamTeam, nombre }) {
  const [isDreamTeam, setIsDreamTeam] = useState(dreamTeam);

  return (
    <>
      <div
        className="icono-dream-team"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setIsDreamTeam((prev) => !prev);

          funcionesDreamTeam.modificarPokemonDreamTeamDesdeCarta(nombre);
        }}
      >
        <div className="icono-dream-team-interior">
          <div className="icono-dream-team-vector1"></div>

          <div
            className={`icono-dream-team-vector2 ${
              isDreamTeam ? "activo" : ""
            }`}
          ></div>
        </div>
      </div>
    </>
  );
}

export default IconoFavoritos;
