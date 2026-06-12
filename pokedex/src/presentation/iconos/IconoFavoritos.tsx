import React from "react";
import { usePokemonContext } from "../contexts/usePokemonContext";
import type { Pokemon } from "../../domain/entities/pokemon";

interface Props {
  pokemon: Pokemon;
}

export default function IconoFavoritos({ pokemon }: Props) {
  const { listaDreamTeam, meterAlDreamTeam } = usePokemonContext();

  const isDreamTeam = listaDreamTeam.some((p) => p.numero === pokemon.numero);

  function manejarFavorito(e: React.MouseEvent) {
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
