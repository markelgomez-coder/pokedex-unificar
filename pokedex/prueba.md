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
  obtenerMultiplicadoresTipo,
  calcularMultiplicadorTipo,
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

type Fase = "dificultad" | "cargando" | "seleccionInicial" | "combate" | "finalizado";

const RANGO_MAX_NUMERO = 151; // ajustar si tu pool de pokémon es mayor
const NUM_CANDIDATOS_CPU = 30; // cuántos candidatos se evalúan para formar el equipo CPU

// ------------------------------------------------------------------
// Helpers de tipos / dificultad (independientes del adapter)
// ------------------------------------------------------------------

function normalizarDificultad(d: string): string {
  return d
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function obtenerMultiplicadorIndividual(
  tipoAtacante: string,
  tipoDefensor: string,
  tabla: TablaTipos,
): number {
  const entrada = tabla[tipoAtacante];
  if (!entrada) return 1;
  if (entrada.x0.includes(tipoDefensor)) return 0;
  if (entrada.x2.includes(tipoDefensor)) return 2;
  if (entrada.x0_5.includes(tipoDefensor)) return 0.5;
  return 1;
}

// Mejor multiplicador posible atacando con `tiposAtacante` contra `tiposDefensor`
function calcularVentajaTipo(
  tiposAtacante: string[],
  tiposDefensor: string[],
  tabla: TablaTipos,
): number {
  let mejor = 0;
  for (const tipoAtq of tiposAtacante) {
    let mult = 1;
    for (const tipoDef of tiposDefensor) {
      mult *= obtenerMultiplicadorIndividual(tipoAtq, tipoDef, tabla);
    }
    mejor = Math.max(mejor, mult);
  }
  return mejor;
}

// Puntuación de "qué tan buen counter" es `candidato` contra `rival`
// (ataque que le hace - daño que recibe). Más alto = mejor counter.
function puntuarEnfrentamiento(
  tiposCandidato: string[],
  tiposRival: string[],
  tabla: TablaTipos,
): number {
  const ataque = calcularVentajaTipo(tiposCandidato, tiposRival, tabla);
  const defensa = calcularVentajaTipo(tiposRival, tiposCandidato, tabla);
  return ataque - defensa;
}

// Elige `cantidad` elementos sin repetir, con más probabilidad para los
// primeros de la lista (la lista debe venir ya ordenada por preferencia).
function elegirAleatoriosPonderados<T>(lista: T[], cantidad: number): T[] {
  const copia = [...lista];
  const elegidos: T[] = [];
  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const pesos = copia.map((_, idx) => copia.length - idx);
    const total = pesos.reduce((a, b) => a + b, 0);
    let azar = Math.random() * total;
    let indiceElegido = 0;
    for (let j = 0; j < pesos.length; j++) {
      azar -= pesos[j];
      if (azar <= 0) {
        indiceElegido = j;
        break;
      }
    }
    elegidos.push(copia[indiceElegido]);
    copia.splice(indiceElegido, 1);
  }
  return elegidos;
}

