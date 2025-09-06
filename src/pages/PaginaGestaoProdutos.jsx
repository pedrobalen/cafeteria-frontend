import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, CircularProgress, Alert, Autocomplete, Checkbox, FormControlLabel
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getProdutos, createProduto, getCategorias } from '../services/api.js';

const PaginaGestaoProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [modalOpen, setModalOpen] = useState(false);
    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        precoVenda: '',
        descricao: '',
        ativo: true,
        categoriaId: null
    });
    const [selectedCategoria, setSelectedCategoria] = useState(null);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const [produtosData, categoriasData] = await Promise.all([getProdutos(), getCategorias()]);
            setProdutos(produtosData);
            setCategorias(categoriasData);
            setError('');
        } catch (err) {
            setError('Falha ao carregar os dados.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const handleAbrirModal = () => {
        // Reseta o formulário
        setNovoProduto({ nome: '', precoVenda: '', descricao: '', ativo: true, categoriaId: null });
        setSelectedCategoria(null);
        setModalOpen(true);
    };
    const handleFecharModal = () => setModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNovoProduto(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleCategoriaChange = (event, value) => {
        setSelectedCategoria(value);
        setNovoProduto(prevState => ({ ...prevState, categoriaId: value ? value.id : null }));
    };

    const handleCriarProduto = async () => {
        if (!novoProduto.nome || !novoProduto.precoVenda) {
            alert('Nome e Preço são obrigatórios.');
            return;
        }
        try {
            await createProduto(novoProduto);
            handleFecharModal();
            carregarDados();
        } catch (err) {
            alert('Falha ao criar o produto.');
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Gestão de Produtos</Typography>
                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleAbrirModal}>
                    Novo Produto
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome do Produto</TableCell>
                            <TableCell>Categoria</TableCell>
                            <TableCell align="right">Preço (R$)</TableCell>
                            <TableCell>Ativo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {produtos.map((produto) => (
                            <TableRow key={produto.id}>
                                <TableCell>{produto.id}</TableCell>
                                <TableCell>{produto.nome}</TableCell>
                                <TableCell>{produto.nomeCategoria || 'N/A'}</TableCell>
                                <TableCell align="right">{produto.precoVenda.toFixed(2)}</TableCell>
                                <TableCell>{produto.ativo ? 'Sim' : 'Não'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal para Criar Novo Produto */}
            <Dialog open={modalOpen} onClose={handleFecharModal}>
                <DialogTitle>Cadastrar Novo Produto</DialogTitle>
                <DialogContent>
                    <TextField autoFocus name="nome" label="Nome do Produto" fullWidth variant="standard" margin="dense" onChange={handleInputChange} />
                    <TextField name="precoVenda" label="Preço de Venda (R$)" type="number" fullWidth variant="standard" margin="dense" onChange={handleInputChange} />
                    <Autocomplete
                        options={categorias}
                        getOptionLabel={(option) => option.nome}
                        value={selectedCategoria}
                        onChange={handleCategoriaChange}
                        renderInput={(params) => <TextField {...params} label="Categoria" variant="standard" margin="dense" />}
                    />
                    <TextField name="descricao" label="Descrição (Opcional)" fullWidth variant="standard" margin="dense" onChange={handleInputChange} />
                    <FormControlLabel
                        control={<Checkbox checked={novoProduto.ativo} onChange={handleInputChange} name="ativo" />}
                        label="Ativo"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFecharModal}>Cancelar</Button>
                    <Button onClick={handleCriarProduto} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaginaGestaoProdutos;