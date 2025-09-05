import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PainelMesas from "./pages/PainelMesas";
import { CssBaseline, Container } from "@mui/material";

function App() {
  return (
    <Router>
      <CssBaseline /> {/* Normaliza o CSS */}
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<PainelMesas />} />
          {/* Futuramente, outras rotas como /produtos, /estoque, etc. */}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
