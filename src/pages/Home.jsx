import { useEffect, useState } from "react";
import { getMovies, deleteMovie } from "../services/api";
import MovieCard from "../components/MovieCard";
import FilterBar from "../components/FilterBar";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFiltered] = useState([]);

  const fetchMovies = () => {
    getMovies()
      .then(res => {
        setMovies(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      deleteMovie(id).then(fetchMovies);
    }
  };

  return (
    <div className="p-4">
      {/* Dynamic FilterBar sets filteredMovies */}
      <FilterBar movies={movies} setFiltered={setFiltered} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
