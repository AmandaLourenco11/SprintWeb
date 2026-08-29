import React, { useState, useMemo } from "react";
import {ChevronLeft, ChevronRight, Plus, X, BookOpen, CalendarDays, Trash2, CheckCircle2, Home, Camera, ClipboardList, User,} from "lucide-react";
import "../css/Calendario.css";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const CATEGORIAS = ["Projeto", "Tutoria", "Prova", "Outros"];
const PRIORIDADES = {
  alta: { rotulo: "Alta" },
  media: { rotulo: "Média" },
  baixa: { rotulo: "Baixa" },
};

function mesmoDia(data, ano, mes, dia) {
  return (
    data.getFullYear() === ano && data.getMonth() === mes && data.getDate() === dia
  );
}

function formatarData(dataStr) {
  if (!dataStr) return "";
  const [ano, mes, dia] = dataStr.split("-");
  return `${dia}/${mes}/${ano}`;
}

function JanelaModal({ aberta, aoFechar, titulo, children }) {
  if (!aberta) return null;
  return (
    <div className="sobreposicao-modal" onClick={aoFechar}>
      <div className="caixa-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={aoFechar} className="botao-fechar-modal">
          <X size={14} />
        </button>
        <h2 className="titulo-modal">{titulo}</h2>
        {children}
      </div>
    </div>
  );
}

function CampoFormulario({ rotulo, children }) {
  return (
    <label className="campo-formulario">
      <span className="rotulo-campo">{rotulo}</span>
      {children}
    </label>
  );
}


