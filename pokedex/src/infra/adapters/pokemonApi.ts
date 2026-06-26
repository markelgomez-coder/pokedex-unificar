import type {
  Pokemon,
  TipoPokemon,
  DanoPokemon,
  FlavorTextEntry,
  EvolutionNode,
  PokemonCombate,
  StatChangeAPI,
  MovimientoCombate,
} from "../../domain/entities/pokemon";

import { hacerFetch } from "../http/fetch";

export async function obtenerPokemon(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  const data = await hacerFetch(url);

  const pokemon = {
    nombre: data.name,
    numero: data.id,
    imagen: data.sprites.other["official-artwork"].front_default,
    tipos: data.types.map((t: TipoPokemon) => t.type.name),
    peso: data.weight / 10,
    altura: data.height / 10,
    hp: data.stats[0].base_stat,
    atk: data.stats[1].base_stat,
    def: data.stats[2].base_stat,
    sat: data.stats[3].base_stat,
    sdf: data.stats[4].base_stat,
    spd: data.stats[5].base_stat,
    dream_team: false,
  };

  return pokemon;
}

export async function obtenerPokemonDescripcion(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  const data = await hacerFetch(url);

  const entradaEspanol = data.flavor_text_entries.find(
    (entry: FlavorTextEntry) => entry.language.name === "es",
  );
  // fallback a inglés si no hay descripción en español
  const entradaFallback =
    entradaEspanol ??
    data.flavor_text_entries.find(
      (entry: FlavorTextEntry) => entry.language.name === "en",
    );

  if (!entradaFallback || !entradaFallback.flavor_text) return "";

  return entradaFallback.flavor_text.replace(/[\f]/g, " ");
}

export async function obtenerPokemonTipos(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  const data = await hacerFetch(url);

  const pokemon_tipos = {
    tipos: data.types.map((t: TipoPokemon) => t.type.name),
    tipos_url: data.types.map((t: TipoPokemon) => t.type.url),
  };
  return pokemon_tipos;
}

export async function obtenerEficaciaPokemon(url: string) {
  const data = await hacerFetch(url);

  return {
    doble_dano: data.damage_relations.double_damage_from as DanoPokemon[],
    mitad_dano: data.damage_relations.half_damage_from as DanoPokemon[],
    no_dano: data.damage_relations.no_damage_from as DanoPokemon[],
  };
}

export async function obtenerDebilidadPokemon(
  id: string,
): Promise<DanoPokemon[]> {
  const tiposData = await obtenerPokemonTipos(id);
  let dobleDanoTotales: DanoPokemon[] = [];

  for (const url of tiposData.tipos_url) {
    const debilidades = await obtenerEficaciaPokemon(url);
    dobleDanoTotales = dobleDanoTotales.concat(debilidades.doble_dano);
  }

  const unificado = Array.from(
    new Map(dobleDanoTotales.map((d) => [d.name, d])).values(),
  );
  return unificado;
}

export async function obtenerResistenciaPokemon(
  id: string,
): Promise<DanoPokemon[]> {
  const tiposData = await obtenerPokemonTipos(id);
  let mitadDanoTotales: DanoPokemon[] = [];

  for (const url of tiposData.tipos_url) {
    const debilidades = await obtenerEficaciaPokemon(url);
    mitadDanoTotales = mitadDanoTotales.concat(debilidades.mitad_dano);
  }

  const unificado = Array.from(
    new Map(mitadDanoTotales.map((d) => [d.name, d])).values(),
  );
  return unificado;
}

export async function obtenerInmunidadPokemon(
  id: string,
): Promise<DanoPokemon[]> {
  const tiposData = await obtenerPokemonTipos(id);
  let noDanoTotales: DanoPokemon[] = [];

  for (const url of tiposData.tipos_url) {
    const debilidades = await obtenerEficaciaPokemon(url);
    noDanoTotales = noDanoTotales.concat(debilidades.no_dano);
  }

  const unificado = Array.from(
    new Map(noDanoTotales.map((d) => [d.name, d])).values(),
  );
  return unificado;
}

export async function obtenerPokemonEvolucionesLink(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  const data = await hacerFetch(url);

  return data.evolution_chain.url;
}

export async function obtenerPokemonEvoluciones(
  url: string,
): Promise<Pokemon[]> {
  const data = await hacerFetch(url);

  const evoluciones = await extraerEvoluciones(data.chain);
  return evoluciones;
}

export async function extraerEvoluciones(
  chain: EvolutionNode,
): Promise<Pokemon[]> {
  const resultado: Pokemon[] = [];

  async function recorrer(nodo: EvolutionNode) {
    const pokemon = await obtenerPokemon(nodo.species.name);
    resultado.push(pokemon);

    for (const evo of nodo.evolves_to) {
      await recorrer(evo);
    }
  }

  await recorrer(chain);
  return resultado;
}

export async function obtenerMovimientosPokemon(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  const data = await hacerFetch(url);

  return data.moves.map((m: { move: { name: string; url: string } }) => ({
    nombre: m.move.name,
    url: m.move.url,
  }));
}

export async function obtenerMovimiento(url: string) {
  const data = await hacerFetch(url);

  return {
    nombre: data.name,

    potencia: data.power,
    precision: data.accuracy,

    ppMax: data.pp,
    ppActual: data.pp,

    prioridad: data.priority,

    tipo: data.type.name,

    categoria: data.damage_class.name,

    estado: data.meta?.ailment?.name ?? null,

    probabilidadEstado: data.effect_chance,

    cambiosStats:
      data.stat_changes?.map((c: StatChangeAPI) => ({
        stat: c.stat.name,
        cambio: c.change,
      })) ?? [],
  };
}

