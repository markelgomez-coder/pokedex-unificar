function IconoFavoritos(dreamTeam) {
  return (
    <>
        <div className="icono-dream-team">
          <div className="icono-dream-team-interior">
            <div className="icono-dream-team-vector1"></div>

            <div
              className={`icono-dream-team-vector2 ${
                dreamTeam ? "activo" : ""
              }`}
            ></div>
          </div>
        </div>
    </>
  );
}

export default IconoFavoritos;
