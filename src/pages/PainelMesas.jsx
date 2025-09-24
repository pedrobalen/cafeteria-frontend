import React, { useState, useEffect, useCallback } from 'react'; // Adicione useCallback
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import CardMesa from '../components/CardMesa.jsx';
import { getMesasAtivas, getComandasAbertas } from '../services/api.js';

const PainelMesas = () => {
    const [mesas, setMesas] = useState([]);
    const [comandasAbertas, setComandasAbertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [mesasData, comandasData] = await Promise.all([
                getMesasAtivas(),
                getComandasAbertas()
            ]);
            setMesas(mesasData);
            setComandasAbertas(comandasData);
            setError(null);
        } catch (err) {
            setError('Falha ao carregar dados do servidor. O backend está rodando e acessível?');
        } finally {
            setLoading(false);
        }
    }, []); // O array vazio [] significa que esta função nunca mudará

    // O useEffect agora apenas chama a função que já existe
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Painel de Mesas
            </Typography>
            {mesas.length === 0 ? (
                <Alert severity="info">Nenhuma mesa ativa cadastrada no sistema.</Alert>
            ) : (
                <Grid container spacing={2}>
                    {mesas.map((mesa) => {
                        const comandaDaMesa = comandasAbertas.find(c => c.numeroMesa === mesa.numero);
                        return (
                            <Grid item key={mesa.id} xs={12} sm={6} md={4} lg={3}>
                                <CardMesa
                                    mesa={mesa}
                                    status={comandaDaMesa ? 'OCUPADA' : 'LIVRE'}
                                    comanda={comandaDaMesa}
                                    onComandaAberta={fetchData} // Agora a função está acessível aqui
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