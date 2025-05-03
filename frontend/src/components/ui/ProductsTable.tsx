import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { categoryToRussian, statusTypeToRussian } from '@src/lib/RussianConverters';
import { ProductRequest, UserResponse } from '@src/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProductsTableRowProps {
  product: ProductRequest;
}

const ProductsTableRow = ({ product }: ProductsTableRowProps) => {
  const navigate = useNavigate();

  const [author, setAuthor] = useState<UserResponse | undefined>();

  useEffect(() => {
    setAuthor(undefined);
    
    // TODO: получить имя автора заявки через API
    new Promise(resolve => setTimeout(resolve, 1500))
    .then(() => setAuthor({ 
      fullname: 'Иванов Иван Иванович', 
      phone: '+79000000000',
      user_id: 'bruh',
      creation_date: dayjs().toISOString(),
      role: 'user',
    }));
  }, [product.user_id]);

  return (
    <TableRow 
      hover 
      sx={{ cursor: 'pointer' }} 
      onClick={() => navigate(`/product/${product.id}`)} 
    >
      <TableCell>
        { !author
          ? <CircularProgress size={25} />
          : author.fullname
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
