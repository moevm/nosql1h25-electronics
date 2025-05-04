import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { categoryToRussian, statusTypeToRussian } from '@src/lib/RussianConverters';
import { ApiService, ProductRequest, UserResponse } from '@src/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProductsTableRowProps {
  product: ProductRequest;
}

const ProductsTableRow = ({ product }: ProductsTableRowProps) => {
  const navigate = useNavigate();

  const [authorFullname, setAuthorFullname] = useState<string | undefined>(undefined);

  useEffect(() => {
    setAuthorFullname(undefined);
    
    ApiService.apiUsersRetrieve({ id: product.user_id })
    .then(({ fullname }) => setAuthorFullname(fullname))
    .catch(() => setAuthorFullname('Ошибка'));
  }, [product.user_id]);

  return (
    <TableRow 
      hover 
      sx={{ cursor: 'pointer' }} 
      onClick={() => navigate(`/product/${product.id}`)} 
    >
      <TableCell>
        { !authorFullname
          ? <CircularProgress size={25} />
          : authorFullname
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
  products: ProductRequest[],
}

export const ProductsTable = ({ products }: ProductsTableProps) => (
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
        { products.map(product => <ProductsTableRow key={product.id} product={product} />) } 
      </TableBody>
    </Table>
  </TableContainer>
);

export default ProductsTable;
