import { FiberManualRecord, CheckCircle } from "@mui/icons-material";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import { ApiService } from "@src/api";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectUser } from "@src/store/UserSlice";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DateInput = ({ requestId }: { requestId: string }) => {
  const user = useAppSelector(selectUser);
  const [date, setDate] = useState<Date | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleDate = async () => {
    try {
      await ApiService.apiRequestsStatusesCreate({
        id: requestId,
        requestBody: {
          type: "price_offer_status",
          timestamp: "",
          date: date!.toDateString(),
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
      <Typography>Предложить <strong>дату</strong>:</Typography>
      <TextField size="small" variant="outlined" type="number" value={date} onChange={e => setDate(new Date(e.target.value))} />
      <IconButton color="success" onClick={() => handleDate()} edge="end">
        <CheckCircle />
      </IconButton>
    </Box>
  );
}

export default DateInput;
