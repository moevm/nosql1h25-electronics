import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { Request } from "@src/model/request";
import { categoryToRussian, statusTypeToRussian } from "@src/lib/russianConverters";

export interface RequestsTableProps {
  requests: Request[],
}

export const RequestsTable = ({ requests }: RequestsTableProps) => {
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
            <TableRow hover onClick={() => alert(request.id)} sx={{ cursor: 'pointer' }} key={request.id}>
              <TableCell>{request.title}</TableCell>
              <TableCell>{categoryToRussian(request.category)}</TableCell>
              <TableCell>{statusTypeToRussian(request.statuses.at(-1)!.type)}</TableCell>
              <TableCell>{request.statuses.at(-1)!.timestamp.format('YYYY-MM-DD')}</TableCell>
            </TableRow>
          )) } 
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestsTable;
