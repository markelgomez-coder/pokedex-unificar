import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "./css/variables.css";
import "./css/static.css";
import "./css/iconos.css";

import Pokeball from "./iconos/Pokeball";

import Home from "./vistas/Home";
import Pokedex from "./vistas/Pokedex";
import DreamTeam from "./vistas/DreamTeam";
import Panel_Pokemon from "./vistas/Panel_Pokemon";

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
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/dream-team" element={<DreamTeam />} />
          <Route path="/panel-pokemon/:id" element={<Panel_Pokemon />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;