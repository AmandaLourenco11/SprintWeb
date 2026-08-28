import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from "../assets/logo.png"

const HeaderPagina = ({ notificacoes, marcarTodasComoLidas }) => {
    const [menuAberto, setMenuAberto] = useState(false);
    const [notifAberto, setNotifAberto] = useState(false);
    const { pathname } = useLocation();

    const naoLidas = notificacoes.filter((n) => !n.lida).length;
    return (
        <>
            <header className="menu">
                <div className="menu-header">
                    <div className="logoJovi">
                        <img src={logo} alt="Logo JoviClass" id="logo" />
                        <h2>JoviClass</h2>
                    </div>

                    <div className="menu-actions">
                        <div className="notif-wrapper">
                            <button
                                className="icon-btn"
                                id="notifBtn"
                                aria-label="Notificações"
                                aria-haspopup="true"
                                aria-expanded={notifAberto}
                                onClick={() => setNotifAberto((aberto) => !aberto)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 3a6 6 0 0 0-6 6v3.586l-1.707 1.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L18 12.586V9a6 6 0 0 0-6-6Z"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M9.5 19a2.5 2.5 0 0 0 5 0"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                {naoLidas > 0 && (
                                    <span className="notif-dot" id="notifDot">
                                        {naoLidas}
                                    </span>
                                )}
                            </button>

                            {notifAberto && (
                                <div className="notif-panel" id="notifPanel">
                                    <div className="notif-panel-header">
                                        <strong>Notificações</strong>
                                        <button
                                            id="notifMarcarLidas"
                                            className="notif-marcar"
                                            onClick={marcarTodasComoLidas}
                                        >
                                            Marcar todas como lidas
                                        </button>
                                    </div>
                                    <div className="notif-lista" id="notifLista">
                                        {notificacoes.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`notif-item${n.lida ? " lida" : ""}`}
                                            >
                                                {n.texto}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            className="hamburger"
                            id="hamburger"
                            aria-label="Abrir menu"
                            aria-expanded={menuAberto}
                            onClick={() => setMenuAberto((aberto) => !aberto)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>

                <nav className={`menu-links${menuAberto ? " active" : ""}`} id="menuLinks">
                    <Link
                        to="/"
                        className={pathname === "/" ? "ativo" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Início
                    </Link>


                    <Link
                        to="/materias"
                        className={pathname === "/materias" ? "ativo" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Matérias
                    </Link>

                    <Link
                        to="/calendario"
                        className={pathname === "/calendario" ? "ativo" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Calendário
                    </Link>

                    <Link
                        to="/camera"
                        className={pathname === "/camera" ? "ativo" : ""}
                        onClick={() => setMenuAberto(false)}
                    >
                        Voltar a câmera ↩
                    </Link>

                </nav>
            </header>
        </>
    )
}

export default HeaderPagina
