import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

// O status pode ser 'LIVRE' ou 'OCUPADA'
const CardMesa = ({ numero, status, comanda }) => {
  const isOcupada = status === "OCUPADA";

  const cardStyle = {
    minWidth: 150,
    margin: 2,
    cursor: "pointer",
    border: "2px solid",
    borderColor: isOcupada ? "goldenrod" : "green",
    backgroundColor: isOcupada ? "#fffbe6" : "#f0fff0",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: 6,
    },
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Typography variant="h5" component="div" align="center">
          Mesa {numero}
        </Typography>
        <Typography color="text.secondary" align="center">
          {isOcupada ? "Ocupada" : "Livre"}
        </Typography>
        {isOcupada && comanda && (
          <Box mt={2} textAlign="center">
            <Typography variant="body2">Comanda: #{comanda.id}</Typography>
            <Typography variant="body2">
              Total: R$ {comanda.valorTotal.toFixed(2)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CardMesa;
