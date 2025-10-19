import { Link } from "react-router-dom";


const statusClasses = {
watching: "bg-blue-500",
completed: "bg-green-500",
wishlist: "bg-gray-400",
dropped: "bg-red-500",
};


export default function MovieCard({ movie, onDelete }) {
return (
<article className="card flex flex-col md:flex-row gap-4 hover:shadow-[var(--shadow-hover)] transition-[var(--transition-card)]">
<div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
<img src={movie.image_url || "https://via.placeholder.com/300"} alt={movie.title} className="w-full h-full object-cover" />
</div>


<div className="flex-1 flex flex-col justify-between">
<div>
<h3 className="text-lg font-semibold text-slate-900">{movie.title}</h3>
<p className="text-sm text-slate-500 mt-1">{movie.director ? `Director: ${movie.director}` : "Director: N/A"}</p>


<div className="mt-3 flex flex-wrap gap-2 items-center">
<span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">{movie.genre || 'Genre N/A'}</span>
<span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">{movie.platform || 'Platform N/A'}</span>
<span className={`text-xs px-2 py-1 rounded-full text-white ${statusClasses[movie.status] || 'bg-gray-400'}`}>{movie.status}</span>
</div>


<div className="mt-3">
<div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
<div
className="h-2 rounded-full"
style={{ width: `${(movie.total_episodes ? (movie.watched_episodes / movie.total_episodes) * 100 : 0)}%`, background: 'linear-gradient(90deg,var(--color-secondary),var(--color-accent))' }}
/>
</div>
<p className="text-xs text-slate-500 mt-1">Episodes: {movie.watched_episodes}/{movie.total_episodes}</p>
</div>
</div>


<div className="mt-4 flex items-center gap-2">
<Link to={`/details/${movie.id}`} className="px-3 py-2 bg-white border rounded-md text-sm hover:shadow-sm">Details</Link>
<Link to={`/edit/${movie.id}`} className="px-3 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600">Edit</Link>
<button onClick={() => onDelete(movie.id)} className="px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">Delete</button>
</div>
</div>
</article>
);
}