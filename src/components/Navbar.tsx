import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">Club</div>
      </div>
      <ul className="navbar-links">
        <li><Link to="/home">Início</Link></li>
        <li><Link to="/clubes">Clubes</Link></li>
        <li><Link to="/eventos">Eventos</Link></li>
      </ul>
      <div className="navbar-right">
        <button className="bell">🔔</button>
        <div className="avatar-wrapper" onClick={toggleMenu}>
          <img
            className="avatar"
            src="https://i.pravatar.cc/40"
            alt="Perfil do usuário"
          />
          {menuOpen && (
            <div className="dropdown-menu" onMouseLeave={closeMenu}>
              <Link to="/perfil">Perfil</Link>
              <Link to="/criar-club">Criar Club</Link>
              <Link to="/estatisticas">Minhas Estatísticas</Link>
              <Link to="/configuracoes">Configurações</Link>
              <Link to="/logout">Sair</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
