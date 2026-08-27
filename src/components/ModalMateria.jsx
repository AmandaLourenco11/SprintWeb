const ModalMateria = ({ aberto, editandoId, nomeInput, corSelecionada, inputRef, cores, mudarNome, mudarCor, cancelar, salvar }) => {
  return (
    <>
      <div className={`overlay${aberto ? "aberto" : ""}`} onClick={(e) => {
        if (e.target === e.currentTarget){
            cancelar();
        }
      }}>

        <div className="modal">

        <div className="topoModal">
          <p>
            {editandoId !== null
              ? "Renomear Matéria"
              : "Nova Matéria"}
          </p>

          <button onClick={cancelar}>✕</button>
        </div>

        <div className="campo">
          <label htmlFor="nomeMateria">Nome da matéria</label>

          <input
            ref={inputRef}
            type="text"
            id="nomeMateria"
            placeholder="Ex: Matemática"
            value={nomeInput}
            onChange={(e) =>
              onNomeChange(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSalvar();
              }
            }}
          />
        </div>

        <div className="campo">
          <label>Cor da matéria</label>

          <div className="seletorCores">
            {cores.map(({ cor, nome }) => (
              <button
                key={cor}
                className={`btnCor${
                  corSelecionada === cor
                    ? " selecionada"
                    : ""
                }`}
                style={{ background: cor }}
                title={nome}
                onClick={() => onCorChange(cor)}
              />
            ))}
          </div>
        </div>

        <div className="acoesModal">
          <button onClick={cancelar}>Cancelar</button>

          <button onClick={salvar}>
            {editandoId !== null
              ? "Salvar"
              : "Criar Matéria"}
          </button>
        </div>

      </div>

      
    </div>
    </>
  )
}

export default ModalMateria

