const ProgressoCard = ({valor, tarefasConcluidas, materiasEstudadas, anotacoesFeitas}) => {
    const totalBarrinhas = 13;
    const barrinhasAtivas = Math.round((valor / 100) * totalBarrinhas);

    return (
    <>
      <section className="progresso-card">
        <div className="progresso-anel" style={{ "--valor": valor }}>
            <svg viewBox="0 0 120 120">
            <circle className="anel-fundo" cx="60" cy="60" r="52"></circle>
            <circle className="anel-valor" cx="60" cy="60" r="52"></circle>
            </svg>
            <div className="anel-texto">{valor}%</div>
        </div>

        <div className="progresso-info">
            <span className="progresso-label">✦ Seu progresso hoje</span>

            <div className="progresso-barrinhas" aria-hidden="true">
            {Array.from({ length: totalBarrinhas }).map((_, i) => {
                const ativa = i < barrinhasAtivas;
                const ultimaAtiva = i === barrinhasAtivas - 1;
                return (
                <span
                    key={i}
                    className={[ativa && "ativa", ultimaAtiva && "meio"]
                    .filter(Boolean)
                    .join(" ")}
                />
                );
            })}
            </div>

            <div className="progresso-stats">
            <div className="stat">
                <strong>{tarefasConcluidas}</strong>
                <span>tarefas concluídas</span>
            </div>
            <div className="stat">
                <strong>{materiasEstudadas}</strong>
                <span>matérias estudadas</span>
            </div>
            <div className="stat">
                <strong>{anotacoesFeitas}</strong>
                <span>anotações feitas</span>
            </div>
            </div>
        </div>
        </section>
    </>
  )
}

export default ProgressoCard
