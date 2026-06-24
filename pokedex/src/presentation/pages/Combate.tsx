import { useEffect, useState } from "react";
import "../../css/combate.css";
import InputDificultad from "../components/InputDificultad";
import { usePokemonContext } from "../contexts/usePokemonContext";
import { useNavigate } from "react-router-dom";

function Combate() {
  const [dificultad, setDificultad] = useState("");
  const { listaDreamTeam } = usePokemonContext();
  const navigate = useNavigate();

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
      <div className="combate">
        <InputDificultad setDificultad={setDificultad} />
      </div>
    );
  }

  return (
    <div className="combate">
      <h1>Combate iniciado</h1>
      <p>Dificultad: {dificultad}</p>
    </div>
  );
}

export default Combate;
