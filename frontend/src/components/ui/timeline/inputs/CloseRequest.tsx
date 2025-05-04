import { FiberManualRecord, CheckCircle } from "@mui/icons-material";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import { ApiService } from "@src/api";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectUser } from "@src/store/UserSlice";
import { useLocation, useNavigate } from "react-router-dom";

const CloseRequest = ({ requestId }: { requestId: string }) => {
  const user = useAppSelector(selectUser);
  
  const navigate = useNavigate();

  const handlePrice = async () => {
    try {
      await ApiService.apiRequestsStatusesCreate({
        id: requestId,
        requestBody: {
          type: "closed_status",
          timestamp: "",
          user_id: user!.user_id,
          success: true
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
      <Typography>Подтвердить</Typography>
      <IconButton color="success" onClick={() => handlePrice()} edge="end">
        <CheckCircle />
      </IconButton>
    </Box>
  );
}

export default CloseRequest;