export default function CalendarioJoviClass() {
  const hoje = useMemo(() => new Date(), []);
  const [dataAtual, setDataAtual] = useState(new Date());

  const [eventos, setEventos] = useState([]); 
  const [entregas, setEntregas] = useState([]); 
  const [tarefas, setTarefas] = useState([]); 

  const [diaSelecionado, setDiaSelecionado] = useState(null); 
  const [modalEventoAberto, setModalEventoAberto] = useState(false);
  const [modalEntregaAberto, setModalEntregaAberto] = useState(false);
  const [modalTarefaAberto, setModalTarefaAberto] = useState(false);

  const [formEvento, setFormEvento] = useState({ titulo: "", categoria: "Projeto", descricao: "" });
  const [formEntrega, setFormEntrega] = useState({ titulo: "", materia: "", data: "", prioridade: "media" });
  const [formTarefa, setFormTarefa] = useState({ texto: "", materia: "" });

  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();

  const grade = useMemo(() => {
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
    const celulas = [];

    for (let i = primeiroDiaSemana; i > 0; i--) {
      celulas.push({ tipo: "esmaecido", numero: ultimoDiaMesAnterior - i + 1 });
    }
    for (let i = 1; i <= ultimoDiaMes; i++) {
      celulas.push({ tipo: "atual", numero: i });
    }
    const restante = (7 - (celulas.length % 7)) % 7;
    for (let i = 1; i <= restante; i++) {
      celulas.push({ tipo: "esmaecido", numero: i });
    }
    return celulas;
  }, [ano, mes]);

  function eventosDoDia(dia) {
    return eventos.filter((ev) => mesmoDia(ev.data, ano, mes, dia));
  }
  function entregasDoDia(dia) {
    return entregas.filter((en) => {
      if (!en.data) return false;
      const d = new Date(en.data + "T00:00:00");
      return mesmoDia(d, ano, mes, dia);
    });
  }

  function mudarMes(delta) {
    setDataAtual(new Date(ano, mes + delta, 1));
  }

  function abrirDia(dia) {
    setDiaSelecionado({ ano, mes, dia });
    setFormEvento({ titulo: "", categoria: "Projeto", descricao: "" });
    setModalEventoAberto(true);
  }

  function salvarEvento() {
    if (!formEvento.titulo.trim() || !diaSelecionado) return;
    const { ano: a, mes: m, dia: d } = diaSelecionado;
    setEventos((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        titulo: formEvento.titulo.trim(),
        categoria: formEvento.categoria,
        descricao: formEvento.descricao.trim(),
        data: new Date(a, m, d),
      },
    ]);
    setModalEventoAberto(false);
  }

  function salvarEntrega() {
    if (!formEntrega.titulo.trim()) return;
    const id = Date.now();
    const nova = { id, ...formEntrega, titulo: formEntrega.titulo.trim(), materia: formEntrega.materia.trim() };
    setEntregas((prev) =>
      [...prev, nova].sort((a, b) => {
        if (!a.data) return 1;
        if (!b.data) return -1;
        return new Date(a.data) - new Date(b.data);
      })
    );
    setTarefas((prev) => [
      ...prev,
      { id, texto: nova.titulo, materia: nova.materia, concluida: false, vemDeEntrega: true },
    ]);
    setFormEntrega({ titulo: "", materia: "", data: "", prioridade: "media" });
    setModalEntregaAberto(false);
  }

  function removerEntrega(id) {
    setEntregas((prev) => prev.filter((e) => e.id !== id));
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  }

  function salvarTarefa() {
    if (!formTarefa.texto.trim()) return;
    setTarefas((prev) => [
      ...prev,
      { id: Date.now(), texto: formTarefa.texto.trim(), materia: formTarefa.materia.trim(), concluida: false },
    ]);
    setFormTarefa({ texto: "", materia: "" });
    setModalTarefaAberto(false);
  }

  function alternarTarefa(id) {
    setTarefas((prev) => prev.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t)));
  }
  function removerTarefa(id) {
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  }

  const totalTarefas = tarefas.length;
  const tarefasConcluidas = tarefas.filter((t) => t.concluida).length;
  const progresso = totalTarefas === 0 ? 0 : Math.round((tarefasConcluidas / totalTarefas) * 100);
  const tarefasOrdenadas = [...tarefas].sort((a, b) => a.concluida - b.concluida);

  return (
    <div className="calendario-container">
      {}
      <div className="barra-navegacao">
        <div className="faixa-cabecalho-calendario">
          <h1 className="titulo-pagina">Calendário</h1>
          <p className="subtitulo-pagina">Organize seus eventos, provas e entregas</p>
        </div>
      </div>

      <div className="conteudo-principal">
        <div className="cartao">
          <div className="cabecalho-mes">
            <button onClick={() => mudarMes(-1)} className="botao-mudar-mes">
              <ChevronLeft size={26} className="icone-azul-escuro" />
            </button>
            <div className="titulo-mes">
              {MESES[mes]} {ano}
            </div>
            <button onClick={() => mudarMes(1)} className="botao-mudar-mes">
              <ChevronRight size={26} className="icone-azul-escuro" />
            </button>
          </div>

          <div className="grade-dias-semana">
            {DIAS_SEMANA.map((d) => (
              <span key={d} className="rotulo-dia-semana">
                {d}
              </span>
            ))}
          </div>

          <div className="grade-dias-mes">
            {grade.map((celula, idx) => {
              if (celula.tipo === "esmaecido") {
                return (
                  <div key={idx} className="dia-esmaecido">
                    {celula.numero}
                  </div>
                );
              }
              const dia = celula.numero;
              const ehHoje = mesmoDia(hoje, ano, mes, dia);
              const totalDoDia = eventosDoDia(dia).length + entregasDoDia(dia).length;
              return (
                <div
                  key={idx}
                  onClick={() => abrirDia(dia)}
                  className={ehHoje ? "celula-dia-hoje" : "celula-dia"}
                >
                  <span className="numero-dia">{dia}</span>
                  {totalDoDia > 0 && <span className={ehHoje ? "ponto-dia-hoje" : "ponto-dia"} />}
                </div>
              );
            })}
          </div>
        </div>

    
        <div className="cartao">
          <div className="cabecalho-secao">
            <h2 className="titulo-secao">
              <CalendarDays size={18} className="icone-azul-escuro" />
              Próximas Entregas
            </h2>
            <button onClick={() => setModalEntregaAberto(true)} className="botao-primario">
              <Plus size={14} /> Nova entrega
            </button>
          </div>

          {entregas.length === 0 ? (
            <p className="texto-vazio">Nenhuma entrega cadastrada. Clique em "Nova entrega" para adicionar.</p>
          ) : (
            <div className="lista-entregas">
              {entregas.map((en) => {
                const p = PRIORIDADES[en.prioridade];
                return (
                  <div key={en.id} className={`item-entrega ${en.prioridade}`}>
                    <div className="info-entrega">
                      <span className="titulo-entrega">{en.titulo}</span>
                      <span className="meta-entrega">
                        {en.materia && <span>📚 {en.materia}</span>}
                        {en.data && <span>📅 {formatarData(en.data)}</span>}
                      </span>
                    </div>
                    <span className={`selo-prioridade ${en.prioridade}`}>{p.rotulo}</span>
                    <button onClick={() => removerEntrega(en.id)} className="botao-excluir">
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="cartao cartao-checklist">
          <div className="cabecalho-secao">
            <h2 className="titulo-secao">
              <CheckCircle2 size={18} className="icone-azul-escuro" />
              Checklist de Entregas
            </h2>
            <button onClick={() => setModalTarefaAberto(true)} className="botao-primario">
              <Plus size={14} /> Nova tarefa
            </button>
          </div>

          <div className="bloco-progresso">
            <div className="rotulo-progresso">
              {tarefasConcluidas} de {totalTarefas} concluídas
            </div>
            <div className="trilha-progresso">
              <div style={{ width: `${progresso}%` }} className="preenchimento-progresso" />
            </div>
          </div>

          {tarefas.length === 0 ? (
            <p className="texto-vazio">Nenhuma tarefa adicionada. Clique em "+ Nova tarefa" para começar.</p>
          ) : (
            <ul className="lista-tarefas">
              {tarefasOrdenadas.map((t) => (
                <li key={t.id} className={t.concluida ? "item-tarefa-concluida" : "item-tarefa"}>
                  <input
                    type="checkbox"
                    checked={t.concluida}
                    onChange={() => alternarTarefa(t.id)}
                    className="caixa-selecao"
                  />
                  <div className="info-tarefa">
                    <span className={t.concluida ? "texto-tarefa-concluida" : "texto-tarefa"}>{t.texto}</span>
                    {t.materia && <span className="materia-tarefa">{t.materia}</span>}
                  </div>
                  <button onClick={() => removerTarefa(t.id)} className="botao-excluir">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <JanelaModal aberta={modalEventoAberto} aoFechar={() => setModalEventoAberto(false)} titulo="Novo Evento">
        {diaSelecionado &&
          (() => {
            const doDia = [
              ...eventosDoDia(diaSelecionado.dia).map((e) => ({ ...e, origem: "evento" })),
              ...entregasDoDia(diaSelecionado.dia).map((e) => ({ ...e, origem: "entrega" })),
            ];
            if (doDia.length === 0) return null;
            return (
              <div className="lista-eventos-dia">
                <span className="rotulo-eventos-dia">Eventos do dia</span>
                {doDia.map((ev, i) => (
                  <div key={i} className="caixa-evento-dia">
                    <div className="titulo-evento-dia">
                      <span className="ponto-evento-dia" />
                      <strong>{ev.titulo}</strong>
                    </div>
                    <span className="meta-evento-dia">
                      {ev.origem === "entrega" ? `Entrega · ${formatarData(ev.data)}` : ev.categoria}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}

        <CampoFormulario rotulo="Título:">
          <input
            className="campo-entrada"
            placeholder="Ex. Trabalho de matemática"
            value={formEvento.titulo}
            onChange={(e) => setFormEvento((f) => ({ ...f, titulo: e.target.value }))}
          />
        </CampoFormulario>
        <CampoFormulario rotulo="Categoria:">
          <select
            className="campo-entrada"
            value={formEvento.categoria}
            onChange={(e) => setFormEvento((f) => ({ ...f, categoria: e.target.value }))}
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </CampoFormulario>
        <CampoFormulario rotulo="Descrição:">
          <textarea
            className="campo-entrada campo-textarea"
            placeholder="Descreva o evento..."
            value={formEvento.descricao}
            onChange={(e) => setFormEvento((f) => ({ ...f, descricao: e.target.value }))}
          />
        </CampoFormulario>
        <button onClick={salvarEvento} className="botao-primario botao-primario-modal">
          Salvar Evento
        </button>
      </JanelaModal>

      <JanelaModal aberta={modalEntregaAberto} aoFechar={() => setModalEntregaAberto(false)} titulo="Nova Entrega">
        <CampoFormulario rotulo="Título:">
          <input
            className="campo-entrada"
            placeholder="Ex. Relatório de Biologia"
            value={formEntrega.titulo}
            onChange={(e) => setFormEntrega((f) => ({ ...f, titulo: e.target.value }))}
          />
        </CampoFormulario>
        <CampoFormulario rotulo="Matéria:">
          <input
            className="campo-entrada"
            placeholder="Ex. Biologia"
            value={formEntrega.materia}
            onChange={(e) => setFormEntrega((f) => ({ ...f, materia: e.target.value }))}
          />
        </CampoFormulario>
        <CampoFormulario rotulo="Data de entrega:">
          <input
            type="date"
            className="campo-entrada"
            value={formEntrega.data}
            onChange={(e) => setFormEntrega((f) => ({ ...f, data: e.target.value }))}
          />
        </CampoFormulario>
        <CampoFormulario rotulo="Prioridade:">
          <select
            className="campo-entrada"
            value={formEntrega.prioridade}
            onChange={(e) => setFormEntrega((f) => ({ ...f, prioridade: e.target.value }))}
          >
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </CampoFormulario>
        <button onClick={salvarEntrega} className="botao-primario botao-primario-modal">
          Salvar Entrega
        </button>
      </JanelaModal>

      <JanelaModal aberta={modalTarefaAberto} aoFechar={() => setModalTarefaAberto(false)} titulo="Nova Tarefa">
        <CampoFormulario rotulo="Tarefa:">
          <input
            className="campo-entrada"
            placeholder="Ex. Estudar capítulo 3"
            value={formTarefa.texto}
            onChange={(e) => setFormTarefa((f) => ({ ...f, texto: e.target.value }))}
          />
        </CampoFormulario>
        <CampoFormulario rotulo="Matéria:">
          <input
            className="campo-entrada"
            placeholder="Ex. Matemática"
            value={formTarefa.materia}
            onChange={(e) => setFormTarefa((f) => ({ ...f, materia: e.target.value }))}
          />
        </CampoFormulario>
        <button onClick={salvarTarefa} className="botao-primario botao-primario-modal">
          Adicionar Tarefa
        </button>
      </JanelaModal>
    </div>
  );
}