import './App.css'
import Search from './components/Search.tsx';
import MovieCard from './components/MovieCard.tsx';
import Spinner from './components/Spinner.tsx';
import heroImage from './assets/hero_1.png';
import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.ts';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [movieList, setMovieList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [trendingMovies, setTrendingMovies] = useState([])
  const [debouchedSearchTerm, setdebouchedSearchTerm] = useState<string>('')

  useDebounce(() => setdebouchedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovie = async (query: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();

      setMovieList(data.results || [])

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`)
      setErrorMessage('Error fetching movies. Please try again later!')
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async (query: string) => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies)
    } catch (error) {
      console.log(`Error fething trending movies: ${error}`)
    }
  }

  useEffect(() => {
    fetchMovie(debouchedSearchTerm);
  }, [debouchedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, [])

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src={heroImage} alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll ACTUALLY Enjoy</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie: any, index: number) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='All movies'>
          <h2 className="mt-[40px]"> All Movies </h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {movieList?.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App