async function obtenerTiposPokemon(numero: number): Promise<string[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${numero}`);
  const data = await res.json();
  return data.types.map((t: { type: { name: string } }) => t.type.name);
}

// ------------------------------------------------------------------
// Componente
// ------------------------------------------------------------------

function Combate() {
  const { listaDreamTeam } = usePokemonContext();
  const navigate = useNavigate();

  const [dificultad, setDificultad] = useState("");
  const [fase, setFase] = useState<Fase>("dificultad");

  const [tablaTipos, setTablaTipos] = useState<TablaTipos>({});

  // Equipo del usuario: igual que listaDreamTeam, pero con HP persistente
  const [equipoUsuario, setEquipoUsuario] = useState<(PokemonCombate | null)[]>(
    [],
  );
  // Equipo de la CPU: ids elegidos por la IA + slots cargados perezosamente
  const [equipoCPUIds, setEquipoCPUIds] = useState<number[]>([]);
  const [equipoCPU, setEquipoCPU] = useState<(PokemonCombate | null)[]>([]);

  const [indiceUsuario, setIndiceUsuario] = useState<number | null>(null);
  const [indiceCPU, setIndiceCPU] = useState<number | null>(null);

  const [esperandoMovimiento, setEsperandoMovimiento] = useState(false);
  const [historial, setHistorial] = useState<ResultadoAtaque[]>([]);
  const [ganador, setGanador] = useState<"usuario" | "cpu" | null>(null);
  const iniciadoRef = useRef(false);

  const pokemonUsuario =
    indiceUsuario !== null ? equipoUsuario[indiceUsuario] ?? null : null;
  const pokemonCPU =
    indiceCPU !== null ? equipoCPU[indiceCPU] ?? null : null;

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

  // Genera el equipo de 6 ids de la CPU evaluando candidatos al azar
  // (declarada antes de inicializarCombate porque se usa dentro de ella)
  async function generarEquipoCPU(
    dificultadActual: string,
    equipoUsuarioPokemon: Pokemon[],
    tabla: TablaTipos,
  ): Promise<number[]> {
    const idsCandidatos = new Set<number>();
    while (idsCandidatos.size < NUM_CANDIDATOS_CPU) {
      idsCandidatos.add(1 + Math.floor(Math.random() * RANGO_MAX_NUMERO));
    }

    const candidatos = await Promise.all(
      Array.from(idsCandidatos).map(async (numero) => {
        const tiposCandidato = await obtenerTiposPokemon(numero);
        const puntuacion =
          equipoUsuarioPokemon.reduce(
            (acc, p) => acc + puntuarEnfrentamiento(tiposCandidato, p.tipos, tabla),
            0,
          ) / equipoUsuarioPokemon.length;
        return { numero, puntuacion };
      }),
    );

    const d = normalizarDificultad(dificultadActual);
    let ordenados: typeof candidatos;
    let tamanoGrupo: number;

    if (d === "imposible") {
      ordenados = [...candidatos].sort((a, b) => b.puntuacion - a.puntuacion);
      tamanoGrupo = 4; // counter casi total, pero con algo de variedad entre partidas
    } else if (d === "dificil") {
      ordenados = [...candidatos].sort((a, b) => b.puntuacion - a.puntuacion);
      tamanoGrupo = 12;
    } else if (d === "facil") {
      ordenados = [...candidatos].sort((a, b) => a.puntuacion - b.puntuacion);
      tamanoGrupo = 4; // anticounter casi total
    } else {
      // "normal" o cualquier otro valor: bastante aleatorio
      ordenados = [...candidatos].sort(() => Math.random() - 0.5);
      tamanoGrupo = candidatos.length;
    }

    const grupo = ordenados.slice(0, tamanoGrupo);
    return elegirAleatoriosPonderados(grupo, 6).map((c) => c.numero);
  }

  // ----------------------------------------------------------------
  // Construcción de la tabla de tipos + equipo de la CPU según dificultad
  // ----------------------------------------------------------------
  const inicializarCombate = useCallback(async () => {
    try {
      setFase("cargando");

      const tabla: TablaTipos = {};
      const tipos = [
        "normal", "fire", "water", "grass", "electric", "ice",
        "fighting", "poison", "ground", "flying", "psychic", "bug",
        "rock", "ghost", "dragon", "dark", "steel", "fairy",
      ];
      for (const tipo of tipos) {
        try {
          const url = `https://pokeapi.co/api/v2/type/${tipo}`;
          tabla[tipo] = await obtenerMultiplicadoresTipo(url);
        } catch {
          // Ignorar tipos que fallen
        }
      }
      setTablaTipos(tabla);

      // Reservar slots vacíos para el equipo del usuario (HP se carga al elegir)
      setEquipoUsuario(new Array(listaDreamTeam.length).fill(null));

      // Elegir el equipo de la CPU en base a la dificultad y al equipo del usuario
      const idsCPU = await generarEquipoCPU(dificultad, listaDreamTeam, tabla);
      setEquipoCPUIds(idsCPU);
      setEquipoCPU(new Array(idsCPU.length).fill(null));

      setFase("seleccionInicial");
    } catch (error) {
      console.error("Error inicializando combate:", error);
    }
  }, [listaDreamTeam, dificultad]);

  useEffect(() => {
    if (dificultad && !iniciadoRef.current) {
      iniciadoRef.current = true;
      inicializarCombate();
    }
  }, [dificultad, inicializarCombate]);

  // Elige, dentro de los índices vivos de equipoCPUIds, cuál debe entrar
  // a combatir contra el pokémon activo del usuario, según dificultad.
  async function elegirEntradaCPU(
    rival: Pokemon,
    indicesDisponibles: number[],
  ): Promise<number> {
    const d = normalizarDificultad(dificultad);

    const puntuados = await Promise.all(
      indicesDisponibles.map(async (indice) => {
        const slotExistente = equipoCPU[indice];
        const tiposCandidato = slotExistente
          ? slotExistente.pokemon.tipos
          : await obtenerTiposPokemon(equipoCPUIds[indice]);
        const puntuacion = puntuarEnfrentamiento(tiposCandidato, rival.tipos, tablaTipos);
        return { indice, puntuacion };
      }),
    );

    let ordenados: typeof puntuados;
    if (d === "imposible" || d === "dificil") {
      ordenados = [...puntuados].sort((a, b) => b.puntuacion - a.puntuacion);
    } else if (d === "facil") {
      ordenados = [...puntuados].sort((a, b) => a.puntuacion - b.puntuacion);
    } else {
      ordenados = [...puntuados].sort(() => Math.random() - 0.5);
    }

    const grupo = ordenados.slice(0, Math.min(3, ordenados.length));
    return elegirAleatoriosPonderados(grupo, 1)[0].indice;
  }

  // Carga (si hace falta) y devuelve el PokemonCombate de un slot de la CPU
  async function cargarSlotCPU(indice: number): Promise<PokemonCombate> {
    const existente = equipoCPU[indice];
    if (existente) return existente;
    const nuevo = (await crearPokemonCombate(
      equipoCPUIds[indice].toString(),
    )) as PokemonCombate;
    setEquipoCPU((prev) => {
      const copia = [...prev];
      copia[indice] = nuevo;
      return copia;
    });
    return nuevo;
  }

  // Carga (si hace falta) y devuelve el PokemonCombate de un slot del usuario
  async function cargarSlotUsuario(indice: number): Promise<PokemonCombate> {
    const existente = equipoUsuario[indice];
    if (existente) return existente;
    const nuevo = (await crearPokemonCombate(
      listaDreamTeam[indice].numero.toString(),
    )) as PokemonCombate;
    setEquipoUsuario((prev) => {
      const copia = [...prev];
      copia[indice] = nuevo;
      return copia;
    });
    return nuevo;
  }

  // El usuario elige con qué pokémon empezar (pantalla de selección inicial)
  const iniciarConPokemon = async (indice: number) => {
    const slotUsuario = await cargarSlotUsuario(indice);
    setIndiceUsuario(indice);

    const indiceEntradaCPU = await elegirEntradaCPU(
      slotUsuario.pokemon,
      equipoCPUIds.map((_, i) => i),
    );
    await cargarSlotCPU(indiceEntradaCPU);
    setIndiceCPU(indiceEntradaCPU);

    setFase("combate");
    setEsperandoMovimiento(true);
  };

  // Cambio táctico de pokémon del usuario (solo con pokémon vivos)
  const cambiarCartaUsuario = async (e: React.MouseEvent, indice: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (fase !== "combate" || !esperandoMovimiento) return;
    if (indiceUsuario === indice) return;

    const slot = equipoUsuario[indice];
    const estaVivo = !slot || slot.hpActual > 0; // null = aún no cargado = vivo
    if (!estaVivo) return;

    await cargarSlotUsuario(indice);
    setIndiceUsuario(indice);
  };

  function indicesVivos(
    equipo: (PokemonCombate | null)[],
    excluir?: number,
  ): number[] {
    return equipo
      .map((_, i) => i)
      .filter((i) => i !== excluir && (!equipo[i] || (equipo[i] as PokemonCombate).hpActual > 0));
  }

  function elegirMovimientoSegunDificultad(
    movimientos: MovimientoCombate[],
    tiposDefensor: string[],
  ): MovimientoCombate {
    const conPuntuacion = movimientos.map((m) => {
      const multiplicador =
        m.potencia !== null ? calcularVentajaTipo([m.tipo], tiposDefensor, tablaTipos) : 1;
      const potenciaEfectiva = (m.potencia ?? 0) * multiplicador;
      return { movimiento: m, potenciaEfectiva };
    });

    const d = normalizarDificultad(dificultad);

    if (d === "imposible") {
      return [...conPuntuacion].sort((a, b) => b.potenciaEfectiva - a.potenciaEfectiva)[0].movimiento;
    }
    if (d === "facil") {
      return [...conPuntuacion].sort((a, b) => a.potenciaEfectiva - b.potenciaEfectiva)[0].movimiento;
    }
    if (d === "dificil") {
      const ordenados = [...conPuntuacion].sort((a, b) => b.potenciaEfectiva - a.potenciaEfectiva);
      return elegirAleatoriosPonderados(ordenados.slice(0, 2), 1)[0].movimiento;
    }
    // "normal": bastante al azar entre todos los movimientos
    return conPuntuacion[Math.floor(Math.random() * conPuntuacion.length)].movimiento;
  }

  const seleccionarMovimientoUsuario = async (
    movimiento: MovimientoCombate,
  ) => {
    if (!pokemonUsuario || !pokemonCPU || !esperandoMovimiento) return;
    if (indiceUsuario === null || indiceCPU === null) return;

    setEsperandoMovimiento(false);

    const movimientoCPU = elegirMovimientoSegunDificultad(
      pokemonCPU.movimientos,
      pokemonUsuario.pokemon.tipos,
    );

    const prioridadUsuario =
      movimiento.prioridad +
      (pokemonUsuario.pokemon.spd > pokemonCPU.pokemon.spd ? 1 : 0);
    const prioridadCPU =
      movimientoCPU.prioridad +
      (pokemonCPU.pokemon.spd > pokemonUsuario.pokemon.spd ? 1 : 0);

    const ataquesPrimero = prioridadUsuario > prioridadCPU;

    const nuevoHistorial: ResultadoAtaque[] = [];
    let nuevoHPUsuario = pokemonUsuario.hpActual;
    let nuevoHPCPU = pokemonCPU.hpActual;

    if (ataquesPrimero) {
      const resultado1 = await ejecutarAtaque(pokemonUsuario, pokemonCPU, movimiento, false);
      nuevoHPCPU -= resultado1.dano;
      nuevoHistorial.push(resultado1);

      if (nuevoHPCPU > 0) {
        const resultado2 = await ejecutarAtaque(pokemonCPU, pokemonUsuario, movimientoCPU, true);
        nuevoHPUsuario -= resultado2.dano;
        nuevoHistorial.push(resultado2);
      }
    } else {
      const resultado1 = await ejecutarAtaque(pokemonCPU, pokemonUsuario, movimientoCPU, true);
      nuevoHPUsuario -= resultado1.dano;
      nuevoHistorial.push(resultado1);

      if (nuevoHPUsuario > 0) {
        const resultado2 = await ejecutarAtaque(pokemonUsuario, pokemonCPU, movimiento, false);
        nuevoHPCPU -= resultado2.dano;
        nuevoHistorial.push(resultado2);
      }
    }

    nuevoHPUsuario = Math.max(0, nuevoHPUsuario);
    nuevoHPCPU = Math.max(0, nuevoHPCPU);

    const usuarioActualizado = { ...pokemonUsuario, hpActual: nuevoHPUsuario };
    const cpuActualizada = { ...pokemonCPU, hpActual: nuevoHPCPU };

    // Persistimos el HP en el array de cada equipo (para que no se "cure" al cambiar)
    setEquipoUsuario((prev) => {
      const copia = [...prev];
      copia[indiceUsuario] = usuarioActualizado;
      return copia;
    });
    setEquipoCPU((prev) => {
      const copia = [...prev];
      copia[indiceCPU] = cpuActualizada;
      return copia;
    });
    setHistorial(nuevoHistorial);

    if (nuevoHPUsuario === 0) {
      const vivosUsuario = indicesVivos(
        equipoUsuario.map((s, i) => (i === indiceUsuario ? usuarioActualizado : s)),
      );
      if (vivosUsuario.length === 0) {
        setGanador("cpu");
        setFase("finalizado");
        return;
      }
      // El usuario debe elegir manualmente con cuál sigue (no auto-avanzamos)
      setIndiceUsuario(null);
      setEsperandoMovimiento(false);
      // pequeño truco: reutilizamos la fase "combate" pero sin activo de usuario
      // hasta que pulse una de sus cartas vivas (ver render más abajo)
    } else if (nuevoHPCPU === 0) {
      const equipoCPUActualizado = equipoCPU.map((s, i) =>
        i === indiceCPU ? cpuActualizada : s,
      );
      const vivosCPU = indicesVivos(equipoCPUActualizado);
      if (vivosCPU.length === 0) {
        setGanador("usuario");
        setFase("finalizado");
        return;
      }
      const proxIndiceCPU = await elegirEntradaCPU(usuarioActualizado.pokemon, vivosCPU);
      await cargarSlotCPU(proxIndiceCPU);
      setIndiceCPU(proxIndiceCPU);
      setEsperandoMovimiento(true);
    } else {
      setEsperandoMovimiento(true);
    }
  };

  // El usuario elige manualmente a quién sacar tras que su activo caiga
  const elegirReemplazoUsuario = async (indice: number) => {
    const slot = equipoUsuario[indice];
    const estaVivo = !slot || slot.hpActual > 0;
    if (!estaVivo) return;
    await cargarSlotUsuario(indice);
    setIndiceUsuario(indice);
    setEsperandoMovimiento(true);
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

  if (fase === "dificultad") {
    return (
      <div className="combate-dificultad">
        <InputDificultad setDificultad={setDificultad} />
      </div>
    );
  }

  if (fase === "cargando") {
    return (
      <div className="combate-cargando">
        <p>Preparando el combate...</p>
      </div>
    );
  }

  if (fase === "seleccionInicial") {
    return (
      <div className="combate-seleccion-inicial">
        <h2>Elige con qué Pokémon empezar</h2>
        <div className="combate-cartas">
          {listaDreamTeam.map((pokemon, indice) => (
            <div
              key={pokemon.numero}
              className="combate-carta"
              onClick={() => iniciarConPokemon(indice)}
            >
              <CartaCombate pokemon={pokemon} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (fase === "finalizado" && ganador) {
    return (
      <div className="combate-finalizado">
        <div className="combate-ganador">
          <h1>{ganador === "usuario" ? "¡GANASTE!" : "¡PERDISTE!"}</h1>
          <button onClick={() => navigate("/dream-team")}>Volver</button>
        </div>
      </div>
    );
  }

  // fase === "combate"
  const necesitaReemplazoUsuario = indiceUsuario === null;

  return (
    <div className="combate">
      <div className="combate-panel-usuario">
        <div className="combate-cartas">
          {listaDreamTeam.map((pokemon, indice) => {
            const slot = equipoUsuario[indice];
            const debilitado = !!slot && slot.hpActual === 0;
            return (
              <div
                key={pokemon.numero}
                className={`combate-carta ${indice === indiceUsuario ? "activo" : ""} ${debilitado ? "combate-carta-deshabilitada" : ""}`}
                onClick={(e) =>
                  necesitaReemplazoUsuario
                    ? elegirReemplazoUsuario(indice)
                    : cambiarCartaUsuario(e, indice)
                }
              >
                <CartaCombate pokemon={pokemon} />
              </div>
            );
          })}
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
        {necesitaReemplazoUsuario && (
          <p className="combate-aviso">¡Tu Pokémon se debilitó! Elige otro de tu equipo.</p>
        )}
      </div>

      <div className="combate-historial">
        <h2 className="combate-historial-titulo">Último Turno:</h2>
        {historial.map((resultado, idx) => (
          <div key={idx} className="combate-resultado-ataque">
            <div>
              <p>
                <strong className="combate-resultado-pokemon">
                  {resultado.atacante}
                </strong>{" "}
                usó{" "}
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

      {/* Panel CPU: solo se ve la carta activa, el resto va oculto */}
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
            </>
          ) : (
            <CartaCombateVacia />
          )}
        </div>
        <div className="combate-cartas">
          {equipoCPUIds.map((idCPU, indice) => (
            <div
              key={idCPU}
              className={`combate-carta ${indice === indiceCPU ? "activo" : ""}`}
            >
              {indice === indiceCPU && pokemonCPU ? (
                <CartaCombate pokemon={pokemonCPU.pokemon} />
              ) : (
                <div className="combate-carta-oculta">
                  <span>?</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Combate;