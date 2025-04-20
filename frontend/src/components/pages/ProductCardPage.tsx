import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import Loader from "../ui/Loader";
import ImageGallery from "../ui/ImageGallery";
import ProductTimeline, { TimelineItemType } from "../ui/ProductTimeline";

const mockData = {
    title: 'Ноутбук Lenovo ThinkPad',
    description: 'Надёжный ноутбук для работы и учёбы с процессором Intel i7 и 16 ГБ ОЗУ.',
    category: 'Электроника',
    price: '55 000 ₽',
    address: 'г. Москва, ул. Примерная, д. 12',
    images: [
        'https://mobile-review.com/all/wp-content/uploads/2022/02/anons-73.jpg',
        'https://expertvybor.ru/images/wp-content/uploads/2019/03/2019-03-20_11-03-09.png',
        'https://data-protect.in.ua/wp-content/uploads/2023/06/notebook-entry-level-buyers-guide-2018-big.jpg',
    ],
    timeline: [
        {
            type: 'Created',
            date: '2025-04-01T10:00:00Z',
        },
        {
            type: 'PriceOffer',
            date: '2025-04-02T12:00:00Z',
            price: 1500,
        },
        {
            type: 'PriceAccept',
            date: '2025-04-02T15:30:00Z',
            user_id: 101,
        },
        {
            type: 'DateOffer',
            date: '2025-04-03T09:00:00Z',
            user_id: 101,
        },
        {
            type: 'DateAccept',
            date: '2025-04-03T12:00:00Z',
            user_id: 202,
        },
        {
            type: 'Closed',
            date: '2025-04-04T18:45:00Z',
            user_id: 101,
            success: true,
        },
    ] as TimelineItemType[]
};
  
const ProductCardPage = () => {
    const [product, setProduct] = useState<null | typeof mockData>(null);
  
    useEffect(() => {
        // Заглушка под загрузку с сервера
        setTimeout(() => {
            setProduct(mockData);
        }, 1000);
    }, []);
  
    if (!product) {
        return <Loader/>;
    }
  
    return (
        <Container sx={{ mt: 4 }}>
            <Box>
                <Button component={Link} to="/" variant="outlined" sx={{ mb: 2 }}>
                    В главное меню
                </Button>
        
                <Typography variant="h4" gutterBottom>
                    Карточка товара
                </Typography>
        
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, md: 6}}>
                        <Paper elevation={10}>
                            <ImageGallery images={mockData.images} />
                        </Paper>
                    </Grid>
            
                    <Grid size={{xs: 12, md: 6}}>
                        <Typography variant="h5" gutterBottom>{product.title}</Typography>
                        <Typography variant="body1" component="p" >{product.description}</Typography>
                        <Typography variant="body2" gutterBottom><strong>Категория:</strong> {product.category}</Typography>
                        <Typography variant="body2" gutterBottom><strong>Цена:</strong> {product.price}</Typography>
                        <Typography variant="body2" gutterBottom><strong>Адрес:</strong> {product.address}</Typography>
            
                        <Button variant="contained" color="error" sx={{ mt: 3 }}>
                            Закрыть заявку
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Paper elevation={3} sx={{ mt: 5, p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    История операций
                </Typography>
                <ProductTimeline timeline={product.timeline} />
            </Paper>  
        </Container>
    );
  };
  
export default ProductCardPage;