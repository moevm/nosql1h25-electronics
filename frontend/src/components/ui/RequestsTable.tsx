import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { categoryToRussian, statusTypeToRussian } from '@src/lib/RussianConverters';
import { ProductRequest } from '@src/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export interface RequestsTableProps {
  requests: ProductRequest[],
}

export const RequestsTable = ({ requests }: RequestsTableProps) => {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell>Последний статус</TableCell>
            <TableCell>Дата назначения статуса</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { requests.map(request => (
            <TableRow 
              hover 
              sx={{ cursor: 'pointer' }} 
              onClick={() => navigate(`/product/${request.id}`)} 
              key={request.id}
            >
              <TableCell>{request.title}</TableCell>
              <TableCell>{categoryToRussian(request.category)}</TableCell>
              <TableCell>{statusTypeToRussian(request.statuses.at(-1)!.type)}</TableCell>
              <TableCell>{dayjs(request.statuses.at(-1)!.timestamp).format('DD.MM.YYYY')}</TableCell>
            </TableRow>
          )) } 
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestsTable;