export async function obtenerMovimientosCombate(id: string) {
  const movimientos = await obtenerMovimientosPokemon(id);

  const seleccionados = [];

  for (const mov of movimientos) {
    const detalle = await obtenerMovimiento(mov.url);

    if (detalle.potencia !== null || detalle.categoria === "status") {
      seleccionados.push(detalle);
    }

    if (seleccionados.length === 4) break;
  }

  return seleccionados;
}

export async function obtenerTipoDamage(url: string) {
  const data = await hacerFetch(url);

  return {
    dobleDanoA: data.damage_relations.double_damage_to.map(
      (t: DanoPokemon) => t.name,
    ),

    mitadDanoA: data.damage_relations.half_damage_to.map(
      (t: DanoPokemon) => t.name,
    ),

    noDanoA: data.damage_relations.no_damage_to.map((t: DanoPokemon) => t.name),
  };
}

export async function obtenerTiposCombate(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  const data = await hacerFetch(url);

  return data.types.map((t: TipoPokemon) => t.type.name);
}

export async function crearPokemonCombate(id: string): Promise<PokemonCombate> {
  const pokemon = await obtenerPokemon(id);

  const movimientos = await obtenerMovimientosCombate(id);

  return {
    pokemon,

    hpActual: pokemon.hp,

    estado: null,

    atkStage: 0,
    defStage: 0,

    satStage: 0,
    sdfStage: 0,

    spdStage: 0,

    accuracyStage: 0,
    evasionStage: 0,

    movimientos,
  };
}

export async function obtenerMultiplicadoresTipo(url: string) {
  const data = await hacerFetch(url);

  return {
    x2: data.damage_relations.double_damage_from.map(
      (t: DanoPokemon) => t.name,
    ),

    x0_5: data.damage_relations.half_damage_from.map(
      (t: DanoPokemon) => t.name,
    ),

    x0: data.damage_relations.no_damage_from.map((t: DanoPokemon) => t.name),
  };
}
export async function calcularMultiplicadorTipo(
  tiposAtaque: string[],
  tiposDefensa: string[],
  tabla: Record<string, { x2: string[]; x0_5: string[]; x0: string[] }>,
) {
  let multiplier = 1;

  for (const tipoAtaque of tiposAtaque) {
    for (const tipoDef of tiposDefensa) {
      if (tabla[tipoDef]?.x0?.includes(tipoAtaque)) {
        return 0;
      }

      if (tabla[tipoDef]?.x2?.includes(tipoAtaque)) multiplier *= 2;

      if (tabla[tipoDef]?.x0_5?.includes(tipoAtaque)) multiplier *= 0.5;
    }
    if (multiplier === 0) return 0;
  }

  return multiplier;
}

// Función para obtener el multiplicador de dificultad
export function obtenerModificadorDificultad(
  dificultad: string,
  esAtaqueCPU: boolean,
): number {
  const modificadores: Record<string, { usuario: number; cpu: number }> = {
    facil: { usuario: 1.3, cpu: 0.7 },
    medio: { usuario: 1, cpu: 1 },
    dificil: { usuario: 0.7, cpu: 1.3 },
    imposible: { usuario: 0.5, cpu: 1.5 },
  };

  const mod = modificadores[dificultad] || modificadores.medio;
  return esAtaqueCPU ? mod.cpu : mod.usuario;
}

// Función para calcular daño de un ataque
export function calcularDano(
  ataque: number,
  defensa: number,
  potencia: number | null,
  multiplicadorTipo: number,
  dificultad: string,
  esAtaqueCPU: boolean,
): number {
  // Si el movimiento no tiene potencia (status move), no hace daño
  if (!potencia || potencia === 0) return 0;

  // Fórmula simplificada de daño Pokémon
  const danoBase = ((2 * ataque) / 5 + 2) * potencia * (ataque / defensa) / 50 + 2;

  // Aplicar multiplicador de tipo
  let dano = danoBase * multiplicadorTipo;

  // Variación aleatoria (85-100%)
  const variacion = 0.85 + Math.random() * 0.15;
  dano = dano * variacion;

  // Aplicar modificador de dificultad
  const modificador = obtenerModificadorDificultad(dificultad, esAtaqueCPU);
  dano = Math.floor(dano * modificador);

  return Math.max(1, dano); // Mínimo 1 de daño
}

// Función para elegir un movimiento para la CPU
export function elegirMovimientoCPU(
  movimientos: MovimientoCombate[],
  debilidadesOponente: string[],
): MovimientoCombate {
  // Preferir movimientos que golpeen debilidades del oponente
  const movimientosDebilidad = movimientos.filter(
    (m) =>
      m.potencia !== null &&
      debilidadesOponente.includes(m.tipo),
  );

  if (movimientosDebilidad.length > 0) {
    return movimientosDebilidad[
      Math.floor(Math.random() * movimientosDebilidad.length)
    ];
  }

  // Si no hay debilidades, preferir movimientos que hagan daño
  const movimientosDano = movimientos.filter((m) => m.potencia !== null);

  if (movimientosDano.length > 0) {
    return movimientosDano[
      Math.floor(Math.random() * movimientosDano.length)
    ];
  }

  // Si todo falla, elegir cualquier movimiento
  return movimientos[Math.floor(Math.random() * movimientos.length)];
}

// Función para obtener tipos de un Pokémon para el combate
export async function obtenerTiposParaCombate(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const data = await hacerFetch(url);
  return data.types.map((t: TipoPokemon) => t.type.name);
}
