const ResumoCards = ({itens}) => {
  return (
    <>
      <h2 className="titulo-secao">Seu resumo</h2>
      
      <div className="cards">
        {itens.map((item) => (
          <div className="card" key={item.label}>
            <span>{item.label}</span>
            <p>{item.valor}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default ResumoCards;
