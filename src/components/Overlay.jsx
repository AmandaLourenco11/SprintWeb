const Overlay = ({cancelar, confirmar}) => {
  return (
    <>
      <div className="overlay" id="overlay">
      <div className="overlay-box">
        <p>Deseja confirmar esta ação?</p>
        <div className="overlay-botoes">
          <button id="cancelBtn" className="btn-secundario" onClick={cancelar}>
            Cancelar
          </button>
          <button id="okBtn" className="btn-primario" onClick={confirmar}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default Overlay
