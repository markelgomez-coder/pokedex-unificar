export type Pokemon = {
  nombre: string;
  numero: number;
  imagen: string;
  tipos: Array<string>;
  peso: number;
  altura: number;
  hp: number;
  atk: number;
  def: number;
  sat: number;
  sdf: number;
  spd: number;
  dream_team: boolean;
};

export type PokemonAPI = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  results: PokemonAPI[];
};

export type Type = {
  name: string;
  url: string;
};

export type TipoPokemon = {
  slot: number;
  type: Type;
};

export type DanoPokemon = {
  name: string;
  url: string;
};

export type EvolutionNode = {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionNode[];
};

export type FlavorTextEntry = {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
};

export type MovimientoCombate = {
  nombre: string;

  potencia: number | null;
  precision: number | null;

  ppMax: number;
  ppActual: number;

  prioridad: number;

  tipo: string;

  categoria: "physical" | "special" | "status";

  estado: string | null;

  probabilidadEstado: number | null;

  cambiosStats: {
    stat: string;
    cambio: number;
  }[];
};

export type EstadoCombate =
  | "burn"
  | "poison"
  | "sleep"
  | "paralysis"
  | "freeze"
  | "confusion"
  | null;

export type PokemonCombate = {
  pokemon: Pokemon;

  hpActual: number;

  estado: EstadoActivo | null;

  atkStage: number;
  defStage: number;

  satStage: number;
  sdfStage: number;

  spdStage: number;

  accuracyStage: number;
  evasionStage: number;

  movimientos: MovimientoCombate[];
};

export type MovimientoAPI = {
  move: {
    name: string;
    url: string;
  };
};

export type StatChangeAPI = {
  change: number;

  stat: {
    name: string;
    url: string;
  };
};

export type MovimientoDetalleAPI = {
  name: string;

  power: number | null;

  accuracy: number | null;

  pp: number;

  priority: number;

  damage_class: {
    name: "physical" | "special" | "status";
  };

  type: {
    name: string;
  };

  effect_chance: number | null;

  stat_changes: StatChangeAPI[];

  meta?: {
    ailment?: {
      name: string;
    };
  };
};

export type EstadoActivo = {
  tipo: EstadoCombate;

  turnosRestantes: number | null;

  intensidad?: number;
};
