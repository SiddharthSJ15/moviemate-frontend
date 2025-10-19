import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMovie, deleteMovie } from "../services/api";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showFullReview, setShowFullReview] = useState(false);

  const fetchMovie = () => {
    setLoading(true);
    setError(null);
    getMovie(id)
      .then(res => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load movie. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this movie? This action cannot be undone.")) return;
    try {
      setDeleting(true);
      await deleteMovie(id);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to delete the movie. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div role="status" aria-live="polite" className="inline-flex items-center gap-2">
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20" />
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span>Loading movie...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto card text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex justify-center gap-3">
          <button onClick={fetchMovie} className="px-4 py-2 rounded-md border">Retry</button>
          <Link to="/" className="px-4 py-2 rounded-md bg-slate-100">Back</Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return <p className="text-center py-8">No movie data found.</p>;
  }

  const statusClasses = {
    watching: "bg-blue-500",
    completed: "bg-green-500",
    wishlist: "bg-gray-400",
    dropped: "bg-red-500"
  };

  const percent =
    movie.total_episodes && movie.total_episodes > 0
      ? Math.min(100, Math.round((movie.watched_episodes / movie.total_episodes) * 100))
      : 0;

  const reviewText = movie.review || "No review provided.";
  const isLongReview = reviewText.length > 300;

  return (
    <div className="card p-4 my-5 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left - Poster */}
      <div className="md:col-span-1 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
        <img
          src={movie.image_url || "https://via.placeholder.com/600x400"}
          alt={movie.title || "Movie poster"}
          className="w-full h-full object-cover max-h-[420px]"
        />
      </div>

      {/* Right - Details */}
      <div className="md:col-span-2 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-slate-900 break-words">{movie.title}</h2>
            <p className="text-sm text-slate-500 mt-1 break-words">
              {movie.genre ? `${movie.genre} • ${movie.platform || "Platform N/A"}` : (movie.platform || "Platform N/A")}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <span className={`inline-block px-3 py-1 rounded-full text-white text-sm ${statusClasses[movie.status] || 'bg-gray-400'}`}>
              {movie.status ? movie.status.charAt(0).toUpperCase() + movie.status.slice(1) : "Unknown"}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="min-w-0">
            <p className="text-sm text-slate-600">Director</p>
            <p className="font-medium break-words">{movie.director || "N/A"}</p>
          </div>

          <div className="min-w-0">
            <p className="text-sm text-slate-600">Rating</p>
            <p className="font-medium break-words">{movie.rating || "N/A"}</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-slate-600">Episodes</p>
          <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${percent}%`, background: "linear-gradient(90deg,var(--color-secondary),var(--color-accent))" }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">{movie.watched_episodes}/{movie.total_episodes} watched — {percent}%</p>
        </div>

        <div className="mt-5">
          <p className="text-sm text-slate-600 mb-2">Review</p>
          <div className="relative">
            <p className={`text-slate-700 whitespace-pre-wrap break-words ${!showFullReview && isLongReview ? 'line-clamp-6' : ''}`}>
              {reviewText}
            </p>
            {isLongReview && (
              <button
                onClick={() => setShowFullReview(!showFullReview)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 focus:outline-none focus:underline"
              >
                {showFullReview ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/" className="px-4 py-2 rounded-md border text-sm">Back</Link>
          <Link to={`/edit/${movie.id}`} className="px-4 py-2 rounded-md bg-yellow-500 text-white text-sm">Edit</Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-md bg-red-500 text-white text-sm disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}