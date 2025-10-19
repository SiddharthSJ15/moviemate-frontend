import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getMovies = async () => {
  return await axios.get(API_URL);
};

export const getMovie = async (id) => {
  return await axios.get(`${API_URL}/api/movies/${id}/`);
};

export const addMovie = async (data) => {
  return await axios.post(`${API_URL}/api/movies/add/`, data);
};

export const updateMovie = async (id, data) => {
  return await axios.put(`${API_URL}${id}/api/movies/update/`, data);
};

export const deleteMovie = async (id) => {
  return await axios.delete(`${API_URL}${id}/api/movies/delete/`);
};
