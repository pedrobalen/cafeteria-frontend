import axios from 'axios';

// Cria uma instância do Axios com a URL base do nosso backend
const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Função de tratamento de erros genérica para evitar repetição
const handleError = (error, message) => {
    console.error(message, error);
    // Em uma aplicação real, poderíamos enviar isso para um serviço de log
    throw error; // Lança o erro para que o componente React possa tratá-lo (ex: exibir um alerta)
};


// --- Funções para MESAS ---
export const getMesasAtivas = async () => {
    try {
        const response = await api.get('/mesas?ativo=true');
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao buscar mesas ativas:");
    }
};

export const createMesa = async (mesaData) => {
    try {
        const response = await api.post('/mesas', mesaData);
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao criar mesa:");
    }
};


// --- Funções para COMANDAS ---
export const getComandasAbertas = async () => {
    try {
        const response = await api.get('/comandas?status=ABERTA');
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao buscar comandas abertas:");
    }
};

export const abrirComanda = async (comandaData) => {
    try {
        const response = await api.post('/comandas/abrir', comandaData);
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao abrir comanda:");
    }
};

export const adicionarItemComanda = async (comandaId, itemData) => {
    try {
        const response = await api.post(`/comandas/${comandaId}/itens`, itemData);
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao adicionar item à comanda:");
    }
};

export const registrarPagamento = async (comandaId, pagamentoData) => {
    try {
        const response = await api.post(`/comandas/${comandaId}/pagar`, pagamentoData);
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao registrar pagamento:");
    }
};


// --- Funções para PRODUTOS & CATEGORIAS ---
export const getProdutos = async () => {
    try {
        const response = await api.get('/produtos');
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao buscar produtos:");
    }
};

export const createProduto = async (produtoData) => {
    try {
        const response = await api.post('/produtos', produtoData);
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao criar produto:");
    }
};

export const getCategorias = async () => {
    try {
        const response = await api.get('/categorias');
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao buscar categorias:");
    }
};


// --- Funções para INSUMOS (Estoque de Ingredientes) ---
export const getInsumos = async () => {
    try {
        const response = await api.get('/insumos');
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao buscar insumos:");
    }
};

export const createInsumo = async (insumoData) => {
    try {
        const response = await api.post('/insumos', insumoData);
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao criar insumo:");
    }
};

export const registrarEntradaInsumo = async (insumoId, entradaData) => {
    try {
        const response = await api.post(`/insumos/${insumoId}/entrada`, entradaData);
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao registrar entrada de insumo:");
    }
};


// --- Funções para FICHA TÉCNICA (Receitas) ---
export const getFichaTecnica = async (produtoId) => {
    try {
        const response = await api.get(`/produtos/${produtoId}/ficha-tecnica`);
        return response.data;
    } catch (error) {
        handleError(error, `Erro ao buscar ficha técnica do produto ${produtoId}:`);
    }
};

export const adicionarInsumoFichaTecnica = async (produtoId, itemData) => {
    try {
        const response = await api.post(`/produtos/${produtoId}/ficha-tecnica`, itemData);
        return response.data;
    } catch (error) {
        handleError(error, `Erro ao adicionar insumo à ficha técnica do produto ${produtoId}:`);
    }
};

export const removerInsumoFichaTecnica = async (produtoId, fichaTecnicaId) => {
    try {
        const response = await api.delete(`/produtos/${produtoId}/ficha-tecnica/itens/${fichaTecnicaId}`);
        return response.data;
    } catch (error) {
        handleError(error, `Erro ao remover insumo da ficha técnica:`);
    }
};


// --- Funções para GASTOS ---
export const getGastos = async () => {
    try {
        const response = await api.get('/gastos');
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao buscar gastos:");
    }
};

export const createGasto = async (gastoData) => {
    try {
        const response = await api.post('/gastos', gastoData);
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao criar gasto:");
    }
};


// --- Funções para RELATÓRIOS ---
export const getVendasDoDia = async () => {
    try {
        const response = await api.get('/relatorios/vendas-do-dia');
        return response.data;
    } catch (error) {
        handleError(error, "Erro ao buscar relatório de vendas do dia:");
    }
};



export default api;