import { useEffect, useState } from "react";
import "../../css/combate.css";
import InputDificultad from "../components/InputDificultad";
import { usePokemonContext } from "../contexts/usePokemonContext";
import { useNavigate } from "react-router-dom";
import type { Pokemon } from "../../domain/entities/pokemon";
import CartaCombate from "../components/CartaCombate";
import CartaCombateVacia from "../components/CartaCombateVacia";

function Combate() {
  const { listaDreamTeam } = usePokemonContext();
  const navigate = useNavigate();

  const [dificultad, setDificultad] = useState("");
  const [pokemonUsuario, setPokemonUsuario] = useState<Pokemon | null>(null);
  const [pokemonCPU, setPokemonCPU] = useState<Pokemon | null>(null);
  const [cambiarCarta, setCambiarCarta] = useState(true);
  const [cambiarCartaC, setCambiarCartaC] = useState(true);
  //const [dreamTeamCPU, setDreamTeamCPU] = useState<Pokemon[]>([]);
  const dreamTeamCPU = listaDreamTeam;

  useEffect(() => {
    if (listaDreamTeam.length < 6) {
      navigate("/dream-team/", {
        state: {
          error: "Necesitas 6 Pokémon para entrar en combate",
        },
      });
    }
  }, [listaDreamTeam, navigate]);

  if (listaDreamTeam.length < 6) {
    return null;
  }

  if (!dificultad) {
    return (
      <div className="combate-dificultad">
        <InputDificultad setDificultad={setDificultad} />
      </div>
    );
  }

  const cambiarCartaUsuario = (e: React.MouseEvent, pokemon: Pokemon) => {
    e.preventDefault();
    e.stopPropagation();
    if (cambiarCarta) {
      setCambiarCarta(false);
      setPokemonUsuario(pokemon);
    }
  };

  const cambiarCartaCPU = (e: React.MouseEvent, pokemon: Pokemon) => {
    e.preventDefault();
    e.stopPropagation();
    if (cambiarCartaC) {
      setCambiarCartaC(false);
      setPokemonCPU(pokemon);
    }
  };

  return (
    <div className="combate">
      <div className="combate-panel-usuario">
        <div className="combate-cartas">
          {listaDreamTeam.map((pokemon) => (
            <div
              key={pokemon.numero}
              className="combate-carta"
              onClick={(e) => cambiarCartaUsuario(e, pokemon)}
            >
              <CartaCombate pokemon={pokemon} />
            </div>
          ))}
        </div>

        <div className="combate-carta-actual">
          <div
            className="combate-carta-pokemon-elegida"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {pokemonUsuario ? (
              <CartaCombate pokemon={pokemonUsuario} />
            ) : (
              <CartaCombateVacia />
            )}
          </div>
        </div>
      </div>
      <div className="combate-panel-cpu">
        <div className="combate-carta-actual">
          <div
            className="combate-carta-pokemon-elegida"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {pokemonCPU ? (
              <CartaCombate pokemon={pokemonCPU} />
            ) : (
              <CartaCombateVacia />
            )}
          </div>
        </div>
        <div className="combate-cartas">
          {dreamTeamCPU.map((pokemon) => (
            <div
              key={pokemon.numero}
              className="combate-carta"
              onClick={(e) => cambiarCartaCPU(e, pokemon)}
            >
              <CartaCombate pokemon={pokemon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Combate;
