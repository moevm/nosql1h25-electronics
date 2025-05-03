import { Button } from '@mui/material';
import CreateRequestDialog from '@src/components/ui/ProductCreateDialog';
import { useAppDispatch } from '@src/hooks/ReduxHooks';
import { updateRequests } from '@src/store/RequestsSlice';
import { useState } from 'react';

export const CreateRequestButton = () => {
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CreateRequestDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={() => dispatch(updateRequests(null))}
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

export default CreateRequestButton;
