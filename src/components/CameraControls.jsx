import { FaImage, FaRotate } from "react-icons/fa6";

const CameraControls = ({ onScan, processando }) => {
  return (
    <div className="bottom-bar">
      <div className="modes-row">
        <span className="mode">Noite</span>
        <span className="mode">Retrato</span>
        <span className="mode active">Foto</span>
        <span className="mode">Vídeo</span>
        <span className="mode">Microfilme</span>
      </div>

      <div className="controls-row">
        <button className="ctrl-btn gallery-btn">
          <FaImage />
        </button>

        <button className="shutter-btn" onClick={onScan} disabled={processando}>
          <span className="shutter-inner"></span>
        </button>

        <button className="ctrl-btn rotate-btn">
          <FaRotate />
        </button>
      </div>
    </div>
  );
};

export default CameraControls;
