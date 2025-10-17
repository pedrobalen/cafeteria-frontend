import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Paper, CircularProgress, List, ListItem, ListItemText,
    Button, Divider, IconButton, Alert, Dialog, DialogTitle, DialogContent,
    Checkbox, FormControlLabel, FormGroup, DialogActions, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getComandaPorId, getProdutos, adicionarItemComanda, registrarPagamento } from '../services/api.js';

const PaginaComanda = () => {
    const { comandaId } = useParams();
    const navigate = useNavigate();

    const [comanda, setComanda] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estados para o Modal de Pagamento
    const [pagamentoModalOpen, setPagamentoModalOpen] = useState(false);
    const [itensParaPagar, setItensParaPagar] = useState({}); // { itemId: boolean }
    const [formaPagamento, setFormaPagamento] = useState('PIX');

    const carregarDados = useCallback(async () => {
        try {
            setLoading(true);
            const [comandaData, produtosData] = await Promise.all([getComandaPorId(comandaId), getProdutos()]);
            setComanda(comandaData);
            setProdutos(produtosData);
            setError('');
        } catch (err) {
            setError('Falha ao carregar os dados da comanda.');
        } finally {
            setLoading(false);
        }
    }, [comandaId]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const handleAdicionarProduto = async (produtoId) => {
        try {
            await adicionarItemComanda(comandaId, { produtoId: produtoId, quantidade: 1 });
            carregarDados(); // Recarrega os dados para mostrar o novo item
        } catch (error) {
            alert("Falha ao adicionar produto.");
        }
    };

    const handleAbrirModalPagamento = () => {
        // Prepara o estado inicial do modal: nenhum item selecionado
        const initialSelection = comanda.itens.reduce((acc, item) => {
            acc[item.id] = false;
            return acc;
        }, {});
        setItensParaPagar(initialSelection);
        setPagamentoModalOpen(true);
    };

    const handleToggleItemPagamento = (itemId) => {
        setItensParaPagar(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    const handleRegistrarPagamento = async () => {
        const itemIdsSelecionados = Object.keys(itensParaPagar).filter(id => itensParaPagar[id]);
        
        if (itemIdsSelecionados.length === 0) {
            alert("Selecione pelo menos um item para pagar.");
            return;
        }

        const pagamentoData = {
            itemIds: itemIdsSelecionados.map(id => parseInt(id)),
            formaPagamento: formaPagamento
        };

        try {
            await registrarPagamento(comandaId, pagamentoData);
            setPagamentoModalOpen(false);
            carregarDados(); // Recarrega a comanda
            // Verifica se a comanda foi totalmente paga para decidir se volta ao painel
            const comandaAtualizada = await getComandaPorId(comandaId);
            if(comandaAtualizada.status === 'PAGA') {
                alert("Comanda paga com sucesso!");
                navigate('/painel-mesas');
            } else {
                alert("Pagamento parcial registrado com sucesso!");
            }
        } catch(error) {
            alert("Falha ao registrar pagamento.");
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!comanda) return <Alert severity="warning">Comanda não encontrada.</Alert>;

    const itensNaoPagos = comanda.itens.filter(item => !item.pagamento_id); // Assumindo que o backend não envia itens pagos

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/painel-mesas')} sx={{ mb: 2 }}>
                Voltar ao Painel de Mesas
            </Button>
            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 2, position: 'sticky', top: '20px' }}>
                        <Typography variant="h5">Comanda #{comanda.id}</Typography>
                        <Typography variant="h6" color="text.secondary">
                            Mesa: {comanda.numeroMesa || comanda.identificadorCliente}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <List sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                            {comanda.itens.length === 0 ? <ListItem><ListItemText primary="Nenhum item adicionado." /></ListItem> : 
                                comanda.itens.map(item => <ListItem key={item.id}><ListItemText primary={`${item.quantidade}x ${item.nomeProduto}`} secondary={`R$ ${item.subtotal.toFixed(2)}`} /></ListItem>)}
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h5" align="right">Total: R$ {comanda.valorTotal.toFixed(2)}</Typography>
                        <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }} disabled={comanda.itens.length === 0} onClick={handleAbrirModalPagamento}>
                            Pagar / Fechar Conta
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 2, maxHeight: '80vh', overflow: 'auto' }}>
                        <Typography variant="h5">Cardápio</Typography>
                        <List>
                            {produtos.map(produto => (
                                <ListItem key={produto.id} secondaryAction={<IconButton edge="end" color="primary" onClick={() => handleAdicionarProduto(produto.id)}><AddCircleIcon /></IconButton>}>
                                    <ListItemText primary={produto.nome} secondary={`R$ ${produto.precoVenda.toFixed(2)}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Modal de Pagamento */}
            <Dialog open={pagamentoModalOpen} onClose={() => setPagamentoModalOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Registrar Pagamento</DialogTitle>
                <DialogContent>
                    <Typography>Selecione os itens para pagar:</Typography>
                    <FormGroup>
                        {itensNaoPagos.map(item => (
                            <FormControlLabel key={item.id} control={<Checkbox checked={!!itensParaPagar[item.id]} onChange={() => handleToggleItemPagamento(item.id)} />} 
                            label={`${item.quantidade}x ${item.nomeProduto} (R$ ${item.subtotal.toFixed(2)})`} />
                        ))}
                    </FormGroup>
                    <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
                        <InputLabel>Forma de Pagamento</InputLabel>
                        <Select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                            <MenuItem value="PIX">PIX</MenuItem>
                            <MenuItem value="DINHEIRO">Dinheiro</MenuItem>
                            <MenuItem value="CARTAO_CREDITO">Cartão de Crédito</MenuItem>
                            <MenuItem value="CARTAO_DEBITO">Cartão de Débito</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPagamentoModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleRegistrarPagamento} variant="contained">Confirmar Pagamento</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaginaComanda;