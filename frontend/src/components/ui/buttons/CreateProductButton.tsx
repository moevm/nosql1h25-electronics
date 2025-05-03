import { Button } from '@mui/material';
import CreateRequestDialog from '@src/components/ui/ProductCreateDialog';
import { useAppDispatch } from '@src/hooks/ReduxHooks';
import { updateProducts } from '@src/store/ProductsSlice';
import { useState } from 'react';

export const CreateProductButton = () => {
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CreateRequestDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={() => dispatch(updateProducts(null))}
      />

      <Button
        variant='contained'
        onClick={() => setIsOpen(true)}
      >
        Создать заявку
      </Button>
    </>
  );
};

export default CreateProductButton;
