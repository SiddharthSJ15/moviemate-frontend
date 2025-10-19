import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovie, updateMovie } from "../services/api";


export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    getMovie(id).then(res => setForm(res.data));
  }, [id]);

  if (!form) return <p>Loading...</p>;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMovie(id, form).then(() => navigate("/"));
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Movie</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {["title","director","genre","platform","image_url","review"].map(field => (
          <input key={field} type="text" name={field} placeholder={field} value={form[field]} onChange={handleChange} className="border p-2 rounded" />
        ))}
        <div className="flex gap-2">
          <input type="number" name="total_episodes" placeholder="Total Episodes" value={form.total_episodes} onChange={handleChange} className="border p-2 rounded w-1/2" />
          <input type="number" name="watched_episodes" placeholder="Watched Episodes" value={form.watched_episodes} onChange={handleChange} className="border p-2 rounded w-1/2" />
        </div>
        <input type="number" step="0.1" name="rating" placeholder="Rating" value={form.rating} onChange={handleChange} className="border p-2 rounded" />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
          <option value="watching">Watching</option>
          <option value="completed">Completed</option>
          <option value="wishlist">Wishlist</option>
          <option value="dropped">Dropped</option>
        </select>
        <button type="submit" className="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700">Update Movie</button>
      </form>
    </div>
  );
}
