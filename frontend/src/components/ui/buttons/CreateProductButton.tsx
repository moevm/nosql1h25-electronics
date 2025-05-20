import { Button } from '@mui/material';
import CreateRequestDialog from '@src/components/ui/ProductCreateDialog';
import { useState } from 'react';

export interface CreateProductButtonProps {
  onSubmit?: () => void;
}

export const CreateProductButton = ({ onSubmit }: CreateProductButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CreateRequestDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={() => onSubmit?.()}
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
