import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, TextField, CircularProgress, Alert, Autocomplete, IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProdutos, getInsumos, getFichaTecnica, adicionarInsumoFichaTecnica, removerInsumoFichaTecnica } from '../services/api.js';

const PaginaGestaoFichaTecnica = () => {
    const [produtos, setProdutos] = useState([]);
    const [insumos, setInsumos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [fichaTecnica, setFichaTecnica] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State para o formulário de adição
    const [insumoParaAdicionar, setInsumoParaAdicionar] = useState(null);
    const [quantidade, setQuantidade] = useState('');

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            try {
                const [produtosData, insumosData] = await Promise.all([getProdutos(), getInsumos()]);
                setProdutos(produtosData);
                setInsumos(insumosData);
            } catch (error) {
                console.error("Falha ao carregar dados iniciais", error);
            } finally {
                setLoading(false);
            }
        };
        carregarDadosIniciais();
    }, []);

    const handleProdutoChange = async (event, produto) => {
        setProdutoSelecionado(produto);
        if (produto) {
            const fichaData = await getFichaTecnica(produto.id);
            setFichaTecnica(fichaData);
        } else {
            setFichaTecnica([]);
        }
    };
    
    const handleAdicionarItem = async () => {
        if (!produtoSelecionado || !insumoParaAdicionar || !quantidade) {
            alert("Selecione um produto, um insumo e uma quantidade.");
            return;
        }
        const itemData = { insumoId: insumoParaAdicionar.id, quantidade: parseFloat(quantidade) };
        await adicionarInsumoFichaTecnica(produtoSelecionado.id, itemData);
        // Recarrega a ficha técnica para mostrar o novo item
        handleProdutoChange(null, produtoSelecionado);
        setInsumoParaAdicionar(null);
        setQuantidade('');
    };
    
    const handleRemoverItem = async (fichaTecnicaId) => {
        await removerInsumoFichaTecnica(produtoSelecionado.id, fichaTecnicaId);
        handleProdutoChange(null, produtoSelecionado);
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Gestão de Ficha Técnica (Receitas)</Typography>
            <Autocomplete
                options={produtos}
                getOptionLabel={(option) => option.nome}
                value={produtoSelecionado}
                onChange={handleProdutoChange}
                renderInput={(params) => <TextField {...params} label="Selecione um Produto para ver/editar a receita" margin="normal" />}
            />

            {produtoSelecionado && (
                <Paper sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ p: 2 }}>Receita de: {produtoSelecionado.nome}</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Insumo (Ingrediente)</TableCell>
                                    <TableCell align="right">Quantidade</TableCell>
                                    <TableCell>Unidade</TableCell>
                                    <TableCell align="center">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fichaTecnica.map((item) => (
                                    <TableRow key={item.fichaTecnicaId}>
                                        <TableCell>{item.nomeInsumo}</TableCell>
                                        <TableCell align="right">{item.quantidade.toFixed(3)}</TableCell>
                                        <TableCell>{item.unidadeMedida}</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="error" onClick={() => handleRemoverItem(item.fichaTecnicaId)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* Linha para adicionar novo item */}
                                <TableRow>
                                    <TableCell>
                                        <Autocomplete
                                            size="small"
                                            options={insumos}
                                            getOptionLabel={(option) => option.nome}
                                            value={insumoParaAdicionar}
                                            onChange={(e, value) => setInsumoParaAdicionar(value)}
                                            renderInput={(params) => <TextField {...params} label="Adicionar Insumo" variant="standard" />}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <TextField
                                            size="small"
                                            type="number"
                                            label="Qtd."
                                            variant="standard"
                                            value={quantidade}
                                            onChange={(e) => setQuantidade(e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {insumoParaAdicionar?.unidadeMedida || ''}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<AddCircleOutlineIcon />}
                                            onClick={handleAdicionarItem}
                                        >
                                            Adicionar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
};

export default PaginaGestaoFichaTecnica;