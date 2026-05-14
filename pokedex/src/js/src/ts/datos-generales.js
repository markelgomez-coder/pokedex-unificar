//================================ LISTA POKEMON =================================
export let listaPokemon = [];
export const tiposPokemon = [
    "grass",
    "bug",
    "electric",
    "fire",
    "water",
    "normal",
    "poison",
    "ground",
    "flying",
    "fairy",
    "fighting",
    "psychic",
    "rock",
    "ghost",
    "ice",
    "dragon",
    "dark",
    "steel",
];
export const generaciones = [
    { id: 1, nombre: "Generación 1", cantidadPokemon: 151 },
    { id: 2, nombre: "Generación 2", cantidadPokemon: 100 },
    { id: 3, nombre: "Generación 3", cantidadPokemon: 135 },
    { id: 4, nombre: "Generación 4", cantidadPokemon: 107 },
    { id: 5, nombre: "Generación 5", cantidadPokemon: 156 },
    { id: 6, nombre: "Generación 6", cantidadPokemon: 72 },
    { id: 7, nombre: "Generación 7", cantidadPokemon: 81 },
    { id: 8, nombre: "Generación 8", cantidadPokemon: 89 },
    { id: 9, nombre: "Generación 9", cantidadPokemon: 103 },
];
export function VaciarListaPokemon() {
    listaPokemon = [];
}
export function quitarRepetidosListaPokemon() {
    const nombresVistos = new Set();
    listaPokemon = listaPokemon.filter((pokemon) => {
        if (nombresVistos.has(pokemon.nombre)) {
            return false;
        }
        nombresVistos.add(pokemon.nombre);
        return true;
    });
}
//================================ DREAM TEAM =================================
export const DREAM_TEAM_STORAGE_KEY = "dreamTeam";
export let dreamTeam = [];
export let maxDreamTeam = 6;
export function VaciarDreamTeam() {
    dreamTeam = [];
}
export function quitarRepetidosDreamTeam() {
    const nombresVistos = new Set();
    dreamTeam = dreamTeam.filter((pokemon) => {
        if (nombresVistos.has(pokemon.nombre)) {
            return false;
        }
        nombresVistos.add(pokemon.nombre);
        return true;
    });
}
