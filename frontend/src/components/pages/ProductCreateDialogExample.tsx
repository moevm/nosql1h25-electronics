import { Box, Button, Container } from '@mui/material';
import { useState } from 'react';
import CreateRequestDialog from '../ui/ProductCreateDialog';

const ProductCreateDialogExample = () => {
    const [openDialog, setOpenDialog] = useState(false);
    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Box textAlign="center">
                <CreateRequestDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onSubmit={(data) => console.log('submitted', data)}
                />

                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>Открыть диалог</Button>
            </Box>
        </Container>
  )
};

export default ProductCreateDialogExample;