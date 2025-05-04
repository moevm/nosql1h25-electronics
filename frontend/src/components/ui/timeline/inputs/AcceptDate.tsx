import { FiberManualRecord, CheckCircle } from "@mui/icons-material";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import { ApiService } from "@src/api";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectUser } from "@src/store/UserSlice";
import { useLocation, useNavigate } from "react-router-dom";

const AcceptDate = ({ requestId }: { requestId: string }) => {
  const user = useAppSelector(selectUser);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleDate = async () => {
    try {
      await ApiService.apiRequestsStatusesCreate({
        id: requestId,
        requestBody: {
          type: "date_accept_status",
          timestamp: "",
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
      <Typography>Подтвердить дату:</Typography>
      <IconButton color="success" onClick={() => handleDate()} edge="end">
        <CheckCircle />
      </IconButton>
    </Box>
  );
}

export default AcceptDate;
