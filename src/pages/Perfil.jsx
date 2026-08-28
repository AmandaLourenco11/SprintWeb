import { useState } from "react";
import { Link } from "react-router-dom";
import avatarPadrao from "../assets/avatar.png";
import CardPerfil from "../components/CardPerfil";
import HeaderPagina from "../components/HeaderPagina"
import "../css/Perfil.css";

const Perfil = () => {
  const [nome, setNome] = useState("Helena Martins");
  const [curso, setCurso] = useState("Economia · 4º período");
  const [email, setEmail] = useState("helena.martins@email.com");
  const [foto, setFoto] = useState(avatarPadrao);

  const [modalAberto, setModalAberto] = useState(false);

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const salvarPerfil = (event) => {
    event.preventDefault();
    setModalAberto(false);
  };

  return (
    <>
    
      <main className="conteudo">

        <div className="saudacao">
          <div>
            <h1>Perfil</h1>
            <p>
              Gerencie seus dados e preferências de estudo.
            </p>
          </div>
        </div>

        <CardPerfil
          nome={nome}
          curso={curso}
          email={email}
          foto={foto}
          mudarFoto={setFoto}
          editarPerfil={abrirModal}
        />

        <h2 className="titulo-secao">Suas estatísticas</h2>

        <div className="cards">

          <div className="card">
            <span>Matérias</span>
            <p>6</p>
          </div>

          <div className="card">
            <span>Tarefas feitas</span>
            <p>48</p>
          </div>
        </div>

        <button className="btn-sair" type="button" onClick={() => alert("Você saiu da conta.")}>
          Sair da conta
        </button>

      </main>

      {modalAberto && (
        <div
          className="overlay"
          onClick={fecharModal}
        >
          <div
            className="overlay-box overlay-box-form"
            onClick={(event) => event.stopPropagation()}
          >

            <h3 className="modal-titulo">
              Editar perfil
            </h3>

            <form onSubmit={salvarPerfil}>

              <div className="campo">
                <label htmlFor="campoNome">Nome completo</label>

                <input
                  type="text"
                  id="campoNome"
                  value={nome}
                  onChange={(event) =>
                    setNome(event.target.value)
                  }
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="campoCurso">
                  Curso e período
                </label>

                <input
                  type="text"
                  id="campoCurso"
                  value={curso}
                  onChange={(event) =>
                    setCurso(event.target.value)
                  }
                />
              </div>

              <div className="campo">
                <label htmlFor="campoEmail">
                  E-mail
                </label>

                <input
                  type="email"
                  id="campoEmail"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>

              <div className="overlay-botoes">

                <button
                  type="button"
                  className="btn-secundario"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primario"
                >
                  Salvar alterações
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      <nav className="nav-mobile">

        <Link to="/">
          <span className="nav-icone">🏠︎</span>
          <span>Início</span>
        </Link>

        <Link to="/materias">
          <span className="nav-icone">📖</span>
          <span>Matérias</span>
        </Link>

        <Link
          to="/camera"
          className="nav-camera"
        >
          <span className="nav-icone-camera">📷</span>
        </Link>

        <Link to="/calendario">
          <span className="nav-icone">📝</span>
          <span>Tarefas</span>
        </Link>

        <Link
          to="/perfil"
          className="ativo"
        >
          <span className="nav-icone">👤</span>
          <span>Perfil</span>
        </Link>

      </nav>
    </>
  );
};

export default Perfil;
