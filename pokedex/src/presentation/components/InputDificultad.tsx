interface Props {
  setDificultad: (valor: string) => void;
}

export default function InputDificultad({ setDificultad }: Props) {
  return (
    <>
      <div className="input-dificultad">
        <p>Que dificultad quieres que tenga el combate ?</p>
        <div className="input-dificultad-opciones">
          <div
            className="input-dificultad-button"
            id="input-dificultad-facil"
            onClick={() => setDificultad("facil")}
          >
            Facil
          </div>
          <div
            className="input-dificultad-button"
            id="input-dificultad-medio"
            onClick={() => setDificultad("medio")}
          >
            Medio
          </div>
          <div
            className="input-dificultad-button"
            id="input-dificultad-dificil"
            onClick={() => setDificultad("dificil")}
          >
            Dificil
          </div>
          <div
            className="input-dificultad-button"
            id="input-dificultad-imposible"
            onClick={() => setDificultad("imposible")}
          >
            Imposible
          </div>
        </div>
      </div>
    </>
  );
}
