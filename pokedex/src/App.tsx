import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { PokemonProvider } from "./presentation/contexts/PokemonProvider";
import { pokemonRepository } from "./infra/pokemonRepositoryFetch";
import { dreamTeamStorage } from "./infra/dreamTeamLocalStorage";

import "./css/variables.css";
import "./css/static.css";
import "./css/iconos.css";
import "./css/error.css"

import Pokeball from "./presentation/iconos/Pokeball";

import Home from "./presentation/pages/Home";
import Pokedex from "./presentation/pages/Pokedex";
import DreamTeam from "./presentation/pages/DreamTeam";
import Panel_Pokemon from "./presentation/pages/Panel_Pokemon";
import Combate from "./presentation/pages/Combate";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <div id="header-icono">
          <Pokeball />
          <h1>Pokedex</h1>
        </div>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/pokedex">Pokedex</Link>
          <Link to="/dream-team">Dream Team</Link>
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        <p>© 2026 Markel Gomez. All rights reserved.</p>
      </footer>
    </>
  );
}

function App() {
  return (
    <PokemonProvider
      pokemonRepository={pokemonRepository}
      dreamTeamStorage={dreamTeamStorage}
    >
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokedex" element={<Pokedex />} />
            <Route path="/dream-team" element={<DreamTeam />} />
            <Route path="/panel-pokemon/:id" element={<Panel_Pokemon />} />
            <Route path="/combate/" element={<Combate />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </PokemonProvider>
  );
}

export default App;
