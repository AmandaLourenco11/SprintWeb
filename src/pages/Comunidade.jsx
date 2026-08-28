import { useState, useEffect, useMemo, useRef } from "react";

/* =====================
   ÍCONES (emoji, sem dependências externas)
===================== */
const Icones = {
  Bell: () => <span>🔔</span>,
  Plus: () => <span>➕</span>,
  X: () => <span>✖️</span>,
  MoreVertical: () => <span>⋮</span>,
  Link2: () => <span>🔗</span>,
  Mail: () => <span>✉️</span>,
  ArrowLeft: () => <span>←</span>,
  Send: () => <span>📤</span>,
  Upload: () => <span>⬆️</span>,
  Home: () => <span>🏠</span>,
  BookOpen: () => <span>📖</span>,
  Camera: () => <span>📷</span>,
  ClipboardList: () => <span>📋</span>,
  User: () => <span>👤</span>,
  MenuIcon: () => <span>☰</span>,
  Trash2: () => <span>🗑️</span>,
  Pencil: () => <span>✏️</span>,
  UserPlus: () => <span>➕👤</span>,
  Check: () => <span>✔️</span>,
};
const {
  Bell, Plus, X, MoreVertical, Link2, Mail, ArrowLeft, Send,
  Upload, Home, BookOpen, Camera, ClipboardList, User, MenuIcon,
  Trash2, Pencil, UserPlus,
} = Icones;

/* =====================
   DADOS ESTÁTICOS
===================== */
const CATEGORIAS = ["Estudo", "Projeto", "Discussão", "Tutoria", "Social"];

const SALAS_PADRAO = [
  { icone: "💬", nome: "Geral", desc: "Conversa livre entre os membros", tipo: "chat" },
  { icone: "📚", nome: "Estudos", desc: "Dúvidas e discussões sobre conteúdo", tipo: "chat" },
  { icone: "📁", nome: "Arquivos", desc: "Compartilhe materiais e documentos", tipo: "arquivos" },
  { icone: "📢", nome: "Avisos", desc: "Comunicados importantes da comunidade", tipo: "chat" },
];

const ICONE_TIPO = { prova: "📝", trabalho: "📁", reuniao: "🗓️" };
const TIPO_LABEL = { prova: "Prova", trabalho: "Trabalho", reuniao: "Reunião" };

const LIMIAR_7_DIAS = 7 * 24 * 60 * 60 * 1000;

// Datas geradas em relação ao momento em que o app carrega, para a demo
// sempre mostrar notificações relevantes.
const AGORA_BASE = Date.now();
const EVENTOS = [
  { id: "prova-calculo", titulo: "Prova de Cálculo I", tipo: "prova", materia: "Cálculo I", data: AGORA_BASE + 45 * 60 * 1000 },
  { id: "trabalho-eco", titulo: "Entrega do trabalho de Economia", tipo: "trabalho", materia: "Economia", data: AGORA_BASE + 20 * 60 * 60 * 1000 },
  { id: "prova-fisica", titulo: "Prova de Física II", tipo: "prova", materia: "Física II", data: AGORA_BASE + 2 * 24 * 60 * 60 * 1000 },
  { id: "reuniao-grupo", titulo: "Reunião do grupo de estudos", tipo: "reuniao", materia: "Cálculo I", data: AGORA_BASE + 6 * 24 * 60 * 60 * 1000 },
];

const NAV_LINKS = [
  { label: "Início", icon: Home },
  { label: "Matérias", icon: BookOpen },
  { label: "Câmera", icon: Camera },
  { label: "Tarefas", icon: ClipboardList },
  { label: "Perfil", icon: User },
];

const criarSalasIniciais = () => {
  const obj = {};
  SALAS_PADRAO.forEach((s) => {
    obj[s.nome] = { mensagens: [], arquivos: [], compartilhada: false };
  });
  return obj;
};

const criarId = () => "com_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);

