import { useState } from "react";
import "./css/variables.css";
import "./css/static.css";
import "./css/iconos.css";
import Pokeball from "./iconos/Pokeball";
import Pokedex from "./vistas/Pokedex";
import DreamTeam from "./vistas/DreamTeam";
import Home from "./vistas/Home";
import Panel_Pokemon from "./vistas/Panel_Pokemon";

function App() {
  const [currentView, setCurrentView] = useState("home");

  const renderMainContent = () => {
    switch (currentView) {
      case "pokedex":
        return <Pokedex />;
      case "dream-team":
        return <DreamTeam />;
      case "home":
        return <Home />;
      case "panel-pokemon":
        return <Panel_Pokemon />;
    }
  };

  const renderJS = () => {
    switch (currentView) {
      case "pokedex":
        return <script type="module" src="./js/src/ts/pokedex.js"></script>;
      case "dream-team":
        return <script type="module" src="./js/src/ts/dream-team.js"></script>;
      case "home":
        return;
      case "panel-pokemon":
        return <script type="module" src="./js/src/ts/panel-pokemon.js"></script>;
    }
  };
  return (
    <>
      <header>
        <div id="header-icono">
          <Pokeball />
          <h1>Pokedex</h1>
        </div>
        <nav>
          <a onClick={() => setCurrentView("home")}>Home</a>
          <a onClick={() => setCurrentView("pokedex")}>Pokedex</a>
          <a onClick={() => setCurrentView("dream-team")}>Dream Team</a>
        </nav>
      </header>
      <main>{renderMainContent()}</main>
      <footer>
        <p>© 2026 Markel Gomez. All rights reserved.</p>
      </footer>
      {renderJS()}
    </>
  );
}

export default App;
