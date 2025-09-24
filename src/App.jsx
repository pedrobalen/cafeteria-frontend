import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';

import MenuPrincipal from './pages/MenuPrincipal.jsx';
import PainelMesas from './pages/PainelMesas.jsx';
import PaginaGestaoMesas from './pages/PaginaGestaoMesas.jsx';
import PaginaGestaoProdutos from './pages/PaginaGestaoProdutos.jsx';
import PaginaGestaoInsumos from './pages/PaginaGestaoInsumos.jsx';
import PaginaGestaoFichaTecnica from './pages/PaginaGestaoFichaTecnica.jsx';
import PaginaComanda from "./pages/PaginaComanda.jsx";

function App() {
    return (
        <Router>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Routes>
                    <Route path="/" element={<MenuPrincipal />} />
                    <Route path="/painel-mesas" element={<PainelMesas />} />
                    <Route path="/gerir/mesas" element={<PaginaGestaoMesas />} />
                    <Route path="/gerir/produtos" element={<PaginaGestaoProdutos />} />
                    <Route path="/gerir/estoque" element={<PaginaGestaoInsumos />} />
                    <Route path="/gerir/ficha-tecnica" element={<PaginaGestaoFichaTecnica />} />
                    <Route path="/painel-mesas" element={<PainelMesas />} />
                    <Route path="/comanda/:comandaId" element={<PaginaComanda />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;