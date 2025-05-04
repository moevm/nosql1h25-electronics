import { AccessTimeFilled } from "@mui/icons-material";
import { TimelineItem, TimelineSeparator, TimelineDot, TimelineContent } from "@mui/lab";
import { Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import AcceptDate from "../inputs/AcceptDate";
import DateInput from "../inputs/DateInput";

const DateOfferLoopItem = ({index, requestId}: {index: number, requestId: string} ) => {
  return (
    <TimelineItem key={index}>
      <TimelineSeparator>
        <TimelineDot sx={{ color: yellow }}>
          <AccessTimeFilled />
        </TimelineDot>
      </TimelineSeparator>

      <TimelineContent>
        <Typography>Ожидается <strong>рассмотрение</strong>:</Typography>

        <AcceptDate requestId={requestId}/>
        <DateInput requestId={requestId}/>
      </TimelineContent>
    </TimelineItem>
  );
}

export default DateOfferLoopItem;