/* =====================
   NOTIFICAÇÕES — helpers
===================== */
function calcularStatus(evento, agora) {
  const diffMs = evento.data - agora;
  if (diffMs <= 0) return null;

  const diffHoras = diffMs / (1000 * 60 * 60);
  const diffDias = diffHoras / 24;

  let urgencia = "normal";
  if (diffHoras <= 24) urgencia = "urgente";
  else if (diffDias <= 3) urgencia = "breve";

  let prazoTexto;
  if (diffHoras < 1) prazoTexto = "em menos de 1h";
  else if (diffHoras < 24) prazoTexto = `em ${Math.round(diffHoras)}h`;
  else prazoTexto = `em ${Math.ceil(diffDias)} dia${Math.ceil(diffDias) > 1 ? "s" : ""}`;

  return { diffMs, urgencia, prazoTexto };
}

function gerarNotificacoes(agora) {
  return EVENTOS.map((evento) => {
    const status = calcularStatus(evento, agora);
    if (!status || status.diffMs > LIMIAR_7_DIAS) return null;
    return { ...evento, ...status };
  })
    .filter(Boolean)
    .sort((a, b) => a.diffMs - b.diffMs);
}

const urgenciaCor = {
  urgente: "text-rose-600 bg-rose-50",
  breve: "text-amber-600 bg-amber-50",
  normal: "text-slate-500 bg-slate-100",
};

