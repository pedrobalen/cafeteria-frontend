import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// --- Funções para Mesas ---
// NOVA FUNÇÃO: Busca as mesas que estão marcadas como ativas
export const getMesasAtivas = async () => {
    try {
        // Nosso controller de mesa agora suporta este filtro
        const response = await api.get('/mesas?ativo=true');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar mesas ativas:", error);
        return []; // Retorna array vazio em caso de erro
    }
};

// --- Funções para Comandas ---
// ATUALIZADA: A resposta desta função agora contém o número da mesa
export const getComandasAbertas = async () => {
    try {
        const response = await api.get('/comandas?status=ABERTA');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar comandas abertas:", error);
        return [];
    }
};

// ... outras funções futuras
export default api;