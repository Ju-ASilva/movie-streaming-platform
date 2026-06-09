import { useEffect, useState } from "react";
import { MovieCard } from "../../components/MovieCard";
import { Header } from "../../components/Header"; 
import { KeepWatchingCard } from "../../components/KeepWatchingCard";
import { getMovies } from "../../services/movieApi";
import { getUnfinishedMoviesByUserId } from "../../services/historyApi"; 
import {
  addMovieToPlaylist,
  getPlaylistsByUserId,
} from "../../services/playlistApi";
import type { Movie, PageMessage, Playlist } from "../../types";
import "./HomePage.css";

interface HomePageProps {
  userId: string;
  onGoToPlaylists: () => void;
  onGoToHome?: () => void;
  onGoToHistory: () => void;
  onGoToSearch: () => void; 
  onSelectMovie: (movie: Movie) => void;
  onGoToProfile?: () => void; 
}

export function HomePage({ userId, onGoToPlaylists, onGoToHome, onGoToHistory, onGoToSearch, onSelectMovie, onGoToProfile }: HomePageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [keepWatchingMovies, setKeepWatchingMovies] = useState<{
    movieId: string;
    title: string;
    image?: string | null;
    progress_percentage: number;
  }[]>([]);
  const [isLoadingKeepWatching, setIsLoadingKeepWatching] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [availablePlaylists, setAvailablePlaylists] = useState<Playlist[]>([]);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);

  const [playlistMessage, setPlaylistMessage] = useState<PageMessage | null>(null);

  const AVAILABLE_GENRES = [
    "Ação", 
    "Aventura", 
    "Comédia", 
    "Drama", 
    "Ficção Científica", 
    "Terror", 
    "Romance", 
    "Animação", 
    "Documentário", 
    "Suspense"
  ];
  const [selectedGenre, setSelectedGenre] = useState<string>(""); 
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoadingMovies(true);
        setError(null);
        
        const data = await getMovies(undefined, selectedGenre !== "" ? selectedGenre : undefined);
        
        setMovies(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro inesperado ao buscar filmes",
        );
      } finally {
        setLoadingMovies(false);
      }
    }

    loadMovies();
  }, [selectedGenre]);

  useEffect(() => {
    let isMounted = true;

    async function loadKeepWatchingMovies() {
      try {
        setIsLoadingKeepWatching(true);

        const data = await getUnfinishedMoviesByUserId(userId);

        if (isMounted) {
          setKeepWatchingMovies(data);
        }
      } catch (err) {
        console.warn("Erro ao carregar filmes em andamento", err);

        if (isMounted) {
          setKeepWatchingMovies([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingKeepWatching(false);
        }
      }
    }

    loadKeepWatchingMovies();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  async function openAddMovieToPlaylistModal(movie: Movie) {
    try {
      setSelectedMovie(movie);
      setAvailablePlaylists([]);
      setPlaylistMessage(null);
      setIsPlaylistModalOpen(true);
      setIsLoadingPlaylists(true);

      const data = await getPlaylistsByUserId(userId);

      setAvailablePlaylists(data.playlists);

      if (data.playlists.length === 0) {
        setPlaylistMessage({
          type: "info",
          text: "Não existem playlists disponíveis",
        });
      }
    } catch (err) {
      setPlaylistMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Erro inesperado ao buscar playlists disponíveis",
      });
    } finally {
      setIsLoadingPlaylists(false);
    }
  }

  function closePlaylistModal() {
    setSelectedMovie(null);
    setAvailablePlaylists([]);
    setIsPlaylistModalOpen(false);
    setIsLoadingPlaylists(false);
  }

  async function handleAddMovieToPlaylist(playlistName: string) {
    if (!selectedMovie) {
      return;
    }

    try {
      const data = await addMovieToPlaylist({
        userId,
        playlistName,
        movieName: selectedMovie.title,
      });

      setPlaylistMessage({
        type: "success",
        text: data.message,
      });

      closePlaylistModal();
    } catch (err) {
      setPlaylistMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Erro inesperado ao adicionar filme à playlist",
      });
    }
  }

  return (
    <div className="home-page">
      <Header 
        activePage="home" 
        onGoToHome={onGoToHome}
        onGoToPlaylists={onGoToPlaylists}
        onLogout={() => {
          console.log("Usuário deslogado");
        }}
        onGoToHistory={onGoToHistory}
        onGoToSearch={onGoToSearch}
        onGoToProfile={onGoToProfile}
      />

      <main className="home-content">
        <section className="home-hero">
          <p className="home-eyebrow">Catálogo</p>
          <h1>Página Principal</h1>
          <p>
            Explore o catálogo de filmes e organize seus favoritos em playlists.
          </p>
        </section>

        {error && <p className="home-error">❌ {error}</p>}

        {!isPlaylistModalOpen && playlistMessage && (
          <p className={`catalog-playlist-message ${playlistMessage.type}`}>
            {playlistMessage.text}
          </p>
        )}

        <section className="keep-watching-section">
          <div className="section-title-wrapper">
            <h2>Continuar Assistindo</h2>
            <div className="section-title-line"></div>
          </div>
          
          {isLoadingKeepWatching ? (
            <p className="catalog-empty-message">Carregando filmes em andamento...</p>
          ) : keepWatchingMovies.length === 0 ? (
            <p className="catalog-empty-message">Nenhum filme em andamento no momento.</p>
          ) : (
            <div className="keep-watching-scrollview">
              {keepWatchingMovies.map((item) => (
                <div key={item.movieId} className="keep-watching-scroll-item">
                  <KeepWatchingCard
                    title={item.title}
                    thumbnailUrl={item.image ?? undefined}
                    progressPercentage={item.progress_percentage}
                    onClick={() => console.log(`Clicou no filme: ${item.title}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="catalog-section">
          <div className="catalog-header-flex">
            <div className="section-title-wrapper">
              <h2>{selectedGenre ? `Filmes de ${selectedGenre}` : "Todos os Filmes"}</h2>
              <div className="section-title-line"></div>
            </div>
            
            <div className="genre-filter-container">
              <button 
                className="home-outline-button"
                onClick={() => setIsGenreMenuOpen(!isGenreMenuOpen)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E5E2E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                {selectedGenre ? selectedGenre : "Selecionar gênero"}
              </button>

              {isGenreMenuOpen && (
                <div className="genre-dropdown-menu">
                  <button 
                    className="genre-dropdown-item"
                    onClick={() => { setSelectedGenre(""); setIsGenreMenuOpen(false); }}
                  >
                    Todos os Gêneros
                  </button>
                  
                  {AVAILABLE_GENRES.map((genre) => (
                    <button 
                      key={genre}
                      className={`genre-dropdown-item ${selectedGenre === genre ? "active" : ""}`}
                      onClick={() => { setSelectedGenre(genre); setIsGenreMenuOpen(false); }}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        {loadingMovies && (
          <p className="catalog-empty-message">Carregando filmes...</p>
        )}

        {!loadingMovies && movies.length === 0 && !error && (
          <p className="catalog-empty-message">
            Nenhum filme encontrado no catálogo.
          </p>
        )}

        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onAddToPlaylist={openAddMovieToPlaylistModal}
              onSelectMovie={onSelectMovie}
            />
          ))}
        </div>
      </section>
      </main>

      {/* MODAL DE PLAYLIST INTACTO */}
      {isPlaylistModalOpen && selectedMovie && (
        <div className="catalog-modal-backdrop">
          <section className="catalog-modal">
            <div className="catalog-modal-header">
              <div>
                <p>Adicionar à playlist</p>
                <h2>{selectedMovie.title}</h2>
              </div>

              <button type="button" onClick={closePlaylistModal}>
                ×
              </button>
            </div>

            {playlistMessage && (
              <p className={`catalog-playlist-message ${playlistMessage.type}`}>
                {playlistMessage.text}
              </p>
            )}

            {isLoadingPlaylists && (
              <p className="catalog-empty-playlists">
                Carregando playlists disponíveis...
              </p>
            )}

            {!isLoadingPlaylists && availablePlaylists.length === 0 && (
              <div className="catalog-empty-playlists">
                <p>Não existem playlists disponíveis</p>
              </div>
            )}

            {!isLoadingPlaylists && availablePlaylists.length > 0 && (
              <div className="catalog-playlist-options">
                {availablePlaylists.map((playlist) => (
                  <button
                    key={playlist.id}
                    type="button"
                    onClick={() => handleAddMovieToPlaylist(playlist.name)}
                  >
                    <strong>{playlist.name}</strong>

                    <span>
                      {playlist.movies.length === 0
                        ? "Nenhum filme adicionado"
                        : `${playlist.movies.length} filme(s)`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}