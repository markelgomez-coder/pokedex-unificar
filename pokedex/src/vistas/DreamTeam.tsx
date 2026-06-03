import "../css/dream-team.css";

import { usePokemonContext  } from "../context/usePokemonContext";

import type { Pokemon } from "../ts/tipos";

function DreamTeam() {

const { listaDreamTeam, meterAlDreamTeam } = usePokemonContext();  
const posiciones = [
    { x: -120, y: 120 },
    { x: 0, y: 140 },
    { x: 120, y: 120 },
    { x: -70, y: 20 },
    { x: 70, y: 20 },
    { x: 0, y: 70 },
  ];

  const dreamTeamGrande = [...listaDreamTeam].sort(
    (a, b) => a.altura - b.altura,
  );

  const dreamTeamPequeno = [...listaDreamTeam].sort(
    (a, b) => a.numero - b.numero,
  );

  return (
    <div className="dream-team">
      <div className="dream-team-interior">
        <div id="dream-team-grandes" className="dream-team-grandes">
          {dreamTeamGrande.map((p: Pokemon, index: number) => {
            const pos = posiciones[index];

            let inicial = 25;
            let suma = 1.25;

            if (p.peso >= 100) {
              inicial = 150;
              suma = 0.2;
            }

            return (
              <img
                key={p.nombre}
                className="dream-team-grandes-img"
                src={p.imagen}
                style={{
                  position: "absolute",
                  width: `calc(${inicial}px + ${suma} * ${p.peso}px)`,
                  left: `calc(50% + ${pos.x}px)`,
                  bottom: `${pos.y}px`,
                  zIndex: 6 - index,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </div>

        <div id="dream-team-pequenos" className="dream-team-pequenos">
          {dreamTeamPequeno.map((p: Pokemon) => (
            <div key={p.nombre} className="dream-team-pequenos-container">
              <img
                className="dream-team-pequenos-img"
                src={p.imagen}
                alt={p.nombre}
              />

              <div
                id={p.nombre}
                className="eliminar-dream-team"
                onClick={() => meterAlDreamTeam(p)}
              >
                <div className="eliminar-dream-team-icono-1" />
                <div className="eliminar-dream-team-icono-2" />
                <div className="eliminar-dream-team-icono-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DreamTeam;
