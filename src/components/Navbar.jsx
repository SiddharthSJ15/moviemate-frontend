import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-primary text-white p-4 shadow-md flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
      <h1 className="text-2xl font-bold tracking-wide">MovieMate</h1>
      <div className="flex gap-4">
        <Link to="/" className="hover:text-accent transition-colors">Home</Link>
        <Link to="/add" className="hover:text-accent transition-colors">Add Movie</Link>
      </div>
    </nav>
  );
}
