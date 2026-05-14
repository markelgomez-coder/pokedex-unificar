import "./css/variables.css";
import "./css/static.css";
import "./css/iconos.css";

function App() {
  return (
    <>
      <header>
        <div id="header-icono">
          <div className="pokeball-icono">
            <div className="pokeball-icono-interior"></div>
            <div className="pokeball-icono-vector1"></div>
            <div className="pokeball-icono-vector2"></div>
            <div className="pokeball-icono-vector3"></div>
            <div className="pokeball-icono-vector4"></div>
            <div className="pokeball-icono-vector5"></div>
          </div>
          <h1>Pokedex</h1>
        </div>
        <nav>
          <a href="index.html">Home</a>
          <a href="pokedex.html">Pokedex</a>
          <a href="dream-team.html">Dream Team</a>
        </nav>
      </header>
      <main>
        <h2>Pokemon</h2>
        <p>
          Welcome to the Pokedex! This is your ultimate guide to all things
          Pokémon. Here, you can explore detailed information about every
          Pokémon species, including their types, abilities, evolutions, and
          much more. Whether you're a seasoned trainer or just starting your
          Pokémon journey, the Pokédex is your go-to resource for learning about
          the fascinating world of Pokémon. Dive in and discover the unique
          characteristics of each Pokémon, their habitats, and how they interact
          with one another. Happy exploring!
        </p>
      </main>
      <footer>
        <p>© 2026 Markel Gomez. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
