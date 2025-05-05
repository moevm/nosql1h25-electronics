import { FiberManualRecord, CheckCircle } from "@mui/icons-material";
import { Box, Typography, TextField, IconButton, Input } from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { ApiService } from "@src/api";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectUser } from "@src/store/UserSlice";
import dayjs from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";
import 'dayjs/locale/ru';

dayjs.locale('ru');

const DateInput = ({ requestId }: { requestId: string }) => {
  const user = useAppSelector(selectUser);
  const [date, setDate] = React.useState<dayjs.Dayjs | null>(null);

  const navigate = useNavigate();

  const handleDate = async () => {
    try {
      await ApiService.apiRequestsStatusesCreate({
        id: requestId,
        requestBody: {
          type: "date_offer_status",
          timestamp: "",
          date: date!.toISOString(),
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
      <Typography sx={{ pr: 1 }}>Предложить <strong>дату</strong>:</Typography>
      <MobileDateTimePicker disablePast orientation="landscape" value={date} ampm={false} minutesStep={5}
          format="DD.MM.YYYY HH:mm" onChange={(newValue) => setDate(newValue)} />

      <IconButton disabled={date == null} color="success" onClick={() => handleDate()} edge="end">
        <CheckCircle />
      </IconButton>
    </Box>
  );
}

export default DateInput;
