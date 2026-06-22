import { Link } from "react-router-dom";
import IconoAgregarDreamTeam from "../iconos/IconoAgregarDreamTeam";

export default function DreamTeamPokemon() {
  return (
    <>
      <div className={`pokemon-dream-team-vacio`}>
        <Link to={`/pokedex/`} className="agregar-pokemon">
          <IconoAgregarDreamTeam></IconoAgregarDreamTeam>
          <p> Agregar pokemon</p>
        </Link>
      </div>
    </>
  );
}
