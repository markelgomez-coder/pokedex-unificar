export type Pokemon = {
    nombre: string,
    numero: number,
    imagen: string,
    tipos: Array<string>,
    peso: number,
    altura: number,
    hp: number,
    atk: number,
    def: number,
    sat: number,
    sdf: number,
    spd: number,
    dream_team:boolean,
}

export type Type = {
    name: string,  
    url: string,   
}

export type TipoPokemon = {
    slot: number,  
    type: Type,    
}

export type DanoPokemon = {
    name: string,
    url: string,
}

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