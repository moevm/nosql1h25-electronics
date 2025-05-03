import { Button } from "@mui/material";
import { ApiService } from "@src/api";
import dayjs from "dayjs";
import { saveAs } from "file-saver";

export const BackupExportButton = () => {
  const onClick = async () => {
    try {
      const data = await ApiService.apiBackupRetrieve();

      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      saveAs(blob, `backup-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.json`);

      alert('Данные успешно экспортированы'); 
    } catch {
      alert('Ошибка экспорта данных');
    }
  };

  return (
    <Button
      variant='contained'
      onClick={onClick}
    >
      Экспорт БД
    </Button>
  );
};
