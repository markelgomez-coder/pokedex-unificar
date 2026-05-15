import { useState } from "react";
import "./css/variables.css";
import "./css/static.css";
import "./css/iconos.css";
import Pokeball from "./iconos/pokeball";
import Pokedex from "./vistas/Pokedex";
import DreamTeam from "./vistas/DreamTeam";
import Home from "./vistas/Home";

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
    </>
  );
}

export default App;
