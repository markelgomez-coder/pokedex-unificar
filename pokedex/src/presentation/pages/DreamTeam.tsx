import "../../css/dream-team.css";
import "../../css/variables.css";
import "../../css/static.css";

import DreamTeamPokemon from "../components/DreamTeamPokemon";
import { usePokemonContext } from "../contexts/usePokemonContext";
import type { Pokemon } from "../../domain/entities/pokemon";
import { Link } from "react-router-dom";

function DreamTeam() {
  const { listaDreamTeam } = usePokemonContext();

  return (
    <>
      <div className="dream-team">
        <div className="dream-team-interior">
          {ponerFavoritos(listaDreamTeam)}
        </div>
      </div>
      <div className="jugar-dream-team">
        <Link to={`/combate/`} className="jugar-dream-team-button">
          <p>Combate</p>
        </Link>
      </div>
    </>
  );
}

function ponerFavoritos(lista: Pokemon[]) {
  return lista.map((pokemon) => (
    <DreamTeamPokemon key={pokemon.nombre} pokemon={pokemon} />
  ));
}

export default DreamTeam;
