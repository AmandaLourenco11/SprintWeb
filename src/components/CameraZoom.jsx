import { FaWandMagicSparkles } from "react-icons/fa6";

const CameraZoom = () => {
  return (
    <div className="zoom-bar">

      <span className="zoom-opt">0.6</span>
      <span className="zoom-opt active">1×</span>
      <span className="zoom-opt">2</span>
      <button className="zoom-extra">
        <FaWandMagicSparkles />
      </button>
      
    </div>
  );
};

export default CameraZoom;

