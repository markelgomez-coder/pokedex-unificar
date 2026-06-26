import { useEffect, useState, useCallback, useRef } from "react";
import "../../css/combate.css";
import InputDificultad from "../components/InputDificultad";
import { usePokemonContext } from "../contexts/usePokemonContext";
import { useNavigate } from "react-router-dom";
import type { Pokemon } from "../../domain/entities/pokemon";
import type { MovimientoCombate } from "../../domain/entities/pokemon";
import CartaCombate from "../components/CartaCombate";
import CartaCombateVacia from "../components/CartaCombateVacia";
import AtaquesCombate from "../components/AtaquesCombate";
import {
  crearPokemonCombate,
  calcularDano,
  elegirMovimientoCPU,
  obtenerDebilidadPokemon,
  calcularMultiplicadorTipo,
  obtenerMultiplicadoresTipo,
} from "../../infra/adapters/pokemonApi";

type PokemonCombate = {
  pokemon: Pokemon;
  hpActual: number;
  movimientos: MovimientoCombate[];
};

type ResultadoAtaque = {
  atacante: string;
  movimiento: string;
  dano: number;
  multiplicadorTipo: number;
};

type TablaTipos = Record<
  string,
  { x2: string[]; x0_5: string[]; x0: string[] }
>;

function Combate() {
  const { listaDreamTeam } = usePokemonContext();
  const navigate = useNavigate();

  const [dificultad, setDificultad] = useState("");
  const [pokemonUsuario, setPokemonUsuario] = useState<PokemonCombate | null>(
    null,
  );
  const [pokemonCPU, setPokemonCPU] = useState<PokemonCombate | null>(null);

  const [indiceUsuario, setIndiceUsuario] = useState(0);
  const [indiceCPU, setIndiceCPU] = useState(0);

  const [esperandoMovimiento, setEsperandoMovimiento] = useState(false);
  const [historial, setHistorial] = useState<ResultadoAtaque[]>([]);
  const [ganador, setGanador] = useState<"usuario" | "cpu" | null>(null);
  const [tablaTipos, setTablaTipos] = useState<TablaTipos>({});
  const iniciadoRef = useRef(false);

  const dreamTeamCPU = listaDreamTeam;

  // Validar que haya 6 pokémon
  useEffect(() => {
    if (listaDreamTeam.length < 6) {
      navigate("/dream-team/", {
        state: {
          error: "Necesitas 6 Pokémon para entrar en combate",
        },
      });
    }
  }, [listaDreamTeam, navigate]);

  const inicializarCombate = useCallback(async () => {
    try {
      // Crear tabla de multiplicadores para tipos
      const tabla: TablaTipos = {};
      const tipos = [
        "normal",
        "fire",
        "water",
        "grass",
        "electric",
        "ice",
        "fighting",
        "poison",
        "ground",
        "flying",
        "psychic",
        "bug",
        "rock",
        "ghost",
        "dragon",
        "dark",
        "steel",
        "fairy",
      ];

      for (const tipo of tipos) {
        try {
          const url = `https://pokeapi.co/api/v2/type/${tipo}`;
          tabla[tipo] = await obtenerMultiplicadoresTipo(url);
        } catch {
          // Ignorar errores de tipos que no existan
        }
      }
      setTablaTipos(tabla);

      // Crear primer pokémon del usuario
      const primerPokemonUsuario = await crearPokemonCombate(
        listaDreamTeam[0].numero.toString(),
      );
      setPokemonUsuario(primerPokemonUsuario as PokemonCombate);

      // Crear primer pokémon de CPU
      const primerPokemonCPU = await crearPokemonCombate(
        dreamTeamCPU[0].numero.toString(),
      );
      setPokemonCPU(primerPokemonCPU as PokemonCombate);

      setEsperandoMovimiento(true);
    } catch (error) {
      console.error("Error inicializando combate:", error);
    }
  }, [listaDreamTeam, dreamTeamCPU]);

  // Inicializar combate cuando se selecciona dificultad
  useEffect(() => {
    if (dificultad && !iniciadoRef.current) {
      iniciadoRef.current = true;
      inicializarCombate();
    }
  }, [dificultad]);

  const cambiarCartaUsuario = (e: React.MouseEvent, indice: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!esperandoMovimiento || pokemonUsuario?.hpActual === 0) {
      setIndiceUsuario(indice);
      setPokemonUsuario(null); // Reseteado, se recargará
    }
  };

  const cambiarCartaCPU = (e: React.MouseEvent, indice: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!esperandoMovimiento || pokemonCPU?.hpActual === 0) {
      setIndiceCPU(indice);
      setPokemonCPU(null); // Reseteado, se recargará
    }
  };

  const seleccionarMovimientoUsuario = async (
    movimiento: MovimientoCombate,
  ) => {
    if (!pokemonUsuario || !pokemonCPU || !esperandoMovimiento) return;

    setEsperandoMovimiento(false);

    // CPU elige movimiento
    const debilidades = await obtenerDebilidadPokemon(
      pokemonCPU.pokemon.numero.toString(),
    );
    const debilidadesNombres = debilidades.map((d) => d.name);
    const movimientoCPU = elegirMovimientoCPU(
      pokemonCPU.movimientos,
      debilidadesNombres,
    );

    // Determinar quién ataca primero (velocidad + prioridad del movimiento)
    const prioridadUsuario =
      movimiento.prioridad +
      (pokemonUsuario.pokemon.spd > pokemonCPU.pokemon.spd ? 1 : 0);
    const prioridadCPU =
      movimientoCPU.prioridad +
      (pokemonCPU.pokemon.spd > pokemonUsuario.pokemon.spd ? 1 : 0);

    const ataquesPrimero = prioridadUsuario > prioridadCPU;

    // Ejecutar ataques
    const nuevoHistorial: ResultadoAtaque[] = [];
    let nuevoHPUsuario = pokemonUsuario.hpActual;
    let nuevoHPCPU = pokemonCPU.hpActual;

    if (ataquesPrimero) {
      // Usuario ataca primero
      const resultado1 = await ejecutarAtaque(
        pokemonUsuario,
        pokemonCPU,
        movimiento,
        false,
      );
      nuevoHPCPU -= resultado1.dano;
      nuevoHistorial.push(resultado1);

      if (nuevoHPCPU > 0) {
        // CPU ataca si sigue viva
        const resultado2 = await ejecutarAtaque(
          pokemonCPU,
          pokemonUsuario,
          movimientoCPU,
          true,
        );
        nuevoHPUsuario -= resultado2.dano;
        nuevoHistorial.push(resultado2);
      }
    } else {
      // CPU ataca primero
      const resultado1 = await ejecutarAtaque(
        pokemonCPU,
        pokemonUsuario,
        movimientoCPU,
        true,
      );
      nuevoHPUsuario -= resultado1.dano;
      nuevoHistorial.push(resultado1);

      if (nuevoHPUsuario > 0) {
        // Usuario ataca si sigue vivo
        const resultado2 = await ejecutarAtaque(
          pokemonUsuario,
          pokemonCPU,
          movimiento,
          false,
        );
        nuevoHPCPU -= resultado2.dano;
        nuevoHistorial.push(resultado2);
      }
    }

    // Actualizar HPActual
    nuevoHPUsuario = Math.max(0, nuevoHPUsuario);
    nuevoHPCPU = Math.max(0, nuevoHPCPU);

    const usuarioActualizado = {
      ...pokemonUsuario,
      hpActual: nuevoHPUsuario,
    };
    const cpuActualizada = {
      ...pokemonCPU,
      hpActual: nuevoHPCPU,
    };

    setPokemonUsuario(usuarioActualizado);
    setPokemonCPU(cpuActualizada);
    setHistorial(nuevoHistorial);

    // Verificar si alguno se desmayó
    if (nuevoHPUsuario === 0) {
      // Usuario se desmaya, cambiar pokémon
      const proxIndice = indiceUsuario + 1;
      if (proxIndice < listaDreamTeam.length) {
        const proxPokemon = await crearPokemonCombate(
          listaDreamTeam[proxIndice].numero.toString(),
        );
        setIndiceUsuario(proxIndice);
        setPokemonUsuario(proxPokemon as PokemonCombate);
        setEsperandoMovimiento(true);
      } else {
        // Usuario perdió
        setGanador("cpu");
      }
    } else if (nuevoHPCPU === 0) {
      // CPU se desmaya, cambiar pokémon
      const proxIndice = indiceCPU + 1;
      if (proxIndice < dreamTeamCPU.length) {
        const proxPokemon = await crearPokemonCombate(
          dreamTeamCPU[proxIndice].numero.toString(),
        );
        setIndiceCPU(proxIndice);
        setPokemonCPU(proxPokemon as PokemonCombate);
        setEsperandoMovimiento(true);
      } else {
        // CPU perdió
        setGanador("usuario");
      }
    } else {
      // Ambos siguen vivos
      setEsperandoMovimiento(true);
    }
  };

  const ejecutarAtaque = async (
    atacante: PokemonCombate,
    defensor: PokemonCombate,
    movimiento: MovimientoCombate,
    esAtaqueCPU: boolean,
  ): Promise<ResultadoAtaque> => {
    let multiplicadorTipo = 1;

    if (movimiento.potencia !== null) {
      const tiposAtaque = [movimiento.tipo];
      const tiposDefensa = defensor.pokemon.tipos;

      multiplicadorTipo = await calcularMultiplicadorTipo(
        tiposAtaque,
        tiposDefensa,
        tablaTipos,
      );
    }

    const dano = calcularDano(
      atacante.pokemon.atk,
      defensor.pokemon.def,
      movimiento.potencia,
      multiplicadorTipo,
      dificultad,
      esAtaqueCPU,
    );

    return {
      atacante: atacante.pokemon.nombre,
      movimiento: movimiento.nombre,
      dano,
      multiplicadorTipo,
    };
  };

  if (listaDreamTeam.length < 6) {
    return null;
  }

  if (!dificultad) {
    return (
      <div className="combate-dificultad">
        <InputDificultad setDificultad={setDificultad} />
      </div>
    );
  }

  if (ganador) {
    return (
      <div className="combate-finalizado">
        <div className="combate-ganador">
          <h1>{ganador === "usuario" ? "¡GANASTE!" : "¡PERDISTE!"}</h1>
          <button onClick={() => navigate("/dream-team")}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="combate">
      <div className="combate-panel-usuario">
        <div className="combate-cartas">
          {listaDreamTeam.map((pokemon, indice) => (
            <div
              key={pokemon.numero}
              className={`combate-carta ${indice === indiceUsuario ? "activo" : ""}`}
              onClick={(e) => cambiarCartaUsuario(e, indice)}
            >
              <CartaCombate pokemon={pokemon} />
            </div>
          ))}
        </div>

        <div className="combate-carta-actual">
          {pokemonUsuario ? (
            <>
              <div className="combate-carta-pokemon-elegida">
                <CartaCombate pokemon={pokemonUsuario.pokemon} />
                <div className="combate-hp-activo">
                  <p className="combate-hp-dinamico">
                    HP: {pokemonUsuario.hpActual} / {pokemonUsuario.pokemon.hp}
                  </p>
                  <div className="combate-barra-hp">
                    <div
                      className="combate-barra-hp-llena"
                      style={{
                        width: `${(pokemonUsuario.hpActual / pokemonUsuario.pokemon.hp) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="combate-movimientos">
                {esperandoMovimiento && pokemonUsuario.hpActual > 0 && (
                  <AtaquesCombate
                    pokemon={pokemonUsuario.pokemon}
                    onMovimientoSeleccionado={seleccionarMovimientoUsuario}
                  />
                )}
              </div>
            </>
          ) : (
            <CartaCombateVacia />
          )}
        </div>
      </div>

      <div className="combate-historial">
        <h2 className="combate-historial-titulo">Último Turno:</h2>
        {historial.map((resultado, idx) => (
          <div key={idx} className="combate-resultado-ataque">
            <div >
              <p >
                <strong className="combate-resultado-pokemon">
                  {resultado.atacante}
                </strong>{" "}
                usó{" "}
                <div></div>
                <strong className="combate-resultado-movimiento">
                  {resultado.movimiento}
                </strong>
              </p>
              <p className="combate-resultado-daño">
                Daño: <strong>{resultado.dano}</strong>
              </p>
            </div>
            {resultado.multiplicadorTipo !== 1 && (
              <p>
                Efectividad:{" "}
                <strong>
                  {resultado.multiplicadorTipo === 2
                    ? "¡Muy efectivo!"
                    : resultado.multiplicadorTipo === 0.5
                      ? "Poco efectivo"
                      : "Sin efecto"}
                </strong>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="combate-panel-cpu">
        <div className="combate-carta-actual">
          {pokemonCPU ? (
            <>
              <div className="combate-carta-pokemon-elegida">
                <CartaCombate pokemon={pokemonCPU.pokemon} />
                <div className="combate-hp-activo">
                  <p className="combate-hp-dinamico">
                    HP: {pokemonCPU.hpActual} / {pokemonCPU.pokemon.hp}
                  </p>
                  <div className="combate-barra-hp">
                    <div
                      className="combate-barra-hp-llena"
                      style={{
                        width: `${(pokemonCPU.hpActual / pokemonCPU.pokemon.hp) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="combate-movimientos">
                {esperandoMovimiento && pokemonCPU.hpActual > 0 && (
                  <AtaquesCombate pokemon={pokemonCPU.pokemon} />
                )}
              </div>
            </>
          ) : (
            <CartaCombateVacia />
          )}
        </div>
        <div className="combate-cartas">
          {dreamTeamCPU.map((pokemon, indice) => (
            <div
              key={pokemon.numero}
              className={`combate-carta ${indice === indiceCPU ? "activo" : ""}`}
              onClick={(e) => cambiarCartaCPU(e, indice)}
            >
              <CartaCombate pokemon={pokemon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Combate;
