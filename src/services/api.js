import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/movies/";

export const getMovies = async () => {
  return await axios.get(API_URL);
};

export const getMovie = async (id) => {
  return await axios.get(`${API_URL}${id}/`);
};

export const addMovie = async (data) => {
  return await axios.post(`${API_URL}add/`, data);
};

export const updateMovie = async (id, data) => {
  return await axios.put(`${API_URL}${id}/update/`, data);
};

export const deleteMovie = async (id) => {
  return await axios.delete(`${API_URL}${id}/delete/`);
};
