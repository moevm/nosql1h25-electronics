import { Button } from '@mui/material';
import CreateRequestDialog from '@src/components/ui/ProductCreateDialog';
import { useState } from 'react';

export const CreateProductButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CreateRequestDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={() => {}}
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
