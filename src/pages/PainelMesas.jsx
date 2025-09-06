import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import CardMesa from '../components/CardMesa.jsx';
// Importamos as duas funções do nosso serviço de API
import { getMesasAtivas, getComandasAbertas } from '../services/api.js';

const PainelMesas = () => {
    const [mesas, setMesas] = useState([]);
    const [comandasAbertas, setComandasAbertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Busca os dados das mesas e das comandas em paralelo para mais performance
                const [mesasData, comandasData] = await Promise.all([
                    getMesasAtivas(),
                    getComandasAbertas()
                ]);
                setMesas(mesasData);
                setComandasAbertas(comandasData);
                setError(null); // Limpa erros anteriores se a busca for bem-sucedida
            } catch (err) {
                setError('Falha ao carregar dados do servidor. O backend está rodando e acessível?');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Se estiver carregando, exibe uma animação
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Se houver um erro, exibe uma mensagem de alerta
    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Painel de Mesas
            </Typography>
            {/* Se não houver mesas cadastradas, mostra um aviso */}
            {mesas.length === 0 ? (
                <Alert severity="info">Nenhuma mesa ativa cadastrada no sistema.</Alert>
            ) : (
                <Grid container spacing={2}>
                    {/* Para cada mesa ativa, renderiza um card */}
                    {mesas.map((mesa) => {
                        // Encontra a comanda aberta correspondente a esta mesa (pelo número da mesa)
                        const comandaDaMesa = comandasAbertas.find(c => c.numeroMesa === mesa.numero);
                        return (
                            <Grid item key={mesa.id} xs={12} sm={6} md={4} lg={3}>
                                <CardMesa
                                    mesa={mesa}
                                    status={comandaDaMesa ? 'OCUPADA' : 'LIVRE'}
                                    comanda={comandaDaMesa}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};

export default PainelMesas;