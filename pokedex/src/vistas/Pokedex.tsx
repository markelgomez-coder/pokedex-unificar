function Pokedex() {
  return (
    <>
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
    </>
  );
}

export default Pokedex;