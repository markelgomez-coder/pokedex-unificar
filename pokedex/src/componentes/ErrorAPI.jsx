import IconoErrorAPI from "../iconos/IconoErrorAPI";

function ErrorAPI() {
  return (
    <>
      <div class="error-api-pokemon">
        <IconoErrorAPI />
        <p> An error ocurred getting Pokemons.</p>
        <p>
          <br>Please try later</br>
        </p>
      </div>
    </>
  );
}

export default ErrorAPI;
