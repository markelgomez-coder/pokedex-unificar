import "../../css/home.css";
import imagenPokedex from "../../img/home-pokedex.png";
import imagenDreamTeam from "../../img/home-dreamteam.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="home">
        <h2>Pokemon</h2>
        <div className="home-buttons-panel">
          <Link
            to={`/pokedex/`}
            id="home-pokedex"
            className="home-button"
          >
            <img src={imagenPokedex} alt="Pokeball" />
            <p>Pokedex</p>
          </Link>
          <Link
            to={`/dream-team/`}
            id="home-dreamTeam"
            className="home-button"
          >
            <img src={imagenDreamTeam} alt="Pokeball" id="imagen-home-dreamTeam" />
            <p>Dream Team</p>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
