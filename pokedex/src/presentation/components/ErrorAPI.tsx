import IconoErrorAPI from "../iconos/IconoErrorAPI";

export default function ErrorAPI() {
  return (
    <>
      <div className="error-api-pokemon">
        <IconoErrorAPI />
        <p>An error ocurred getting Pokemons.</p>
        <p>
          <br />
          Please try later
        </p>
      </div>
    </>
  );
}
