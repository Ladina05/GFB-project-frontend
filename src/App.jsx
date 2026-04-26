import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Calculateur from './pages/Calculateur';
import Historique from './pages/Historique';
import Articles from './pages/Articles';
import Detail from './pages/Detail';
import Irregulier from './pages/Irregulier'; // NOUVEAU
import DetailIrregulier from './pages/DetailIrregulier';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculateur" element={<Calculateur />} />
        <Route path="/irregulier" element={<Irregulier />} />
        <Route path="/historique" element={<Historique />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/detail-irregulier/:id" element={<DetailIrregulier />} />
      </Routes>
    </BrowserRouter>
  );
}