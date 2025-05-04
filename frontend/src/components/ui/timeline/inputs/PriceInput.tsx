import { FiberManualRecord, CheckCircle } from "@mui/icons-material";
import { Box, Typography, TextField, IconButton, Input, InputAdornment, OutlinedInput } from "@mui/material";
import { ApiService } from "@src/api";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectUser } from "@src/store/UserSlice";
import { useState } from "react";
import { NavigateOptions, replace, useLocation, useNavigate } from "react-router-dom";

const PriceInput = ({ requestId }: { requestId: string }) => {
  const user = useAppSelector(selectUser);
  const [price, setPrice] = useState<number | null>(null);

  const navigate = useNavigate();

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

    navigate(0);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt:1 }}>
      <FiberManualRecord sx={{ fontSize: 8, mr: 1 }} />
      <Typography sx={{mr: 1}}>Предложить <strong>цену</strong>:</Typography>
      <OutlinedInput size="small" type="number" value={price} onChange={e => setPrice(Number(e.target.value))}
        endAdornment={<InputAdornment position="end">₽</InputAdornment>} 
        inputProps={{ style: { textAlign: 'right' }, min:0 }}/>
      <IconButton disabled={price == null || price <= 0} color="success" onClick={() => handlePrice()} edge="end">
        <CheckCircle />
      </IconButton>
    </Box>
  );
}

export default PriceInput;
