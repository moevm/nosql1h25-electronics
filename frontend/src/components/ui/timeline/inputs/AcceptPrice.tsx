import { FiberManualRecord, CheckCircle } from "@mui/icons-material";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import { ApiService } from "@src/api";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectUser } from "@src/store/UserSlice";
import { useNavigate } from "react-router-dom";

const AcceptPrice = ({ requestId }: { requestId: string }) => {
  const user = useAppSelector(selectUser);
  
  const navigate = useNavigate();

  const handlePrice = async () => {
    try {
      await ApiService.apiRequestsStatusesCreate({
        id: requestId,
        requestBody: {
          type: "price_accept_status",
          timestamp: "",
          user_id: user!.user_id
        }
      });
    } catch (error) {
      alert(error);
    }
    navigate(0);
  }
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt:1}}>
      <FiberManualRecord sx={{ fontSize: 8, mr: 1 }} />
      <Typography>Подтвердить цену:</Typography>
      <IconButton color="success" onClick={() => handlePrice()} edge="end">
        <CheckCircle />
      </IconButton>
    </Box>
  );
}

export default AcceptPrice;
