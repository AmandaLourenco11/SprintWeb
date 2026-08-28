import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderPagina from "./components/HeaderPagina";
import AcessoRapido from "./components/AcessoRapido";
import ProgressoCard from "./components/ProgressoCard";
import ResumoCards from "./components/ResumoCards";
import Overlay from "./components/Overlay";
import ProximasProvas from "./components/ProximasProvas";
import UltimosArquivos from "./components/UltimosArquivos";
import NavMobile from "./components/NavMobile";
import Footer from "./components/Footer";
import Materias from "./pages/Materias";
import PaginaMateria from "./pages/PaginaMateria";
import Calendario from "./pages/Calendario";
import Camera from "./pages/Camera";
import Perfil from "./pages/Perfil";
import "./index.css";

const notificacoesIniciais = [
  { id: 1, texto: "Sua prova de Cálculo I é em 10 dias.", lida: false },
  { id: 2, texto: "Nova anotação adicionada em Física II.", lida: false },
  { id: 3, texto: "Você completou 3 tarefas hoje. Parabéns!", lida: true },
];

const App = () => {
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais);
  const [overlayAberto, setOverlayAberto] = useState(false);

  const [progresso, setProgresso] = useState(() => {
    const salvo = localStorage.getItem("joviclass:progresso");
    return salvo ? JSON.parse(salvo) : { valor: 78, tarefasConcluidas: 3, materiasEstudadas: 2, anotacoesFeitas: 12 };
  });

  useEffect(() => {
    localStorage.setItem("joviclass:progresso", JSON.stringify(progresso));
  }, [progresso]);

  function marcarTodasComoLidas() {
    setNotificacoes((atual) => atual.map((notificacao) => ({ ...notificacao, lida: true })));
  }

  function confirmarAcao() {
    setProgresso((atual) => ({
      ...atual,
      tarefasConcluidas: atual.tarefasConcluidas + 1,
      valor: Math.min(100, atual.valor + Math.round(100 / 13)),
    }));
    setOverlayAberto(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/camera" element={<Camera />} />

        <Route path="/" element={
          <>
            <HeaderPagina notificacoes={notificacoes} marcarTodasComoLidas={marcarTodasComoLidas} />
            <div className="area-principal">
              <main className="conteudo">
                <div className="saudacao">
                  <div>
                    <h1>Olá, Helena!</h1>
                    <p>Vamos continuar seus estudos?</p>
                  </div>
                </div>

                <ProgressoCard valor={progresso.valor} tarefasConcluidas={progresso.tarefasConcluidas} materiasEstudadas={progresso.materiasEstudadas} anotacoesFeitas={progresso.anotacoesFeitas} />

                <button type="button" className="btn-revisao" style={{ marginTop: 12, border: "none", cursor: "pointer" }} onClick={() => setOverlayAberto(true)}>
                  Marcar tarefa como concluída
                </button>

                <ResumoCards itens={[
                  { label: "Matérias", valor: 6 },
                  { label: "Arquivos", valor: 24 },
                  { label: "Anotações", valor: 136 },
                  { label: "Tarefas", valor: 8 },
                ]} />

                <AcessoRapido itens={[
                  { id: "materias", label: "Matérias", icone: "📘", cor: "roxo", link: "/materias" },
                  { id: "arquivos", label: "Arquivos", icone: "🗂️", cor: "azul", link: "/materias" },
                  { id: "anotacoes", label: "Anotações", icone: "✏️", cor: "laranja", link: "/materias" },
                  { id: "tarefas", label: "Tarefas", icone: "✅", cor: "verde", link: "/calendario" },
                ]} />

                <div className="secoes">
                  <ProximasProvas provas={[
                    { id: 1, materia: "Cálculo I", icone: "ƒ(x)", cor: "roxo", data: "25/05/2024", progresso: 65, diasRestantes: 10 },
                    { id: 2, materia: "Física II", icone: "⚛️", cor: "verde", data: "02/06/2024", progresso: 40, diasRestantes: 18 },
                    { id: 3, materia: "Economia", icone: "💹", cor: "azul", data: "10/06/2024", progresso: 20, diasRestantes: 26 },
                  ]} />

                  <UltimosArquivos arquivos={[
                    { id: 1, nome: "Funções de 2° grau", materia: "Matemática", data: "20/05", icone: "📄", cor: "laranja" },
                    { id: 2, nome: "Leis de Newton", materia: "Física", data: "19/05", icone: "📄", cor: "verde" },
                    { id: 3, nome: "Demanda e Oferta", materia: "Economia", data: "18/05", icone: "📄", cor: "azul" },
                  ]} />
                </div>

                <section className="sugestao-card">
                  <div className="sugestao-texto">
                    <span className="sugestao-eyebrow">✦ Sugestão para hoje</span>
                    <p>Você tem uma prova de Cálculo em 10 dias. Que tal revisar derivadas por 30 minutos?</p>
                    <a href="/materias" className="btn-revisao">Começar revisão</a>
                  </div>
                </section>

                <NavMobile />

                {overlayAberto && <Overlay cancelar={() => setOverlayAberto(false)} confirmar={confirmarAcao} />}
              </main>
              <Footer />
            </div>
          </>
        } />

        <Route path="/materias" element={
          <>
            <HeaderPagina notificacoes={notificacoes} marcarTodasComoLidas={marcarTodasComoLidas} />
            <div className="area-principal">
              <main className="conteudo"><Materias /></main>
              <Footer />
            </div>
          </>
        } />

        <Route path="/materias/:id" element={
          <>
            <HeaderPagina notificacoes={notificacoes} marcarTodasComoLidas={marcarTodasComoLidas} />
            <div className="area-principal">
              <main className="conteudo"><PaginaMateria /></main>
              <Footer />
            </div>
          </>
        } />

        <Route path="/calendario" element={
          <>
            <HeaderPagina notificacoes={notificacoes} marcarTodasComoLidas={marcarTodasComoLidas} />
            <div className="area-principal">
              <main className="conteudo"><Calendario /></main>
              <Footer />
            </div>
          </>
        } />

        <Route path="/perfil" element={
          <>
            <HeaderPagina notificacoes={notificacoes} marcarTodasComoLidas={marcarTodasComoLidas} />
            <div className="area-principal">
              <main className="conteudo"><Perfil /></main>
              <Footer />
            </div>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;