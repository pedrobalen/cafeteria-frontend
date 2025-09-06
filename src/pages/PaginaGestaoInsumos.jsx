import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, CircularProgress, Alert
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getInsumos, createInsumo } from '../services/api.js';

const PaginaGestaoInsumos = () => {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estados para o Modal de Criação
    const [modalOpen, setModalOpen] = useState(false);
    const [novoInsumo, setNovoInsumo] = useState({
        nome: '',
        quantidadeInicial: 0,
        unidadeMedida: '',
        estoqueMinimo: 0
    });

    const carregarInsumos = async () => {
        try {
            setLoading(true);
            const data = await getInsumos();
            setInsumos(data);
            setError('');
        } catch (err) {
            setError('Falha ao carregar os insumos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarInsumos();
    }, []);

    const handleAbrirModal = () => setModalOpen(true);
    const handleFecharModal = () => setModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoInsumo(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCriarInsumo = async () => {
        if (!novoInsumo.nome || !novoInsumo.unidadeMedida) {
            alert('Nome e Unidade de Medida são obrigatórios.');
            return;
        }
        try {
            await createInsumo(novoInsumo);
            handleFecharModal();
            carregarInsumos(); // Recarrega a lista para mostrar o novo item
        } catch (err) {
            alert('Falha ao criar o insumo.');
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Gestão de Insumos</Typography>
                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleAbrirModal}>
                    Novo Insumo
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome do Insumo</TableCell>
                            <TableCell align="right">Qtd. em Estoque</TableCell>
                            <TableCell>Unidade</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {insumos.map((insumo) => (
                            <TableRow key={insumo.id}>
                                <TableCell>{insumo.id}</TableCell>
                                <TableCell>{insumo.nome}</TableCell>
                                <TableCell align="right">{insumo.quantidadeEstoque.toFixed(3)}</TableCell>
                                <TableCell>{insumo.unidadeMedida}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal para Criar Novo Insumo */}
            <Dialog open={modalOpen} onClose={handleFecharModal}>
                <DialogTitle>Cadastrar Novo Insumo</DialogTitle>
                <DialogContent>
                    <TextField autoFocus name="nome" label="Nome do Insumo" type="text" fullWidth variant="standard" margin="dense" onChange={handleInputChange} />
                    <TextField name="quantidadeInicial" label="Quantidade Inicial" type="number" fullWidth variant="standard" margin="dense" onChange={handleInputChange} />
                    <TextField name="unidadeMedida" label="Unidade de Medida (kg, litro, unidade)" type="text" fullWidth variant="standard" margin="dense" onChange={handleInputChange} />
                    <TextField name="estoqueMinimo" label="Estoque Mínimo (Opcional)" type="number" fullWidth variant="standard" margin="dense" onChange={handleInputChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFecharModal}>Cancelar</Button>
                    <Button onClick={handleCriarInsumo} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaginaGestaoInsumos;