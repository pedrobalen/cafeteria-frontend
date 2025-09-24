import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Paper, CircularProgress, List, ListItem, ListItemText,
    Button, Divider, IconButton
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getComandaPorId, getProdutos, adicionarItemComanda } from '../services/api.js';

const PaginaComanda = () => {
    const { comandaId } = useParams();
    const navigate = useNavigate();

    const [comanda, setComanda] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const [comandaData, produtosData] = await Promise.all([
                getComandaPorId(comandaId),
                getProdutos()
            ]);
            setComanda(comandaData);
            setProdutos(produtosData);
        } catch (error) {
            console.error("Erro ao carregar dados da comanda", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, [comandaId]);

    const handleAdicionarProduto = async (produtoId) => {
        try {
            await adicionarItemComanda(comandaId, { produtoId: produtoId, quantidade: 1 });
            carregarDados(); // Recarrega os dados da comanda para mostrar o novo item
        } catch (error) {
            alert("Falha ao adicionar produto à comanda.");
        }
    };

    if (loading) return <CircularProgress />;
    if (!comanda) return <Typography>Comanda não encontrada.</Typography>;

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/painel-mesas')} sx={{ mb: 2 }}>
                Voltar ao Painel
            </Button>
            <Grid container spacing={2}>
                {/* Coluna da Comanda */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 2, position: 'sticky', top: '20px' }}>
                        <Typography variant="h5">Comanda #{comanda.id}</Typography>
                        <Typography variant="h6" color="text.secondary">
                            Mesa: {comanda.numeroMesa || comanda.identificadorCliente}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <List sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                            {comanda.itens.map(item => (
                                <ListItem key={item.id}>
                                    <ListItemText primary={`${item.quantidade}x ${item.nomeProduto}`} secondary={`R$ ${item.subtotal.toFixed(2)}`} />
                                </ListItem>
                            ))}
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h5" align="right">Total: R$ {comanda.valorTotal.toFixed(2)}</Typography>
                        <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
                            Pagar / Fechar Conta
                        </Button>
                    </Paper>
                </Grid>

                {/* Coluna de Produtos */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 2, maxHeight: '80vh', overflow: 'auto' }}>
                        <Typography variant="h5">Cardápio</Typography>
                        <List>
                            {produtos.map(produto => (
                                <ListItem key={produto.id} secondaryAction={
                                    <IconButton edge="end" color="primary" onClick={() => handleAdicionarProduto(produto.id)}>
                                        <AddCircleIcon />
                                    </IconButton>
                                }>
                                    <ListItemText primary={produto.nome} secondary={`R$ ${produto.precoVenda.toFixed(2)}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PaginaComanda;