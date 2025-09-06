import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';

import MenuPrincipal from './pages/MenuPrincipal.jsx';
import PainelMesas from './pages/PainelMesas.jsx';
import PaginaGestaoMesas from './pages/PaginaGestaoMesas.jsx';
import PaginaGestaoProdutos from './pages/PaginaGestaoProdutos.jsx';
import PaginaGestaoInsumos from './pages/PaginaGestaoInsumos.jsx'; // Importe a nova página
import PaginaGestaoFichaTecnica from './pages/PaginaGestaoFichaTecnica.jsx';

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
                    {/* A nova rota que corresponde ao link "Gestão de Estoque" no menu */}
                    <Route path="/gerir/estoque" element={<PaginaGestaoInsumos />} />
                    <Route path="/gerir/ficha-tecnica" element={<PaginaGestaoFichaTecnica />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;