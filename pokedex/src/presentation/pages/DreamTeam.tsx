import "../../css/dream-team.css";
import "../../css/variables.css";
import "../../css/static.css";

import DreamTeamPokemon from "../components/DreamTeamPokemon";
import DreamTeamVacio from "../components/DreamTeamVacio"
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
  return Array.from({ length: 6 }, (_, index) => {
    const pokemon = lista[index];

    return pokemon ? (
      <DreamTeamPokemon
        key={`pokemon-${pokemon.numero}`}
        pokemon={pokemon}
      />
    ) : (
      <DreamTeamVacio
        key={`vacio-${index}`}
      />
    );
  });
}

export default DreamTeam;
