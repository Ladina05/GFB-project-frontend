import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Articles
export const getArticles = () => API.get('/articles');
export const createArticle = (data) => API.post('/articles', data);
export const deleteArticle = (id) => API.delete(`/articles/${id}`);

// Wilson
export const calculerRapide = (data) => API.post('/wilson/calculer-rapide', data);
export const calculerEtSauvegarder = (data) => API.post('/wilson/calculer', data);
export const getHistorique = () => API.get('/wilson/historique');
export const getCalculDetail = (id) => API.get(`/wilson/${id}`);
export const deleteCalcul = (id) => API.delete(`/wilson/${id}`);