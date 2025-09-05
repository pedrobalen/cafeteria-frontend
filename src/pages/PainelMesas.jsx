import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import CardMesa from "../components/CardMesa";
import { getComandasAbertas } from "../services/api";

// Vamos simular que a cafeteria tem 12 mesas
const TOTAL_MESAS = 12;

const PainelMesas = () => {
  const [comandasAbertas, setComandasAbertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComandas = async () => {
      setLoading(true);
      const data = await getComandasAbertas();
      setComandasAbertas(data);
      setLoading(false);
    };

    fetchComandas();
    // Opcional: atualizar a cada 30 segundos
    const intervalId = setInterval(fetchComandas, 30000);
    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar
  }, []);

  const renderMesas = () => {
    const mesas = [];
    for (let i = 1; i <= TOTAL_MESAS; i++) {
      const comandaDaMesa = comandasAbertas.find((c) => c.numeroMesa === i);
      mesas.push(
        <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
          <CardMesa
            numero={i}
            status={comandaDaMesa ? "OCUPADA" : "LIVRE"}
            comanda={comandaDaMesa}
          />
        </Grid>
      );
    }
    return mesas;
  };

  if (loading) {
    return <Typography>Carregando painel...</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Painel de Mesas
      </Typography>
      <Grid container spacing={2}>
        {renderMesas()}
      </Grid>
    </Box>
  );
};

export default PainelMesas;
