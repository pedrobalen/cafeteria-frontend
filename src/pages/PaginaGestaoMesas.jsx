import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, CircularProgress, Alert, IconButton, Switch
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTodasMesas, createMesa, updateMesa, deleteMesa, setMesaAtiva } from '../services/api.js';

const PaginaGestaoMesas = () => {
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [mesaAtual, setMesaAtual] = useState({ numero: '', nome: '', capacidade: '' });
    
    const carregarMesas = async () => {
        try {
            setLoading(true);
            const data = await getTodasMesas();
            setMesas(data.sort((a, b) => a.numero - b.numero));
            setError('');
        } catch (err) {
            setError('Falha ao carregar as mesas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarMesas();
    }, []);

    const handleAbrirModal = (mesa = null) => {
        if (mesa) {
            setIsEditing(true);
            setMesaAtual(mesa);
        } else {
            setIsEditing(false);
            setMesaAtual({ numero: '', nome: '', capacidade: '' });
        }
        setModalOpen(true);
    };

    const handleFecharModal = () => setModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMesaAtual(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSalvarMesa = async () => {
        if (!mesaAtual.numero || !mesaAtual.capacidade) {
            alert('Número e Capacidade são obrigatórios.');
            return;
        }
        const mesaData = {
            numero: parseInt(mesaAtual.numero),
            nome: mesaAtual.nome,
            capacidade: parseInt(mesaAtual.capacidade)
        };

        try {
            if (isEditing) {
                await updateMesa(mesaAtual.id, mesaData);
            } else {
                await createMesa(mesaData);
            }
            handleFecharModal();
            carregarMesas();
        } catch (err) {
            alert('Falha ao salvar a mesa. Verifique se o número da mesa já existe.');
        }
    };
    
    const handleDeletarMesa = async (id) => {
        if (window.confirm("Tem certeza que deseja apagar esta mesa? A ação não pode ser desfeita.")) {
            try {
                await deleteMesa(id);
                carregarMesas();
            } catch (err) {
                alert("Falha ao apagar a mesa. Verifique se ela não possui comandas associadas.");
            }
        }
    };
    
    const handleToggleAtivo = async (id, ativo) => {
        try {
            await setMesaAtiva(id, !ativo);
            carregarMesas();
        } catch (err) {
            alert("Falha ao alterar o status da mesa.");
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Gestão de Mesas</Typography>
                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => handleAbrirModal()}>
                    Nova Mesa
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Número</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell align="right">Capacidade</TableCell>
                            <TableCell align="center">Ativa</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mesas.map((mesa) => (
                            <TableRow key={mesa.id}>
                                <TableCell sx={{ fontWeight: 'bold' }}>{mesa.numero}</TableCell>
                                <TableCell>{mesa.nome}</TableCell>
                                <TableCell align="right">{mesa.capacidade}</TableCell>
                                <TableCell align="center">
                                    <Switch checked={mesa.ativo} onChange={() => handleToggleAtivo(mesa.id, mesa.ativo)} />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => handleAbrirModal(mesa)}><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleDeletarMesa(mesa.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={modalOpen} onClose={handleFecharModal}>
                <DialogTitle>{isEditing ? 'Editar Mesa' : 'Criar Nova Mesa'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus name="numero" label="Número da Mesa" type="number" fullWidth variant="standard" margin="dense" value={mesaAtual.numero} onChange={handleInputChange} />
                    <TextField name="nome" label="Nome (Ex: Janela, Sofá)" type="text" fullWidth variant="standard" margin="dense" value={mesaAtual.nome} onChange={handleInputChange} />
                    <TextField name="capacidade" label="Capacidade (Nº de pessoas)" type="number" fullWidth variant="standard" margin="dense" value={mesaAtual.capacidade} onChange={handleInputChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFecharModal}>Cancelar</Button>
                    <Button onClick={handleSalvarMesa} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaginaGestaoMesas;