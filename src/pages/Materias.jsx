import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CardsMaterias from "../components/CardsMaterias";
import ModalMateria from "../components/ModalMateria";
import DropdownMateria from "../components/DropdownMateria";
import NavMobile from "../components/NavMobile";
import '../css/Materias.css'

const CHAVE_MATERIAS = "materias";

const CORES = [
  { cor: "#1466ff", nome: "Azul" },
  { cor: "#7c3aed", nome: "Roxo" },
  { cor: "#0891b2", nome: "Ciano" },
  { cor: "#059669", nome: "Verde" },
  { cor: "#d97706", nome: "Amarelo" },
  { cor: "#dc2626", nome: "Vermelho" },
  { cor: "#db2777", nome: "Rosa" },
  { cor: "#ea580c", nome: "Laranja" },
];


// Toast
function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const mostrarToast = useCallback((msg) => {
    setToast({ msg, show: true });

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setToast((t) => (t ? { ...t, show: false } : t));
    }, 2500);
  }, []);

  const ToastEl = toast ? (
    <div className={`toast${toast.show ? " show" : ""}`}>
      {toast.msg}
    </div>
  ) : null;

  return { mostrarToast, ToastEl };
}


const Materia = () => {
  const navigate = useNavigate();
  const { mostrarToast, ToastEl } = useToast();

  // Matérias
  const [materias, setMaterias] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_MATERIAS) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CHAVE_MATERIAS, JSON.stringify(materias));
  }, [materias]);


  // Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nomeInput, setNomeInput] = useState("");
  const [corSelecionada, setCorSelecionada] = useState("#1466ff");
  const inputRef = useRef(null);


  function abrirFormulario() {
    setEditandoId(null);
    setNomeInput("");
    setCorSelecionada("#1466ff");
    setModalAberto(true);
  }


  function abrirRenomear(materia) {
    setEditandoId(materia.id);
    setNomeInput(materia.nome);
    setCorSelecionada(materia.cor || "#1466ff");
    setModalAberto(true);
  }


  function fecharModal() {
    setModalAberto(false);
    setNomeInput("");
    setEditandoId(null);
  }


  useEffect(() => {
    if (modalAberto) {
      inputRef.current?.focus();
    }
  }, [modalAberto]);


  function salvarMateria() {
    const nome = nomeInput.trim();

    if (!nome) {
      inputRef.current?.focus();
      return;
    }

    if (editandoId !== null) {
      setMaterias((prev) =>
        prev.map((materia) =>
          materia.id === editandoId
            ? { ...materia, nome, cor: corSelecionada }
            : materia
        )
      );

      mostrarToast("✏️ Matéria renomeada!");
    } else {
      setMaterias((prev) => [
        ...prev,
        {
          id: Date.now(),
          nome,
          arquivos: 0,
          compartilhada: false,
          cor: corSelecionada,
        },
      ]);

      mostrarToast("✅ Matéria criada!");
    }

    fecharModal();
  }


  // Dropdown
  const [dropdown, setDropdown] = useState(null);


  function abrirDropdown(id, btnEl) {
    const rect = btnEl.getBoundingClientRect();

    setDropdown({
      id,
      top: rect.bottom + 6 + window.scrollY,
      left: rect.left - 220 + rect.width,
    });
  }


  useEffect(() => {
    if (!dropdown) return;

    function fecharDropdown(e) {
      if (
        !e.target.closest(".dropdownMenu") &&
        !e.target.closest(".btnOpcoes")
      ) {
        setDropdown(null);
      }
    }

    document.addEventListener("click", fecharDropdown);

    return () => {
      document.removeEventListener("click", fecharDropdown);
    };
  }, [dropdown]);


  function toggleCompartilhar(id) {
    setDropdown(null);

    setMaterias((prev) =>
      prev.map((materia) => {
        if (materia.id !== id) return materia;

        const compartilhada = !materia.compartilhada;

        mostrarToast(
          compartilhada
            ? "📤 Pasta compartilhada!"
            : "🔒 Compartilhamento removido"
        );

        return { ...materia, compartilhada };
      })
    );
  }


  function excluirMateria(id) {
    setDropdown(null);

    const materia = materias.find((m) => m.id === id);

    if (!materia) return;

    const confirmou = window.confirm(
      `Excluir a matéria "${materia.nome}"? Essa ação não pode ser desfeita.`
    );

    if (!confirmou) return;

    setMaterias((prev) =>
      prev.filter((materia) => materia.id !== id)
    );

    mostrarToast("🗑️ Matéria excluída");
  }


  return (
    <>
      <div className="materias">

        <div className="headerMaterias">
          <div className="titulo">
            <h1>Matérias</h1>
            <p>Organize suas matérias para fácil acesso</p>
          </div>

          <button
            id="btnMateria"
            type="button"
            onClick={abrirFormulario}
          >
            + Nova Matéria
          </button>
        </div>


        <CardsMaterias
          materias={materias}
          abrirDropdown={abrirDropdown}
          abrirMateria={(id, nome) =>
            navigate(
              `/materias/${id}?nome=${encodeURIComponent(nome)}`
            )
          }
        />

      </div>


      <ModalMateria
        aberto={modalAberto}
        editandoId={editandoId}
        nomeInput={nomeInput}
        corSelecionada={corSelecionada}
        inputRef={inputRef}
        cores={CORES}
        mudarNome={setNomeInput}
        mudarCor={setCorSelecionada}
        cancelar={fecharModal}
        salvar={salvarMateria}
      />


      <DropdownMateria
        dropdown={dropdown}
        materias={materias}
        onCompartilhar={toggleCompartilhar}
        onRenomear={abrirRenomear}
        onExcluir={excluirMateria}
      />


      <NavMobile />


    </>
  );
};


export default Materia;