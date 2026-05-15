function CartaPokemon({ pokemon, dreamTeam }) {
  return (
    <a className={`carta-pokemon ${pokemon.tipos[0]}`}>
      <header>
        <p className="pokemon-name">
          {pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}
        </p>

        <p className="pokemon-number">
          {funcionesGenerales.formatearNumero(pokemon.numero)}
        </p>
      </header>

      <img
        className="pokemon-image"
        src={pokemon.imagen}
        alt={`Imagen ${
          pokemon.nombre.charAt(0).toUpperCase() +
          pokemon.nombre.slice(1)
        }`}
      />

      <div className="pokemon-info">
        <div className="icono-dream-team">
          <div className="icono-dream-team-interior">
            <div className="icono-dream-team-vector1"></div>

            <div
              className={`icono-dream-team-vector2 ${
                dreamTeam ? "activo" : ""
              }`}
            ></div>
          </div>
        </div>

        <div className="tipo-pokemon">
          {pokemon.tipos.map((tipo) => (
            <div key={tipo} className={`icono-tipo ${tipo}`}>
              <p className="texto-tipo">
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </a>
  );
}

export default CartaPokemon;