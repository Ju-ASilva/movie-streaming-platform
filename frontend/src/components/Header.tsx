import cinemaLogo from "../assets/cinema_logo.png"; // Ajuste o caminho se necessário
import './Header.css';

interface HeaderProps {
  activePage: "home" | "playlists" | "perfil" | string;
  onGoToHome?: () => void;
  onGoToPlaylists?: () => void;
  onLogout?: () => void;
  onGoToHistory?: () => void;
  onGoToProfile?: () => void;
  onGoToSearch?: () => void;
}

export function Header({ activePage, onGoToHome, onGoToPlaylists, onLogout, onGoToHistory, onGoToProfile, onGoToSearch}: HeaderProps) {
  return (
    <header className="home-header">
      <img 
        src={cinemaLogo} 
        width="180" 
        alt="Cinema" 
        style={{ cursor: onGoToHome ? "pointer" : "default" }}
        onClick={onGoToHome}
      />

      <div className="home-header-right">
        <nav className="home-nav">
          {/* BOTÃO DE PESQUISA ATUALIZADO */}
          <button 
            className={`header-outline-button ${activePage === "search" ? "active" : ""}`} 
            onClick={onGoToSearch}
            type="button"
          >
            {/* Note que o stroke mudou para "currentColor" */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Pesquisa
          </button>

          <button 
            className={`home-nav-button ${activePage === "home" ? "active" : ""}`} 
            type="button"
            onClick={onGoToHome}
          >
            Página Principal
          </button>

          <button
            className={`home-nav-button ${activePage === "playlists" ? "active" : ""}`} 
            type="button"
            onClick={onGoToPlaylists}
          >
            Minhas Playlists
          </button>
        </nav>

        <div className="profile-dropdown">
          <button className="profile-trigger" type="button">
            <span className="profile-avatar">U</span>
            <span className="profile-arrow"></span>
          </button>
          <div className="profile-menu">
            <button type="button" className="profile-menu-item" onClick={onGoToProfile}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Perfil
            </button>
            <button type="button" className="profile-menu-item" onClick={onGoToHistory}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
              Histórico
            </button>
            <div className="profile-menu-divider"></div>
            <button type="button" className="profile-menu-item logout" onClick={onLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}