/* =====================
   COMPONENTE PRINCIPAL
===================== */
export default function ComunidadeApp() {
  const [comunidades, setComunidades] = useState([]);
  const [dadosSalas, setDadosSalas] = useState({});

  const [view, setView] = useState("lista"); // 'lista' | 'comunidade' | 'sala'
  const [comunidadeAtivaId, setComunidadeAtivaId] = useState(null);
  const [salaAtivaNome, setSalaAtivaNome] = useState(null);

  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [navAtivo, setNavAtivo] = useState("Início");

  // Formulário criar/editar
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nome: "", descricao: "", categoria: "Estudo", privacidade: "Pública", foto: null });

  // Menu de opções (três pontinhos) — 'card:<id>' ou 'pagina'
  const [menuAberto, setMenuAberto] = useState(null);

  // Modal convidar
  const [showConvidar, setShowConvidar] = useState(false);
  const [convidarComId, setConvidarComId] = useState(null);
  const [emailConvite, setEmailConvite] = useState("");
  const [statusCopiar, setStatusCopiar] = useState("");

  // Convite dentro da pasta de arquivos
  const [emailConvitePasta, setEmailConvitePasta] = useState("");
  const [statusCopiarPasta, setStatusCopiarPasta] = useState("");

  // Chat
  const [inputMensagem, setInputMensagem] = useState("");

  // Notificações
  const [agora, setAgora] = useState(Date.now());
  const [lidas, setLidas] = useState(new Set());
  const [notifPanelAberto, setNotifPanelAberto] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setAgora(Date.now()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const notificacoes = useMemo(() => gerarNotificacoes(agora), [agora]);
  const naoLidas = notificacoes.filter((n) => !lidas.has(n.id));

  const comunidadeAtiva = comunidades.find((c) => c.id === comunidadeAtivaId) || null;
  const salaAtiva = SALAS_PADRAO.find((s) => s.nome === salaAtivaNome) || null;
  const dadosSalaAtiva = comunidadeAtivaId && salaAtivaNome ? dadosSalas[comunidadeAtivaId]?.[salaAtivaNome] : null;
  const convidarCom = comunidades.find((c) => c.id === convidarComId) || null;

  /* ---------- Formulário ---------- */
  const abrirFormularioCriar = () => {
    setEditingId(null);
    setFormData({ nome: "", descricao: "", categoria: "Estudo", privacidade: "Pública", foto: null });
    setShowForm(true);
  };

  const abrirFormularioEdicao = (id) => {
    const com = comunidades.find((c) => c.id === id);
    if (!com) return;
    setEditingId(id);
    setFormData({ nome: com.nome, descricao: com.descricao, categoria: com.categoria, privacidade: com.privacidade, foto: com.foto });
    setShowForm(true);
    setMenuAberto(null);
  };

  const fecharFormulario = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormData((f) => ({ ...f, foto: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const salvarComunidade = () => {
    const nome = formData.nome.trim();
    const descricao = formData.descricao.trim();
    if (!nome || !descricao) {
      alert("Preencha todos os campos!");
      return;
    }

    if (editingId) {
      setComunidades((lista) => lista.map((c) => (c.id === editingId ? { ...c, nome, descricao, categoria: formData.categoria, privacidade: formData.privacidade, foto: formData.foto ?? c.foto } : c)));
    } else {
      const id = criarId();
      setComunidades((lista) => [...lista, { id, nome, descricao, categoria: formData.categoria, privacidade: formData.privacidade, foto: formData.foto, convidados: [] }]);
      setDadosSalas((d) => ({ ...d, [id]: criarSalasIniciais() }));
    }
    fecharFormulario();
  };

  /* ---------- Excluir ---------- */
  const excluirComunidade = (id) => {
    const com = comunidades.find((c) => c.id === id);
    if (!com) return;
    if (!confirm(`Tem certeza que deseja excluir a comunidade "${com.nome}"?`)) return;

    setComunidades((lista) => lista.filter((c) => c.id !== id));
    setDadosSalas((d) => {
      const novo = { ...d };
      delete novo[id];
      return novo;
    });
    if (comunidadeAtivaId === id) {
      setView("lista");
      setComunidadeAtivaId(null);
    }
    setMenuAberto(null);
  };

  /* ---------- Navegação ---------- */
  const abrirComunidade = (id) => {
    setComunidadeAtivaId(id);
    setView("comunidade");
  };

  const voltarComunidades = () => {
    setView("lista");
    setComunidadeAtivaId(null);
  };

  const abrirSala = (salaNome) => {
    setSalaAtivaNome(salaNome);
    setView("sala");
  };

  const voltarSalas = () => {
    setView("comunidade");
    setSalaAtivaNome(null);
  };

  /* ---------- Convite ---------- */
  const abrirModalConvidar = (id) => {
    setConvidarComId(id);
    setEmailConvite("");
    setStatusCopiar("");
    setShowConvidar(true);
    setMenuAberto(null);
  };

  const fecharModalConvidar = () => setShowConvidar(false);

  const linkConvite = (id) => `https://joviclass.app/convite/${id}`;

  const copiarLink = async (link, setStatus) => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* clipboard indisponível — ainda mostramos a confirmação visual */
    }
    setStatus("✅ Link copiado!");
    setTimeout(() => setStatus(""), 3000);
  };

  const enviarConvite = (id, email, limpar) => {
    const value = email.trim();
    if (!value || !value.includes("@")) {
      alert("Digite um e-mail válido.");
      return;
    }
    const com = comunidades.find((c) => c.id === id);
    if (com?.convidados.find((c) => c.email === value)) {
      alert("Este e-mail já recebeu um convite.");
      return;
    }
    setComunidades((lista) => lista.map((c) => (c.id === id ? { ...c, convidados: [...c.convidados, { email: value, status: "pendente" }] } : c)));
    limpar();
  };

  const removerConvite = (id, email) => {
    setComunidades((lista) => lista.map((c) => (c.id === id ? { ...c, convidados: c.convidados.filter((cv) => cv.email !== email) } : c)));
  };

  /* ---------- Arquivos / pasta compartilhada ---------- */
  const alternarCompartilharPasta = (checked) => {
    if (!comunidadeAtivaId) return;
    setDadosSalas((d) => ({
      ...d,
      [comunidadeAtivaId]: {
        ...d[comunidadeAtivaId],
        Arquivos: { ...d[comunidadeAtivaId].Arquivos, compartilhada: checked },
      },
    }));
    if (checked) {
      setEmailConvitePasta("");
      setStatusCopiarPasta("");
    }
  };

  const enviarArquivo = (file) => {
    if (!file || !comunidadeAtivaId) return;
    setDadosSalas((d) => ({
      ...d,
      [comunidadeAtivaId]: {
        ...d[comunidadeAtivaId],
        Arquivos: { ...d[comunidadeAtivaId].Arquivos, arquivos: [...d[comunidadeAtivaId].Arquivos.arquivos, file.name] },
      },
    }));
    alert("Arquivo enviado com sucesso!");
  };

  /* ---------- Chat ---------- */
  const enviarMensagem = () => {
    const texto = inputMensagem.trim();
    if (!texto || !comunidadeAtivaId || !salaAtivaNome) return;
    setDadosSalas((d) => ({
      ...d,
      [comunidadeAtivaId]: {
        ...d[comunidadeAtivaId],
        [salaAtivaNome]: { ...d[comunidadeAtivaId][salaAtivaNome], mensagens: [...d[comunidadeAtivaId][salaAtivaNome].mensagens, texto] },
      },
    }));
    setInputMensagem("");
  };

  /* ---------- Notificações ---------- */
  const marcarComoLida = (id) => setLidas((s) => new Set(s).add(id));
  const marcarTodasLidas = () => setLidas((s) => new Set([...s, ...notificacoes.map((n) => n.id)]));

  return (
    <div className="min-h-screen bg-[#F7F5F1] font-body text-slate-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Manrope:wght@200..800&display=swap');
        .font-display { font-family: 'Cinzel', serif; }
        .font-body { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-display text-sm">JC</div>
            <h2 className="font-display text-lg tracking-wide text-slate-900">JoviClass</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setNotifPanelAberto((v) => !v)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                aria-label="Notificações"
              >
                <Bell />
                {naoLidas.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                    {naoLidas.length > 9 ? "9+" : naoLidas.length}
                  </span>
                )}
              </button>

              {notifPanelAberto && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <strong className="text-sm">Notificações</strong>
                    <button onClick={marcarTodasLidas} className="text-xs font-medium text-indigo-600 hover:underline">
                      Marcar todas como lidas
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificacoes.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-slate-400">
                        Nenhuma prova, trabalho ou reunião chegando perto!
                      </div>
                    ) : (
                      notificacoes.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => marcarComoLida(n.id)}
                          className={`flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50 ${lidas.has(n.id) ? "opacity-60" : ""}`}
                        >
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base ${urgenciaCor[n.urgencia]}`}>
                            {ICONE_TIPO[n.tipo]}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-slate-800">{n.titulo}</span>
                            <span className="block text-xs text-slate-500">{TIPO_LABEL[n.tipo]} · {n.materia}</span>
                            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${urgenciaCor[n.urgencia]}`}>
                              Vence {n.prazoTexto}
                            </span>
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 md:hidden"
              onClick={() => setMenuMobileAberto((v) => !v)}
              aria-label="Menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        <nav className={`${menuMobileAberto ? "flex" : "hidden"} mx-auto max-w-5xl flex-col gap-1 px-4 pb-3 md:flex md:flex-row md:gap-6 md:px-4`}>
          {["Início", "Matérias", "Calendário", "Expansão do Conhecimento"].map((label) => (
            <button
              key={label}
              onClick={() => { setNavAtivo(label); setMenuMobileAberto(false); }}
              className={`rounded-lg px-2 py-1.5 text-left text-sm font-medium md:text-center ${navAtivo === label ? "text-indigo-600" : "text-slate-500 hover:text-slate-800"}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* ===== CONTEÚDO ===== */}
      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 md:pb-10">
        {view === "lista" && (
          <ListaComunidades
            comunidades={comunidades}
            onNovaComunidade={abrirFormularioCriar}
            onAbrirComunidade={abrirComunidade}
            menuAberto={menuAberto}
            setMenuAberto={setMenuAberto}
            onEditar={abrirFormularioEdicao}
            onExcluir={excluirComunidade}
            onConvidar={abrirModalConvidar}
          />
        )}

        {view === "comunidade" && comunidadeAtiva && (
          <PaginaComunidade
            comunidade={comunidadeAtiva}
            onVoltar={voltarComunidades}
            onAbrirSala={abrirSala}
            menuAberto={menuAberto}
            setMenuAberto={setMenuAberto}
            onEditar={abrirFormularioEdicao}
            onExcluir={excluirComunidade}
            onConvidar={abrirModalConvidar}
          />
        )}

        {view === "sala" && comunidadeAtiva && salaAtiva && (
          <SalaInterna
            sala={salaAtiva}
            dados={dadosSalaAtiva}
            comunidade={comunidadeAtiva}
            onVoltar={voltarSalas}
            inputMensagem={inputMensagem}
            setInputMensagem={setInputMensagem}
            onEnviarMensagem={enviarMensagem}
            onAlternarCompartilhar={alternarCompartilharPasta}
            onEnviarArquivo={enviarArquivo}
            linkConvite={linkConvite}
            emailConvitePasta={emailConvitePasta}
            setEmailConvitePasta={setEmailConvitePasta}
            statusCopiarPasta={statusCopiarPasta}
            setStatusCopiarPasta={setStatusCopiarPasta}
            copiarLink={copiarLink}
            enviarConvite={enviarConvite}
            removerConvite={removerConvite}
          />
        )}
      </main>

      {/* ===== NAV INFERIOR (mobile) ===== */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white py-2 md:hidden">
        {NAV_LINKS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setNavAtivo(label)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] ${navAtivo === label ? "text-indigo-600" : "text-slate-400"}`}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      {/* ===== FORMULÁRIO CRIAR/EDITAR ===== */}
      {showForm && (
        <Overlay onClick={fecharFormulario}>
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={fecharFormulario} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">
              <X />
            </button>
            <h2 className="mb-4 font-display text-xl text-slate-900">{editingId ? "Editar Comunidade" : "Nova Comunidade"}</h2>

            <div className="mb-4 flex flex-col items-center gap-2">
              <label className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-3xl text-slate-400 hover:bg-slate-200">
                {formData.foto ? (
                  <img src={formData.foto} alt="foto da comunidade" className="h-full w-full object-cover" />
                ) : (
                  <Camera />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
              </label>
              <span className="text-xs font-medium text-indigo-600">Adicionar foto da comunidade</span>
            </div>

            <label className="mb-1 block text-sm font-medium text-slate-700">Nome da Comunidade:</label>
            <input
              type="text"
              placeholder="Ex. Cálculo"
              value={formData.nome}
              onChange={(e) => setFormData((f) => ({ ...f, nome: e.target.value }))}
              className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />

            <label className="mb-1 block text-sm font-medium text-slate-700">Descrição:</label>
            <input
              type="text"
              placeholder="Descreva o objetivo da comunidade..."
              value={formData.descricao}
              onChange={(e) => setFormData((f) => ({ ...f, descricao: e.target.value }))}
              className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />

            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Categoria:</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData((f) => ({ ...f, categoria: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                >
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Privacidade:</label>
                <select
                  value={formData.privacidade}
                  onChange={(e) => setFormData((f) => ({ ...f, privacidade: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                >
                  <option value="Pública">Pública</option>
                  <option value="Privada">Privada</option>
                </select>
              </div>
            </div>

            <button
              onClick={salvarComunidade}
              className="mt-2 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {editingId ? "Salvar alterações" : "Criar comunidade"}
            </button>
          </div>
        </Overlay>
      )}

      {/* ===== MODAL CONVIDAR ===== */}
      {showConvidar && convidarCom && (
        <Overlay onClick={fecharModalConvidar}>
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={fecharModalConvidar} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">
              <X />
            </button>
            <h2 className="font-display text-lg text-slate-900">Convidar para a Comunidade</h2>
            <p className="mt-1 text-sm text-slate-500">Compartilhe o link abaixo para convidar outros estudantes.</p>

            <div className="mt-4 flex gap-2">
              <input readOnly value={linkConvite(convidarCom.id)} className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" />
              <button
                onClick={() => copiarLink(linkConvite(convidarCom.id), setStatusCopiar)}
                className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Link2 /> Copiar
              </button>
            </div>
            {statusCopiar && <div className="mt-1 text-xs font-medium text-emerald-600">{statusCopiar}</div>}

            <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
              <div className="h-px flex-1 bg-slate-200" /> ou convide por e-mail <div className="h-px flex-1 bg-slate-200" />
            </div>

            <label className="mb-1 block text-sm font-medium text-slate-700">E-mail do estudante:</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={emailConvite}
                onChange={(e) => setEmailConvite(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <button
                onClick={() => enviarConvite(convidarCom.id, emailConvite, () => setEmailConvite(""))}
                className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
              >
                <UserPlus /> Enviar
              </button>
            </div>

            {convidarCom.convidados.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-slate-500">Convites enviados:</p>
                <div className="space-y-2">
                  {convidarCom.convidados.map((c) => (
                    <div key={c.email} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                      <span className="flex items-center gap-2 text-sm text-slate-700"><Mail /> {c.email}</span>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">Pendente</span>
                        <button onClick={() => removerConvite(convidarCom.id, c.email)} className="text-slate-400 hover:text-rose-600">
                          <X />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Overlay>
      )}
    </div>
  );
}

/* =====================
   OVERLAY genérico
===================== */
function Overlay({ children, onClick }) {
  return (
    <div onClick={onClick} className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
      {children}
    </div>
  );
}

/* =====================
   MENU DE OPÇÕES (três pontinhos)
===================== */
function MenuOpcoes({ onConvidar, onEditar, onExcluir }) {
  return (
    <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
      <button onClick={onConvidar} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">
        <Link2 /> Convidar membros
      </button>
      <button onClick={onEditar} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">
        <Pencil /> Editar comunidade
      </button>
      <button onClick={onExcluir} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50">
        <Trash2 /> Excluir comunidade
      </button>
    </div>
  );
}

/* =====================
   LISTA DE COMUNIDADES
===================== */
function ListaComunidades({ comunidades, onNovaComunidade, onAbrirComunidade, menuAberto, setMenuAberto, onEditar, onExcluir, onConvidar }) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-slate-900">Comunidades</h1>
          <p className="mt-1 text-sm text-slate-500">Participe de grupos de estudo e colabore com outros estudantes.</p>
        </div>
        <button
          onClick={onNovaComunidade}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus /> Nova Comunidade
        </button>
      </div>

      {comunidades.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 py-16 text-center text-sm text-slate-400">
          Nenhuma comunidade ainda. Crie a primeira acima ✨
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comunidades.map((com) => (
            <div
              key={com.id}
              onClick={() => onAbrirComunidade(com.id)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-indigo-100 to-slate-100">
                {com.foto ? <img src={com.foto} alt="foto" className="h-full w-full object-cover" /> : <span className="text-4xl">🏫</span>}
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="font-display text-base text-slate-900">{com.nome}</h3>
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuAberto(menuAberto === `card:${com.id}` ? null : `card:${com.id}`); }}
                      className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <MoreVertical />
                    </button>
                    {menuAberto === `card:${com.id}` && (
                      <MenuOpcoes
                        onConvidar={() => onConvidar(com.id)}
                        onEditar={() => onEditar(com.id)}
                        onExcluir={() => onExcluir(com.id)}
                      />
                    )}
                  </div>
                </div>
                <p className="line-clamp-2 text-sm text-slate-500">{com.descricao}</p>
                <div className="mt-3 flex gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-1">📁 {com.categoria}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">🌐 {com.privacidade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =====================
   PÁGINA DA COMUNIDADE
===================== */
function PaginaComunidade({ comunidade, onVoltar, onAbrirSala, menuAberto, setMenuAberto, onEditar, onExcluir, onConvidar }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <button onClick={onVoltar} className="rounded-full p-1 hover:bg-slate-100"><ArrowLeft /></button>
        <span>Comunidades › <span className="font-medium text-slate-700">{comunidade.nome}</span></span>
        <div className="relative ml-auto">
          <button
            onClick={() => setMenuAberto(menuAberto === "pagina" ? null : "pagina")}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <MoreVertical />
          </button>
          {menuAberto === "pagina" && (
            <MenuOpcoes
              onConvidar={() => onConvidar(comunidade.id)}
              onEditar={() => onEditar(comunidade.id)}
              onExcluir={() => onExcluir(comunidade.id)}
            />
          )}
        </div>
      </div>

      <div className="mb-5 flex h-40 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-100 to-slate-100 sm:h-52">
        {comunidade.foto ? <img src={comunidade.foto} alt="banner" className="h-full w-full object-cover" /> : <span className="text-5xl">🏫</span>}
      </div>

      <h1 className="font-display text-2xl text-slate-900">{comunidade.nome}</h1>
      <p className="mt-1 text-sm text-slate-500">{comunidade.descricao}</p>

      <p className="mb-3 mt-6 text-sm font-semibold text-slate-700">Salas</p>
      <div className="space-y-2">
        {SALAS_PADRAO.map((sala) => (
          <button
            key={sala.nome}
            onClick={() => onAbrirSala(sala.nome)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">{sala.icone}</div>
              <div>
                <div className="text-sm font-semibold text-slate-800">{sala.nome}</div>
                <div className="text-xs text-slate-500">{sala.desc}</div>
              </div>
            </div>
            <span className="text-xs font-medium text-indigo-600">Entrar →</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* =====================
   SALA INTERNA (chat / arquivos)
===================== */
function SalaInterna({
  sala, dados, comunidade, onVoltar,
  inputMensagem, setInputMensagem, onEnviarMensagem,
  onAlternarCompartilhar, onEnviarArquivo,
  linkConvite, emailConvitePasta, setEmailConvitePasta,
  statusCopiarPasta, setStatusCopiarPasta, copiarLink,
  enviarConvite, removerConvite,
}) {
  const chatRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [dados?.mensagens?.length]);

  if (!dados) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <button onClick={onVoltar} className="rounded-full p-1 hover:bg-slate-100"><ArrowLeft /></button>
        <span className="font-semibold text-slate-800">{sala.icone} {sala.nome}</span>
      </div>

      {sala.tipo === "arquivos" ? (
        <div>
          <h2 className="mb-3 font-display text-lg text-slate-900">📁 Arquivos</h2>

          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-sm font-semibold text-slate-800">Pasta compartilhada</span>
                <p className="text-xs text-slate-500">Permita que outras pessoas acessem esta pasta via link ou convite por e-mail.</p>
              </div>
              <label className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={dados.compartilhada}
                  onChange={(e) => onAlternarCompartilhar(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-indigo-600" />
                <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
              </label>
            </div>

            {dados.compartilhada && (
              <div className="mt-4">
                <div className="flex gap-2">
                  <input readOnly value={linkConvite(comunidade.id)} className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" />
                  <button
                    onClick={() => copiarLink(linkConvite(comunidade.id), setStatusCopiarPasta)}
                    className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Copiar
                  </button>
                </div>
                {statusCopiarPasta && <div className="mt-1 text-xs font-medium text-emerald-600">{statusCopiarPasta}</div>}

                <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
                  <div className="h-px flex-1 bg-slate-200" /> ou convide por e-mail <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="exemplo@email.com"
                    value={emailConvitePasta}
                    onChange={(e) => setEmailConvitePasta(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  />
                  <button
                    onClick={() => enviarConvite(comunidade.id, emailConvitePasta, () => setEmailConvitePasta(""))}
                    className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
                  >
                    Enviar convite
                  </button>
                </div>

                {comunidade.convidados.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium text-slate-500">Convites enviados:</p>
                    {comunidade.convidados.map((c) => (
                      <div key={c.email} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <span className="flex items-center gap-2 text-sm text-slate-700"><Mail /> {c.email}</span>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">Pendente</span>
                          <button onClick={() => removerConvite(comunidade.id, c.email)} className="text-slate-400 hover:text-rose-600">
                            <X />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Enviar arquivo:</label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              <Upload /> Escolher arquivo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onEnviarArquivo(f); e.target.value = ""; }}
            />
          </div>

          <div className="space-y-2">
            {dados.arquivos.map((nome, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700">
                📄 {nome}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-[60vh] flex-col rounded-2xl border border-slate-200 bg-white">
          <h2 className="border-b border-slate-100 px-4 py-3 font-display text-base text-slate-900">💬 Chat</h2>
          <div ref={chatRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {dados.mensagens.length === 0 ? (
              <p className="text-center text-sm text-slate-400">Nenhuma mensagem ainda. Diga oi 👋</p>
            ) : (
              dados.mensagens.map((texto, i) => (
                <div key={i} className="max-w-[75%] rounded-2xl bg-indigo-50 px-3 py-2 text-sm text-slate-800">{texto}</div>
              ))
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-slate-100 p-3">
            <input
              type="text"
              placeholder="Digite uma mensagem..."
              value={inputMensagem}
              onChange={(e) => setInputMensagem(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onEnviarMensagem(); }}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
            <button onClick={onEnviarMensagem} className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              <Send />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
