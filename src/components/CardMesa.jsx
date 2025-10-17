import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { abrirComanda } from '../services/api'; // Certifique-se que esta função existe no seu api.js

const CardMesa = ({ mesa, status, comanda, onComandaAberta }) => {
    const navigate = useNavigate();
    const isOcupada = status === 'OCUPADA';

    const cardStyle = {
        border: '2px solid',
        borderColor: isOcupada ? 'goldenrod' : 'green',
        backgroundColor: isOcupada ? '#fffbe6' : '#f0fff0',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
        },
    };

    const handleClick = async () => {
        if (isOcupada) {
            // Se a mesa está ocupada, navega para a comanda existente
            navigate(`/comanda/${comanda.id}`);
        } else {
            // Se a mesa está livre, abre uma nova comanda
            if (window.confirm(`Abrir nova comanda para a Mesa ${mesa.numero}?`)) {
                try {
                    const novaComanda = await abrirComanda({ mesaId: mesa.id });
                    if (novaComanda) {
                        onComandaAberta(); // Avisa o painel para se atualizar
                        navigate(`/comanda/${novaComanda.id}`); // Navega para a nova comanda
                    }
                } catch (error) {
                    alert("Falha ao abrir nova comanda. Tente novamente.");
                }
            }
        }
    };

    return (
        <Card sx={cardStyle}>
            <CardActionArea onClick={handleClick}>
                <CardContent>
                    <Typography variant="h5" component="div" align="center" fontWeight="bold">
                        Mesa {mesa.numero}
                    </Typography>
                    <Typography color="text.secondary" align="center">
                        {isOcupada ? 'Ocupada' : 'Livre'}
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
            </CardActionArea>
        </Card>
    );
};

export default CardMesa;