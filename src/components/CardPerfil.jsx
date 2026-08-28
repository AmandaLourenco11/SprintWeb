import { useRef } from "react";
import logoGoogle from "../assets/google-logo.png";
import logoNotion from "../assets/Notion-Logo.png";

const CardPerfil = ({nome, curso, email, foto, mudarFoto, editarPerfil}) => {
  const inputFotoRef = useRef(null);

  const trocarFoto = () => {
    inputFotoRef.current.click();
  };

  const handleFoto = (event) => {
    const arquivo = event.target.files[0];

    if (arquivo) {
      const imagem = URL.createObjectURL(arquivo);
      mudarFoto(imagem);
    }
  };

  return (
    <section className="perfil-hero">
      <div className="perfil-avatar-bloco">
        <div className="perfil-avatar">
          <img src={foto} alt={`Foto de perfil de ${nome}`}/>

          <button className="perfil-avatar-editar" type="button" onClick={trocarFoto} aria-label="Trocar foto">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 20h16M13.5 6.5l3 3L8.5 17.5H5.5v-3l8-8Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <input ref={inputFotoRef} type="file" accept="image/*" hidden onChange={handleFoto}/>

        </div>

        <div className="perfil-identidade">
          <h2>{nome}</h2>

          <span className="perfil-curso">{curso}</span>
          <span className="perfil-email">{email}</span>
        </div>
      </div>

      <div className="perfil-acoes">

        <button className="btn-editar-perfil" type="button" onClick={editarPerfil}>
          Editar perfil
        </button>

        <div className="conexoes-externas">

          <button className="btn-conexaoG" type="button" title="Conectar Google" aria-label="Conectar Google">
            <img src={logoGoogle} alt="Google"/>
          </button>
          <button className="btn-conexaoN" type="button" title="Conectar Notion" aria-label="Conectar Notion">
            <img src={logoNotion} alt="Notion"/>
          </button>

        </div>
      </div>
    </section>
  );
};

export default CardPerfil;
