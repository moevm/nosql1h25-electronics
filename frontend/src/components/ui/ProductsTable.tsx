import { Box, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { categoryToRussian, statusTypeToRussian } from '@src/lib/RussianConverters';
import { ApiService, ProductRequest, ProductRequestListResponse } from '@src/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorOutline } from '@mui/icons-material';

interface ProductsTableRowProps {
  product: ProductRequest;
}

const ProductsTableRow = ({ product }: ProductsTableRowProps) => {
  const navigate = useNavigate();

  const { isPending, isError, data: fullname } = useQuery({
    queryKey: ['user', product.user_id, 'fullname'], 
    queryFn: () => 
      ApiService.apiUsersRetrieve({ id: product.user_id })
      .then(user => user.fullname)
  });

  return (
    <TableRow 
      hover 
      sx={{ cursor: 'pointer' }} 
      onClick={() => navigate(`/product/${product.id}`)} 
    >
      <TableCell>
        { (isPending)
          ? <CircularProgress size={25} />
          : (!isError)
          ? fullname
          : <Stack direction='row'>
            <ErrorOutline />
            <Typography>Ошибка</Typography>
          </Stack>
        }
      </TableCell>
      <TableCell>{product.title}</TableCell>
      <TableCell>{categoryToRussian(product.category)}</TableCell>
      <TableCell>{statusTypeToRussian(product.statuses.at(-1)!.type)}</TableCell>
      <TableCell>{dayjs(product.statuses.at(-1)!.timestamp).format('DD.MM.YYYY')}</TableCell>
    </TableRow>
  );
};

export interface ProductsTableProps {
  pageSize: number;
  getData(page: number, pageSize: number): Promise<ProductRequestListResponse>;
}

export const ProductsTable = ({ getData, pageSize }: ProductsTableProps) => {
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<ProductRequest[] | null>();

  useEffect(() => {
    setTotal(0);
  }, [getData]);

  useEffect(() => {
    setPage(0);
  }, [getData, pageSize, total]);

  useEffect(() => {
    setProducts(null);

    getData(page, pageSize)
    .then(({ amount, requests }) => {
      setTotal(amount);
      setProducts(requests);
    })
    .catch(e => {
      setProducts([]);
      alert(e.toString());
    });
  }, [getData, pageSize, page]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Создатель</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell>Последний статус</TableCell>
            <TableCell>Дата назначения статуса</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { 
            (products && products.length > 0)
            ? products.map(product => <ProductsTableRow key={product.id} product={product} />) 
            : (products)
            ? <TableRow>
              <TableCell colSpan={5}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Typography variant='h4'>Пусто</Typography> 
                </Box>
              </TableCell>
            </TableRow>
            : <TableRow>
              <TableCell colSpan={5}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress size={25} />
                </Box>
              </TableCell>
            </TableRow>
          } 
          <TableRow>
            <TablePagination
              rowsPerPage={pageSize}
              rowsPerPageOptions={[]}
              count={total}
              page={page}
              onPageChange={(_, page) => setPage(page)}
              labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
            />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ); 
};

export default ProductsTable;
