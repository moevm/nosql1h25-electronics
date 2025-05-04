import { FiberManualRecord, CheckCircle } from "@mui/icons-material";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import { ApiService } from "@src/api";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectUser } from "@src/store/UserSlice";
import { useLocation, useNavigate } from "react-router-dom";

const CloseRequest = ({ requestId }: { requestId: string }) => {
  const user = useAppSelector(selectUser);
  
  const navigate = useNavigate();
  const location = useLocation();

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
    navigate(location.pathname);
  }
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
      <FiberManualRecord fontSize="small" />
      <Typography>Подтвердить</Typography>
      <IconButton color="success" onClick={() => handlePrice()} edge="end">
        <CheckCircle />
      </IconButton>
    </Box>
  );
}

export default CloseRequest;
