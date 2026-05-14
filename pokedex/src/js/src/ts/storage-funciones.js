import * as datosGenerales from "./datos-generales.js";
export function cargarDreamTeamDesdeStorage() {
    const storageValue = localStorage.getItem(datosGenerales.DREAM_TEAM_STORAGE_KEY);
    if (!storageValue)
        return;
    try {
        const nombresGuardados = Array.from(new Set(JSON.parse(storageValue)));
        if (!Array.isArray(nombresGuardados))
            return;
        if (Array.isArray(datosGenerales.listaPokemon) &&
            datosGenerales.listaPokemon.length > 0) {
            restaurarDreamTeam(nombresGuardados);
        }
        else {
            const id = window.setInterval(() => {
                if (Array.isArray(datosGenerales.listaPokemon) &&
                    datosGenerales.listaPokemon.length > 0) {
                    restaurarDreamTeam(nombresGuardados);
                    window.clearInterval(id);
                }
            }, 100);
        }
    }
    catch (error) {
        console.warn("No se pudo cargar el Dream Team guardado:", error);
    }
}
export function restaurarDreamTeam(nombres) {
    datosGenerales.VaciarDreamTeam();
    datosGenerales.listaPokemon.forEach((pokemon) => {
        if (nombres.includes(pokemon.nombre) &&
            !datosGenerales.dreamTeam.includes(pokemon)) {
            datosGenerales.dreamTeam.push(pokemon);
            pokemon.dream_team = true;
        }
    });
}
export function guardarDreamTeamEnStorage() {
    const nombres = datosGenerales.dreamTeam.map((pokemon) => pokemon.nombre);
    const nombresUnicos = Array.from(new Set(nombres));
    localStorage.setItem(datosGenerales.DREAM_TEAM_STORAGE_KEY, JSON.stringify(nombresUnicos));
}
