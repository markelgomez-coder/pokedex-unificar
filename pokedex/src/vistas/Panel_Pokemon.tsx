import { useEffect, useState } from "react";
import "../css/panel-pokemon.css";
import "../css/variables.css";
import "../css/static.css";

import type { Pokemon } from "../ts/tipos";
import * as funcionesAPI from "../ts/funciones-API.js";
import * as funcionesGenerales from "../ts/funciones-generales.js";
import * as datosGenerales from "../ts/datos-generales.js";
import CartaPokemon from "../componentes/CartaPokemon";

type DanoPokemon = { name: string };

function Panel_Pokemon() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [dobleDano, setDobleDano] = useState<DanoPokemon[]>([]);
  const [mitadDano, setMitadDano] = useState<DanoPokemon[]>([]);
  const [noDano, setNoDano] = useState<DanoPokemon[]>([]);
  const [evoluciones, setEvoluciones] = useState<Pokemon[]>([]);
  const [gogokoa, setGogokoa] = useState(false);

  useEffect(() => {
    const numeroPokemon = new URLSearchParams(window.location.search).get(
      "pokemon"
    );

    if (!numeroPokemon) return;

    const cargarDatos = async () => {
      const poke = await funcionesAPI.obtenerPokemon(numeroPokemon);

      await funcionesGenerales.setPokemonsDreamTeam();

      const esFavorito = funcionesGenerales.pokemonDentroDeLaLista(
        datosGenerales.dreamTeam,
        poke
      );

      setPokemon(poke);
      setGogokoa(esFavorito);

      const [
        desc,
        doble,
        mitad,
        none,
        evolucionesLink,
      ] = await Promise.all([
        funcionesAPI.obtenerPokemonDescripcion(numeroPokemon),
        funcionesAPI.obtenerDebilidadPokemon(numeroPokemon),
        funcionesAPI.obtenerResistenciaPokemon(numeroPokemon),
        funcionesAPI.obtenerInmunidadPokemon(numeroPokemon),
        funcionesAPI.obtenerPokemonEvolucionesLink(numeroPokemon),
      ]);

      const evolucionBase =
        await funcionesAPI.obtenerPokemonEvoluciones(evolucionesLink);

      const evolucionesCompletas = await Promise.all(
        evolucionBase.map((evo: Pokemon) =>
          funcionesAPI.obtenerPokemon(evo.nombre)
        )
      );

      setDescripcion(desc);
      setDobleDano(doble);
      setMitadDano(mitad);
      setNoDano(none);
      setEvoluciones(evolucionesCompletas);
    };

    cargarDatos();
  }, []);

  const renderDano = (lista: DanoPokemon[]) =>
    lista.map((d) => (
      <span key={d.name} className={`dano ${d.name}`}>
        {d.name.charAt(0).toUpperCase() + d.name.slice(1)}
      </span>
    ));

  return (
    <div id="panel-pokemon">
      <div id="panel-pokemon-izquierda">
        {pokemon && (
          <div>
            <CartaPokemon pokemon={pokemon} dreamTeam={pokemon.dream_team} />
            <h2>{pokemon.nombre}</h2>
            <img src={pokemon.imagen} alt={pokemon.nombre} />
            {gogokoa && <span>⭐ Favorito</span>}
          </div>
        )}
      </div>
      <div id="panel-pokemon-derecha">
        {pokemon && (
          <>
            <p className="descripcion-pokemon">{descripcion}</p>

            <p className="subtitulo-panel-pokemon">Evoluciones</p>
            <div className="panel-evoluciones">
              {evoluciones.map((evo) => (
                <a
                  key={evo.nombre}
                  className="evolucion-pokemon"
                  href={`panel-pokemon.html?pokemon=${evo.nombre}`}
                >
                  <img src={evo.imagen} />
                  <p className="evolucion-pokemon-nombre">
                    {evo.nombre.charAt(0).toUpperCase() + evo.nombre.slice(1)}
                  </p>
                </a>
              ))}
            </div>

            <p className="subtitulo-panel-pokemon">Debilidades</p>

            <div className="panel-debilidades">
              <div className="panel-doble-dano">
                <p className="debilidades-subtitulo">DEBILIDAD</p>
                <div className="tipos-dano">{renderDano(dobleDano)}</div>
              </div>

              <div className="panel-mitad-dano">
                <p className="debilidades-subtitulo">RESISTENCIA</p>
                <div className="tipos-dano">{renderDano(mitadDano)}</div>
              </div>

              <div className="panel-no-dano">
                <p className="debilidades-subtitulo">INMUNIDAD</p>
                <div className="tipos-dano">{renderDano(noDano)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Panel_Pokemon;