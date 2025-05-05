import { AccessTimeFilled, CalendarMonth } from "@mui/icons-material";
import { TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";
import { Typography } from "@mui/material";
import { grey, yellow } from "@mui/material/colors";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectIsAdmin } from "@src/store/UserSlice";
import DateInput from "../inputs/DateInput";

const AfterPricaAccpetItem = ({ index, requestId }: { index: number, requestId: string }) => {
  const isAdmin = useAppSelector(selectIsAdmin);

  return (
    <TimelineItem key={index}>

      <TimelineSeparator>
        <TimelineDot sx={{ my: 0, bgcolor: isAdmin ? yellow.A400 : grey[500] }}>
          {!isAdmin ?
            <AccessTimeFilled />
            :
            <CalendarMonth />
          }
        </TimelineDot>
      </TimelineSeparator>

      <TimelineContent>
        <Typography />
        {isAdmin ?
          <>
            <Typography>Ожидается назначение <strong>даты встречи</strong>:</Typography>

            <DateInput requestId={requestId} />
          </>
          :
          <Typography>Ожидание предложения <strong>даты встерчи</strong> скупщиком</Typography>
        }

      </TimelineContent>
    </TimelineItem>
  );
};

export default AfterPricaAccpetItem;
