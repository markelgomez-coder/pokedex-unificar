function NoHayResultado({ busqueda }) {
  return (
    <div className="no-hay-resultado">
      <div className="icono-no-hay-resultado">
        <div className="icono-no-hay-resultado-interior"></div>
        <div className="icono-no-hay-resultado-vector1"></div>
        <div className="icono-no-hay-resultado-vector2"></div>
        <div className="icono-no-hay-resultado-vector3"></div>
        <div className="icono-no-hay-resultado-vector4"></div>
        <div className="icono-no-hay-resultado-vector5"></div>
      </div>

      <p>There are no results for "{busqueda}"</p>
    </div>
  );
}

export default NoHayResultado;
