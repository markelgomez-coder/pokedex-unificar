
import * as funcionesDreamTeam from "./dream-team.js";
import * as funcionesPokedex from "./pokedex.js";

if (window.location.pathname.endsWith("panel-pokemon.html")) {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (
      target.classList.contains("icono-dream-team-interior") ||
      target.classList.contains("icono-dream-team-vector1") ||
      target.classList.contains("icono-dream-team-vector2")
    ) {
      const card = target.closest(".carta-pokemon") as HTMLElement;

      if (card) {
        const nombrePokemon = card.querySelector(".pokemon-name");
        if (nombrePokemon) {
          const nombrePokemonMinusculas =
            nombrePokemon.textContent.toLowerCase();

          const icono = card.getElementsByClassName(
            "icono-dream-team-vector2",
          )[0] as HTMLElement;

          funcionesDreamTeam.modificarPokemonDreamTeamDesdeCarta(
            nombrePokemonMinusculas,
            icono,
          );
        }
      }
    } else if (
      target.classList.contains("carta-pokemon") ||
      target.classList.contains("pokemon-name") ||
      target.classList.contains("pokemon-image") ||
      target.classList.contains("pokemon-number") ||
      target.classList.contains("pokemon-info")
    ) {
      const card = target.closest(".carta-pokemon") as HTMLElement;

      if (card) {
        const nombrePokemon = card.querySelector(".pokemon-name");
        if (nombrePokemon) {
          funcionesPokedex.irPanelPokemon(
            nombrePokemon.textContent.toLowerCase(),
          );
        }
      }
    }
  });
}
