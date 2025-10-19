import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { addMovie } from "../services/api";

// Read OMDb API key from Vite environment variable.
// Create a .env file in the project root with: VITE_OMDB_API_KEY=your_key
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
if (!OMDB_API_KEY) {
  // Keep this console.warn so developers notice missing key in dev.
  console.warn(
    "VITE_OMDB_API_KEY is not set. Create a .env file with VITE_OMDB_API_KEY=your_key"
  );
}

export default function AddMovie() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    director: "",
    genre: "",
    platform: "",
    status: "wishlist",
    total_episodes: 1,
    watched_episodes: 0,
    rating: "",
    review: "",
    image_url: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "title" && value.trim().length >= 2) {
      fetchSearchResults(value);
    } else if (name === "title" && value.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // 🔍 Fetch multiple matching titles
  const fetchSearchResults = async (title) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          title
        )}&apikey=${OMDB_API_KEY}`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setSearchResults(data.Search.slice(0, 6)); // limit results
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 When a movie is selected from dropdown
  const handleSelectMovie = async (movie) => {
    setShowDropdown(false);
    setForm((prev) => ({ ...prev, title: movie.Title }));

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        setForm((prev) => ({
          ...prev,
          title: data.Title || prev.title,
          director: data.Director !== "N/A" ? data.Director : prev.director,
          genre: data.Genre !== "N/A" ? data.Genre : prev.genre,
          image_url: data.Poster !== "N/A" ? data.Poster : prev.image_url,
          rating: data.imdbRating !== "N/A" ? data.imdbRating : prev.rating,
        }));
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  // 🖱️ Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addMovie(form).then(() => navigate("/"));
  };

  return (
    <div className="p-4 max-w-lg mx-auto relative">
      <h2 className="text-2xl font-bold mb-4">Add Movie</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit} ref={dropdownRef}>
        {/* Title Input with Dropdown */}
        <div className="relative">
          <input
            type="text"
            name="title"
            placeholder="Enter Title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            autoComplete="off"
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          />
          {loading && (
            <p className="text-sm text-gray-500 mt-1 animate-pulse">Searching...</p>
          )}
          {showDropdown && searchResults.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded w-full mt-1 shadow-md max-h-60 overflow-auto">
              {searchResults.map((movie) => (
                <li
                  key={movie.imdbID}
                  className="p-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                  onClick={() => handleSelectMovie(movie)}
                >
                  {movie.Poster !== "N/A" && (
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-8 h-10 object-cover rounded"
                    />
                  )}
                  <span className="text-sm">
                    {movie.Title} ({movie.Year})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Other Inputs */}
        {["director", "genre", "platform", "image_url", "review"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        ))}

        <div className="flex gap-2">
          <input
            type="number"
            name="total_episodes"
            placeholder="Total Episodes"
            value={form.total_episodes}
            onChange={handleChange}
            className="border p-2 rounded w-1/2"
          />
          <input
            type="number"
            name="watched_episodes"
            placeholder="Watched Episodes"
            value={form.watched_episodes}
            onChange={handleChange}
            className="border p-2 rounded w-1/2"
          />
        </div>

        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating"
          value={form.rating}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="watching">Watching</option>
          <option value="completed">Completed</option>
          <option value="wishlist">Wishlist</option>
          <option value="dropped">Dropped</option>
        </select>

        {form.image_url && (
          <img
            src={form.image_url}
            alt={form.title}
            className="rounded-md mt-2 w-full h-64 object-cover shadow"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
}
