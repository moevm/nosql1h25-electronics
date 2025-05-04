import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import Loader from "../ui/Loader";
import ImageGallery from "../ui/ImageGallery";
import { ApiService, ProductRequest } from "@src/api";
import NotFoundPage from "./NotFoundPage";
import ErrorMessage, { ErrorProps } from "../ui/ErrorMessage";
import { AxiosError } from "axios";
import { categoryToRussian } from "@src/lib/russianConverters";
import ProductTimeline from "../ui/timeline/ProductTimeline";
import { selectUser } from "@src/store/UserSlice";
import { useAppSelector } from "@src/hooks/ReduxHooks";


const ProductCardPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <NotFoundPage />;
  }

  const user = useAppSelector(selectUser);

  const navigate = useNavigate();

  const [product, setProduct] = useState<null | ProductRequest>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorProps, setErrorProps] = useState<ErrorProps | null>(null);
  const handleClick = async () => {
    try {
      await ApiService.apiRequestsStatusesCreate({
        id: product!.id!,
        requestBody: {
          type: 'closed_status',
          timestamp: "",
          user_id: user!.user_id,
          success: false
        }
      });
    } catch (error) {
      alert(error);
    }
    navigate(0);
  }

  useEffect(() => {
    if (!id) return;

    const loadProduct = async (id: string) => {
      try {
        const response = await ApiService.apiRequestsRetrieve({ id });
        setProduct(response);
      } catch (error) {
        setIsError(true);
        if (error instanceof AxiosError && error.response) {
          setErrorProps({
            title: `${error.response.status}: ${error.response.statusText}`,
            message: error.message
          });
        }
      }
    }

    loadProduct(id)

  }, [id]);

  if (isError) {
    return <ErrorMessage {...(errorProps || {})} />;
  }

  if (!product) {
    return <Loader />;
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
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={10}>
              <ImageGallery images={product.photos} />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" gutterBottom>{product.title}</Typography>
            <Typography variant="body1" component="p" >{product.description}</Typography>
            <Typography variant="body2" gutterBottom><strong>Категория:</strong> {categoryToRussian(product.category)}</Typography>
            <Typography variant="body2" gutterBottom><strong>Цена:</strong> {product.price} ₽</Typography>
            <Typography variant="body2" gutterBottom><strong>Адрес:</strong> {product.address}</Typography>

            <Button disabled={product.statuses.some(status => status.type === 'closed_status')} variant="contained" color="error" sx={{ mt: 3 }} onClick={handleClick}>
              Закрыть заявку
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Paper elevation={3} sx={{ mt: 5, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          История операций
        </Typography>
        <ProductTimeline product={product} />
      </Paper>
    </Container>
  );
};

export default ProductCardPage;
