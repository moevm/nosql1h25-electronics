import { FiberManualRecord, CheckCircle } from "@mui/icons-material";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import { ApiService } from "@src/api";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectUser } from "@src/store/UserSlice";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PriceInput = ({ requestId }: { requestId: string }) => {
  const user = useAppSelector(selectUser);
  const [price, setPrice] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  
  const handlePrice = async () => {
    try {
      await ApiService.apiRequestsStatusesCreate({
        id: requestId,
        requestBody: {
          type: "price_offer_status",
          timestamp: "",
          price: price!,
          user_id: user!.user_id
        }
      });
    } catch (error) {
      alert(error);
    }
    navigate(location.pathname);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
      <FiberManualRecord fontSize="small" />
      <Typography>Предложить <strong>цену</strong>:</Typography>
      <TextField size="small" variant="outlined" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
      <IconButton color="success" onClick={() => handlePrice()} edge="end">
        <CheckCircle />
      </IconButton>
    </Box>
  );
}

export default PriceInput;
