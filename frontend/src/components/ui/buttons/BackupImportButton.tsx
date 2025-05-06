import { Button } from '@mui/material';
import { ApiService } from '@src/api';
import { useAppDispatch } from '@src/hooks/ReduxHooks';
import { reset } from '@src/store/ProductsSlice';
import { logout } from '@src/store/UserSlice';
import React, { useRef } from 'react';

export const BackupImportButton = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const onClick = () => {
    const confirmationText = 'Это действие сотрёт все существующие данные в БД и заменит их теми, что в файле. Вы уверены, что хотите продолжить?';
    if (!confirm(confirmationText)) return;

    inputRef.current?.click();
  };

  const onBackupFileChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    try {
      await ApiService.apiBackupCreate({ formData: { file }});

      alert('Данные успешно импортированы');

      await dispatch(logout());
      dispatch(reset());
    } catch {
      alert('Ошибка импорта данных');
    }

    e.target.value = '';
  };

  return (
    <>
      <Button
        variant='contained'
        onClick={onClick}
      >
        Импорт БД
      </Button>

      <input 
        ref={inputRef}
        style={{ display: 'none' }}
        type='file'
        accept='application/json'
        onChange={onBackupFileChanged}
      />
    </>
  );
};

export default BackupImportButton;
