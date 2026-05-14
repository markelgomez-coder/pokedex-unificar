import { hacerFetch } from "./fetch.js";
export async function obtenerPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const data = await hacerFetch(url);
    const pokemon = {
        nombre: data.name,
        numero: data.id,
        imagen: data.sprites.other["official-artwork"].front_default,
        tipos: data.types.map((t) => t.type.name),
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
export async function obtenerPokemonDescripcion(id) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const data = await hacerFetch(url);
    const entradaEspanol = data.flavor_text_entries.find((entry) => entry.language.name === "en");
    return entradaEspanol.flavor_text.replace(/[\n\f]/g, " ");
}
export async function obtenerPokemonTipos(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const data = await hacerFetch(url);
    const pokemon_tipos = {
        tipos: data.types.map((t) => t.type.name),
        tipos_url: data.types.map((t) => t.type.url),
    };
    return pokemon_tipos;
}
export async function obtenerEficaciaPokemon(url) {
    const data = await hacerFetch(url);
    return {
        doble_dano: data.damage_relations.double_damage_from,
        mitad_dano: data.damage_relations.half_damage_from,
        no_dano: data.damage_relations.no_damage_from,
    };
}
export async function obtenerDebilidadPokemon(id) {
    const tiposData = await obtenerPokemonTipos(id);
    let dobleDanoTotales = [];
    for (const url of tiposData.tipos_url) {
        const debilidades = await obtenerEficaciaPokemon(url);
        dobleDanoTotales = dobleDanoTotales.concat(debilidades.doble_dano);
    }
    const unificado = Array.from(new Map(dobleDanoTotales.map((d) => [d.name, d])).values());
    return unificado;
}
export async function obtenerResistenciaPokemon(id) {
    const tiposData = await obtenerPokemonTipos(id);
    let mitadDanoTotales = [];
    for (const url of tiposData.tipos_url) {
        const debilidades = await obtenerEficaciaPokemon(url);
        mitadDanoTotales = mitadDanoTotales.concat(debilidades.mitad_dano);
    }
    const unificado = Array.from(new Map(mitadDanoTotales.map((d) => [d.name, d])).values());
    return unificado;
}
export async function obtenerInmunidadPokemon(id) {
    const tiposData = await obtenerPokemonTipos(id);
    let noDanoTotales = [];
    for (const url of tiposData.tipos_url) {
        const debilidades = await obtenerEficaciaPokemon(url);
        noDanoTotales = noDanoTotales.concat(debilidades.no_dano);
    }
    const unificado = Array.from(new Map(noDanoTotales.map((d) => [d.name, d])).values());
    return unificado;
}
export async function obtenerPokemonEvolucionesLink(id) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const data = await hacerFetch(url);
    return data.evolution_chain.url;
}
export async function obtenerPokemonEvoluciones(url) {
    const data = await hacerFetch(url);
    const evoluciones = await extraerEvoluciones(data.chain);
    return evoluciones;
}
export async function extraerEvoluciones(chain) {
    const resultado = [];
    async function recorrer(nodo) {
        const pokemon = await obtenerPokemon(nodo.species.name);
        resultado.push(pokemon);
        for (const evo of nodo.evolves_to) {
            await recorrer(evo);
        }
    }
    await recorrer(chain);
    return resultado;
}
