import "../css/pokedex.css";
import "../css/variables.css";
import "../css/static.css";
import CartaPokemonVacia from "../componentes/CartaPokemonVacia";
import CartaPokemon from "../componentes/CartaPokemon";


function Pokedex() {
  const pokemon = {
    numero: 1,
    nombre: "Bulbasaur",
    tipos: ["grass", "poison"],
    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    peso: 6.9,
    altura: 0.7,
    hp: 45,
    atk: 49,
    def: 49,
    sat: 65,
    sdf: 65,
    spd: 45,
  };
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
      <section id="resultado-busqueda">
        <CartaPokemonVacia />
        <CartaPokemon pokemon={pokemon} dreamTeam={true} />
      </section>
    </>
  );
}

export default Pokedex;