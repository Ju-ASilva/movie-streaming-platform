import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { MinhasPlaylistsPage } from "./pages/MinhasPlaylists/MinhasPlaylistsPage";
import { HistoryPage } from "./pages/History/HistoryPage"; 
import { MovieDetailsPage } from "./pages/MovieDetails/MovieDetailsPage";
import { AccountPage } from "./pages/Account/AccountPage";
import { SearchPage } from "./pages/Search/SearchPage"; // 🚀 1. Importando sua página
import type { Movie } from "./types";

function App() {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Mantendo o padrão da equipe para testes manuais e de BDD
  const currentUserId = "1";

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            userId={currentUserId}
            onGoToPlaylists={() => navigate("/playlists")}
            onGoToHome={() => navigate("/")}
            onGoToHistory={() => navigate("/history")}
            onGoToSearch={() => navigate("/search")} // 🚀 2. Ensinando a Home a ir para a Busca
            onSelectMovie={(movie) => {
              setSelectedMovie(movie);
              navigate(`/movies/${movie.id}`);
            }}
            onGoToProfile={() => navigate("/perfil")}
          />
        }
      />
      
      {/* 🚀 3. A NOVA ROTA DA SUA TELA DE BUSCA */}
      <Route
        path="/search"
        element={
          <SearchPage
            onGoToHome={() => navigate("/")}
            onGoToPlaylists={() => navigate("/playlists")}
            onGoToHistory={() => navigate("/history")}
            onSelectMovie={(movie) => {
              setSelectedMovie(movie);
              navigate(`/movies/${movie.id}`);
            }}
          />
        }
      />

      <Route
        path="/playlists"
        element={
          <MinhasPlaylistsPage
            userId={currentUserId}
            onGoToHome={() => navigate("/")}
          />
        }
      />
      
      <Route
        path="/history"
        element={
          <HistoryPage
            userId={currentUserId}
            onGoToHome={() => navigate("/")}
            onGoToPlaylists={() => navigate("/playlists")}
            onGoToHistory={() => navigate("/history")}
            onGoToProfile={() => navigate("/perfil")}
          />
        }
      />
      
      <Route
        path="/movies/:id"
        element={
          selectedMovie ? (
            <MovieDetailsPage
              movie={selectedMovie}
              userId={currentUserId}
              onGoToHome={() => navigate("/")}
            />
          ) : (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
              <p className="text-gray-400 font-semibold text-lg">Filme não selecionado.</p>
              <button 
                onClick={() => navigate("/")} 
                className="px-6 py-2 bg-[#FFC107] text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Voltar para a Página Principal
              </button>
            </div>
          )
        }
      />
      
      <Route
        path="/perfil"
        element={
          <AccountPage
            userId={currentUserId}
            onGoToHome={() => navigate("/")}
            onGoToPlaylists={() => navigate("/playlists")}
            onGoToHistory={() => navigate("/history")}
            onLogout={() => {
              console.log("Logout executado");
              navigate("/");
            }}
          />
        }
      />
    </Routes>
  );
}

export default App;