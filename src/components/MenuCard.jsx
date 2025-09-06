import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MenuCard = ({ title, description, linkTo, icon }) => {
    const navigate = useNavigate();

    const cardStyle = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        border: '1px solid #ddd',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
        },
    };

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyle} onClick={() => navigate(linkTo)}>
                <CardActionArea>
                    <CardContent>
                        <Box sx={{ fontSize: 50, color: 'primary.main' }}>
                            {icon}
                        </Box>
                        <Typography gutterBottom variant="h5" component="div">
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
};

export default MenuCard;