import { usePokemonContext } from "../contexts/usePokemonContext";
import type { Pokemon } from "../../domain/entities/pokemon";

export default function DreamTeamPokemon({ pokemon }: { pokemon: Pokemon }) {
  const { listaDreamTeam, meterAlDreamTeam } = usePokemonContext();

  console.log("Lista Dream Team:", listaDreamTeam);
  return (
    <>
      <div
        className="carta-pokemon-dtt"
        onClick={() => meterAlDreamTeam(pokemon)}
      />
    </>
  );
}
