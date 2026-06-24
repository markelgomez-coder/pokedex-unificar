import "../../css/dream-team.css";
import "../../css/variables.css";
import "../../css/static.css";

import DreamTeamPokemon from "../components/DreamTeamPokemon";
import DreamTeamVacio from "../components/DreamTeamVacio";
import { usePokemonContext } from "../contexts/usePokemonContext";
import type { Pokemon } from "../../domain/entities/pokemon";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function DreamTeam() {
  const { listaDreamTeam } = usePokemonContext();

  const location = useLocation();

  const error = location.state?.error;

  const [showError, setShowError] = useState(true);

  return (
    <>
      {error && showError && (
        <div className="popup-error">
          {error}
          <button onClick={() => setShowError(false)}>Cerrar</button>
        </div>
      )}
      
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
      <DreamTeamPokemon key={`pokemon-${pokemon.numero}`} pokemon={pokemon} />
    ) : (
      <DreamTeamVacio key={`vacio-${index}`} />
    );
  });
}

export default DreamTeam;
