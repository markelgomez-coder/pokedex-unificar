function NoHayResultado(busqueda) {
  return (
    <>
      <div class="no-hay-resultado">
        <div class="icono-no-hay-resultado">
          <div class="icono-no-hay-resultado-interior"></div>
          <div class="icono-no-hay-resultado-vector1"></div>
          <div class="icono-no-hay-resultado-vector2"></div>
          <div class="icono-no-hay-resultado-vector3"></div>
          <div class="icono-no-hay-resultado-vector4"></div>
          <div class="icono-no-hay-resultado-vector5"></div>
        </div>
        <p> There is no results for "${busqueda}" </p>
      </div>
    </>
  );
}

export default NoHayResultado;
