import axios from "axios";

// Cria uma instância do Axios com a URL base do nosso backend
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Função para buscar todas as comandas abertas
export const getComandasAbertas = async () => {
  try {
    const response = await api.get("/comandas?status=ABERTA");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar comandas abertas:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};

// Futuramente adicionaremos outras funções aqui (getProdutos, criarComanda, etc.)

export default api;
