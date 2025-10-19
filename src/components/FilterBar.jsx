import { useState } from 'react';

export default function FilterBar({ movies, setFiltered }) {
  const [filters, setFilters] = useState({ genre: '', platform: '', status: '' });

  const handleFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    let filtered = movies.filter(movie => {
      const genreMatch = !newFilters.genre || 
        (movie.genre && movie.genre.split(',').map(g => g.trim().toLowerCase()).includes(newFilters.genre.toLowerCase()));
      
      return genreMatch &&
        (!newFilters.platform || movie.platform === newFilters.platform) &&
        (!newFilters.status || movie.status === newFilters.status);
    });

    setFiltered(filtered);
  };

  const unique = (key) => {
    if (key === 'genre') {
      // Split comma-separated genres and get unique values (case-insensitive)
      const allGenres = movies
        .map(m => m.genre)
        .filter(Boolean)
        .flatMap(g => g.split(',').map(genre => genre.trim()));
      
      // Use a Map to store unique genres by lowercase key but preserve original casing
      const genreMap = new Map();
      allGenres.forEach(genre => {
        const lowerKey = genre.toLowerCase();
        if (!genreMap.has(lowerKey)) {
          // Capitalize first letter for consistency
          genreMap.set(lowerKey, genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase());
        }
      });
      
      return Array.from(genreMap.values()).sort();
    }
    return [...new Set(movies.map(m => m[key]).filter(Boolean))];
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {['genre', 'platform', 'status'].map(key => (
        <select
          key={key}
          onChange={e => handleFilter(key, e.target.value)}
          className="border border-slate-200 bg-white px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-[var(--color-secondary)] transition"
          aria-label={`Filter by ${key}`}
        >
          <option value="">{key.charAt(0).toUpperCase() + key.slice(1)}</option>
          {unique(key).map(val => <option key={val} value={val}>{val}</option>)}
        </select>
      ))}

      <button onClick={() => setFiltered(movies)} className="ml-2 text-sm px-3 py-2 rounded-md border bg-slate-50">Reset</button>
    </div>
  );
}