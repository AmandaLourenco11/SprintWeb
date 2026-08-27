const FormularioAnotacao = ({ tituloAnotacao, textoAnotacao, setTituloAnotacao, setTextoAnotacao, cancelar, salvar }) => {
  return (
    <>
      <div className="areaAnotacao">
        <div className="anotacaoHeader">
            <h2>Nova Anotação</h2>

            <button className="btnFecharAnotacao" onClick={cancelar}>✕</button>
        </div>

        <input type="text" className="inputAnotacao" placeholder="Título da anotação..." value={tituloAnotacao} onChange={(e) => setTituloAnotacao(e.target.value)} />
        <textarea className="textareaAnotacao" placeholder="Escreva suas anotações aqui..." value={textoAnotacao} onChange={(e) => setTextoAnotacao(e.target.value)}/>
        
        <div className="acoesAnotacao">
            <button className="btnSecundario" onClick={cancelar}>Cancelar</button>
            <button className="btnPrimario" onClick={salvar}>Salvar anotação</button>
        </div>
      </div>
    </>
  )
}

export default FormularioAnotacao
