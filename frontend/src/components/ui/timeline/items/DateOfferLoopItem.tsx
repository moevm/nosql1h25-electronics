import { AccessTimeFilled, CalendarMonth } from "@mui/icons-material";
import { TimelineItem, TimelineSeparator, TimelineDot, TimelineContent } from "@mui/lab";
import { Typography } from "@mui/material";
import { grey, yellow } from "@mui/material/colors";
import AcceptDate from "../inputs/AcceptDate";
import DateInput from "../inputs/DateInput";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectUser, selectIsAdmin } from "@src/store/UserSlice";
import dayjs from "dayjs";

const DateOfferLoopItem = ({index, requestId, lastUserId, offeredDate}: {index: number, requestId: string, lastUserId: string, offeredDate: string } ) => {
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isLastParcitipated = lastUserId == user!.user_id;

  return (
    <TimelineItem key={index}>
      <TimelineSeparator>
        <TimelineDot sx={{ my: 0, bgcolor: isLastParcitipated ? grey[500] : yellow[700] }}>
          {isLastParcitipated ?
            <AccessTimeFilled />
            :
            <CalendarMonth />
          }
        </TimelineDot>
      </TimelineSeparator>

      <TimelineContent>
        {isLastParcitipated ?
          <>
            <Typography>Ожидается подтверждение <strong>даты встречи</strong> {!isAdmin ? <>скупщиком</> : <>пользователем</>} </Typography>
          </>
          :
          <>
            <Typography> {!isAdmin ? <>Скупщик</> : <>Пользователь</>} предложил <strong>дату встречи { dayjs(offeredDate).format('DD.MM.YYYY HH:mm')}</strong></Typography>

            <AcceptDate requestId={requestId}/>
            <DateInput requestId={requestId}/>
          </>
        }
      </TimelineContent>
    </TimelineItem>
  );
}

export default DateOfferLoopItem;
