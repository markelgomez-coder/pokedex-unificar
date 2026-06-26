import "../../css/combate.css";
import "../../css/variables.css";

import { useEffect, useState } from "react";
import type { Pokemon } from "../../domain/entities/pokemon";
import type { MovimientoCombate } from "../../domain/entities/pokemon";
import { obtenerMovimientosCombate } from "../../infra/adapters/pokemonApi";

interface Props {
  pokemon: Pokemon;
  onMovimientoSeleccionado?: (movimiento: MovimientoCombate) => void;
}

function primeraMayusculas(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function AtaquesCombate({ pokemon, onMovimientoSeleccionado }: Props) {
  const [movimientos, setMovimientos] = useState<MovimientoCombate[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarMovimientos = async () => {
      try {
        const movs = await obtenerMovimientosCombate(pokemon.numero.toString());
        setMovimientos(movs);
      } catch (error) {
        console.error("Error cargando movimientos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarMovimientos();
  }, [pokemon.numero]);

  const seleccionarMovimiento = (e: React.MouseEvent, movimiento: MovimientoCombate) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMovimientoSeleccionado) {
      onMovimientoSeleccionado(movimiento);
    }
  };

  if (cargando) {
    return <div className="carta-combate-ataques">Cargando...</div>;
  }

  return (
    <div className="carta-combate-ataques">
      {movimientos.map((movimiento) => (
        <div
          key={movimiento.nombre}
          className={`combate-carta-movimiento ${movimiento.tipo}`}
          onClick={(e) => seleccionarMovimiento(e, movimiento)}
        >
          <p className="movimiento-nombre">{primeraMayusculas(movimiento.nombre)}</p>
          {movimiento.potencia && (
            <p className="movimiento-potencia">Pow: {movimiento.potencia}</p>
          )}
        </div>
      ))}
    </div>
  );
}
