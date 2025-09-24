import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import MenuCard from '../components/MenuCard.jsx';
import KitchenIcon from '@mui/icons-material/Kitchen'; 
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaidIcon from '@mui/icons-material/Paid';


const MenuPrincipal = () => {
    const menuItems = [
        {
            title: "Painel de Mesas",
            description: "Visualizar status das mesas e gerenciar pedidos em andamento.",
            linkTo: "/painel-mesas",
            icon: <TableRestaurantIcon fontSize="inherit" />
        },
        {
            title: "Gestão de Mesas",
            description: "Adicionar, editar e ativar ou desativar mesas da cafeteria.",
            linkTo: "/gerir/mesas",
            icon: <ReceiptLongIcon fontSize="inherit" />
        },
        {
            title: "Gestão de Produtos",
            description: "Gerenciar o cardápio, incluindo categorias, produtos e preços.",
            linkTo: "/gerir/produtos",
            icon: <FastfoodIcon fontSize="inherit" />
        },
        {
            title: "Gestão de Insumo",
            description: "Controlar entradas e saídas de insumo do inventário.",
            linkTo: "/gerir/estoque",
            icon: <InventoryIcon fontSize="inherit" />
        },
        {
            title: "Relatórios",
            description: "Visualizar relatórios de vendas, ganhos e gastos.",
            linkTo: "/relatorios",
            icon: <AssessmentIcon fontSize="inherit" />
        },
        {
            title: "Registrar Gasto",
            description: "Adicionar novas despesas operacionais, como contas e fornecedores.",
            linkTo: "/gastos/novo",
            icon: <PaidIcon fontSize="inherit" />
        },
                {
            title: "Ficha Técnica",
            description: "Montar as receitas dos produtos com os insumos do estoque.",
            linkTo: "/gerir/ficha-tecnica",
            icon: <KitchenIcon fontSize="inherit" />
        },
    ];

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                Gestão da Cafeteria
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {menuItems.map((item) => (
                    <MenuCard
                        key={item.title}
                        title={item.title}
                        description={item.description}
                        linkTo={item.linkTo}
                        icon={item.icon}
                    />
                ))}
            </Grid>
        </Box>
    );
};

export default MenuPrincipal;
