import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const CameraOverlay = ({ aberto, onCancelar }) => {
  const navigate = useNavigate();
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [salvarApp, setSalvarApp] = useState(true);
  const [salvando, setSalvando] = useState(false);

  if (!aberto) {
    return null;
  }

  const salvar = () => {
    const nome = nomeArquivo.trim() || "AulaX_DataX";

    console.log("Nome do arquivo:", nome);
    console.log("Salvar no App:", salvarApp);

    setSalvando(true);

    setTimeout(() => {
      onCancelar();
      navigate("/");
    }, 2000);
  };

  return (
    <div className="overlay">
      <div className="overlay-card">
        <div className="overlay-banner">
          <div className="overlay-logo">
            <img src={logo} alt="JOVI Logo" className="overlay-logo-img" />
          </div>

          <div>
            <h2>JoviClass</h2>
            <p>Salvar anotações em PDF</p>
          </div>
        </div>

        <div className="overlay-body">
          <p className="overlay-label">Nome do arquivo</p>

          <input
            className="overlay-input"
            type="text"
            placeholder="AulaX_DataX"
            value={nomeArquivo}
            onChange={(e) => setNomeArquivo(e.target.value)}
          />

          <p className="overlay-hint">O arquivo será salvo em PDF na sua galeria.</p>

          <label className="overlay-check">
            <input
              type="checkbox"
              checked={salvarApp}
              onChange={(e) => setSalvarApp(e.target.checked)}
            />
            Salvar na galeria e no App JoviClass
          </label>

          <div className="overlay-actions">
            <button className="btn-cancelar" onClick={onCancelar}>
              Cancelar
            </button>

            <button className="btn-salvar" onClick={salvar} disabled={salvando}>
              {salvando ? "✔ Salvo!" : "Salvar PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraOverlay;

