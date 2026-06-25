import "../../css/combate.css";
import "../../css/variables.css";

import type { Pokemon } from "../../domain/entities/pokemon";

interface Props {
  pokemon: Pokemon;
}

function primeraMayusculas(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function calcularBarraPintada(valor: number) {
  return `${95 * (valor / 255)}px`;
}

function calcularPosicionBarraPintada(valor: number) {
  return `${95 - 95 * (valor / 255) }px`;
}

export default function CartaCombate({ pokemon }: Props) {
  return (
    <div className="carta-combate-peque">
      <p className="carta-combate-pokemon-name">
        {primeraMayusculas(pokemon.nombre)}
      </p>
      <img
        className="carta-combate-pokemon-image"
        src={pokemon.imagen}
        alt={`Imagen ${primeraMayusculas(pokemon.nombre)}`}
      />
      <div className="carta-combate-pokemon-info">
        <div className="carta-combate-tipo-pokemon">
          {pokemon.tipos.map((tipo) => (
            <div key={tipo} className={`carta-combate-icono-tipo ${tipo}`}>
              <p className="carta-combate-texto-tipo">
                {primeraMayusculas(tipo)}
              </p>
            </div>
          ))}
        </div>

        <div className="carta-combate-vida-pokemon">
          <div className="carta-combate-vida-datos">
            <p className="carta-combate-vida-nombre">HP</p>
            <p className="carta-combate-vida-valor">{pokemon.hp}</p>
          </div>

          <div className="carta-combate-barra-vida-total"></div>

          <div
            className="carta-combate-barra-vida-llena"
            style={{ width: calcularBarraPintada(pokemon.hp),
                     left: calcularPosicionBarraPintada(pokemon.hp)
             }}
          ></div>
        </div>
      </div>
    </div>
  );
}
