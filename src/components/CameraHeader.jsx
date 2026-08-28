import { FaPersonRunning, FaCameraRotate, FaCircleDot, FaCircle } from "react-icons/fa6";
import logo from "../assets/logo.png";

const CameraHeader = ({ onLogoClick }) => {
  return (
    <div className="top-status-bar">
      <button className="logo-btn" onClick={onLogoClick}>
        <img src={logo} alt="JOVI Logo" className="logo-img" />
      </button>

      <div className="top-icons">
        <FaPersonRunning className="icon-off" />
        <FaCircleDot className="icon-off" />

        <span className="zeiss-label">ZEISS</span>
        
        <FaCameraRotate className="icon-off" />
        <FaCircle className="icon-off" />
      </div>
    </div>
  );
};

export default CameraHeader;