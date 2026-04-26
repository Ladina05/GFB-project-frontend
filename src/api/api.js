import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Articles
export const getArticles = () => API.get('/articles');
export const createArticle = (data) => API.post('/articles', data);
export const deleteArticle = (id) => API.delete(`/articles/${id}`);

// Wilson régulier
export const calculerRapide = (data) => API.post('/wilson/calculer-rapide', data);
export const calculerEtSauvegarder = (data) => API.post('/wilson/calculer', data);
export const getHistorique = () => API.get('/wilson/historique');
export const getCalculDetail = (id) => API.get(`/wilson/${id}`);
export const deleteCalcul = (id) => API.delete(`/wilson/${id}`);

// Consommation irrégulière — NOUVEAU
export const simulerQtesConstantes = (data) =>
  API.post('/irregulier/quantites-constantes', data);
export const simulerPeriodesConstantes = (data) =>
  API.post('/irregulier/periodes-constantes', data);
export const comparerMethodesIrregulier = (data) =>
  API.post('/irregulier/comparer', data);
export const getHistoriqueIrregulier = () =>
  API.get('/irregulier/historique');
export const getIrregulierDetail = (id) =>
  API.get(`/irregulier/${id}`);
export const deleteIrregulier = (id) =>
  API.delete(`/irregulier/${id}`);