import { useEffect, useRef, useState } from "react";
const Tesseract = await import("tesseract.js");
import CameraHeader from "../components/CameraHeader";
import CameraDropdown from "../components/CameraDropdown";
import CameraZoom from "../components/CameraZoom";
import CameraControls from "../components/CameraControls";
import CameraOverlay from "../components/CameraOverlay";
import "../css/Camera.css";

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraErro, setCameraErro] = useState("");
  const [resultado, setResultado] = useState("");
  const [processando, setProcessando] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [materiaSelecionada, setMateriaSelecionada] = useState(false);
  const [overlayAberto, setOverlayAberto] = useState(false);

  useEffect(() => {
    let stream;

    const configurarCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (erro) {
        console.error(erro);
        setCameraErro(`Erro ao acessar a câmera: ${erro.message}`);
      }
    };

    configurarCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const escanearTexto = async () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    setProcessando(true);
    setCameraErro("");
    setResultado("Fazendo a leitura... aguarde");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.filter = "contrast(1.3) grayscale(1)";
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const { data } = await Tesseract.recognize(canvas, "por");
      const textoFinal = data.text.trim();

      if (textoFinal.length > 0) {
        setResultado(textoFinal);
      } else {
        setResultado("Não foi possível identificar o texto");
      }
    } catch (erro) {
      console.error(erro);
      setResultado(`Erro ao processar: ${erro.message}`);
    } finally {
      setProcessando(false);
    }
  };

  const abrirDropdown = () => {
    setDropdownAberto((estadoAtual) => !estadoAtual);
  };

  const selecionarMateria = () => {
    setMateriaSelecionada(true);
    setDropdownAberto(false);
  };

  const abrirOverlay = () => {
    setOverlayAberto(true);
  };

  const fecharOverlay = () => {
    setOverlayAberto(false);
  };

  return (
    <div className="camera-page">
      <div className="phone-wrapper">
        <CameraHeader onLogoClick={abrirDropdown} />

        <div className="camera-viewport">
          <CameraDropdown aberto={dropdownAberto} onSelecionarMateria={selecionarMateria} />

          <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
          <canvas ref={canvasRef} className="camera-canvas" />

          <CameraZoom />

          {(resultado || cameraErro) && (
            <div className="camera-resultado">
              {cameraErro || resultado}
            </div>
          )}

          {materiaSelecionada && (
            <button className="confirm-btn" onClick={abrirOverlay}>
              ✔
            </button>
          )}
        </div>

        <CameraControls onScan={escanearTexto} processando={processando} />
        <CameraOverlay aberto={overlayAberto} onCancelar={fecharOverlay} />
      </div>
    </div>
  );
};

export default Camera;