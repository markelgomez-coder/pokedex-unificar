import "./css/variables.css";
import "./css/static.css";
import "./css/iconos.css";
import "./css/pokedex.css";

function pokedex() {
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
        <div className="buscador">
          <div className="lupa-icono">
            <div className="lupa-icono-circulo"></div>
            <div className="lupa-icono-linea"></div>
          </div>
          <form id="formulario-busqueda">
            <input
              type="text"
              id="input-busqueda"
              placeholder="Search Pokémon..."
            />
          </form>
        </div>
        <section id="resultado-busqueda"></section>
      </main>
      <footer>
        <p>© 2026 Markel Gomez. All rights reserved.</p>
      </footer>
    </>
  );
}

export default pokedex;
