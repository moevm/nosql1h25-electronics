import { AccessTimeFilled} from "@mui/icons-material";
import { TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";
import { Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectIsAdmin } from "@src/store/UserSlice";
import PriceInput from "../inputs/PriceInput";
import DateInput from "../inputs/DateInput";

const AfterCreatedItem = ({ index, requestId }: { index: number, requestId: string }) => {
  const isAdmin = useAppSelector(selectIsAdmin);

  if (isAdmin) {
    return (
      <TimelineItem key={index}>
        <TimelineSeparator>
          <TimelineDot sx={{ color: yellow }}>
            <AccessTimeFilled />
          </TimelineDot>
        </TimelineSeparator>

        <TimelineContent>
          <Typography>Ожидается <strong>рассмотрение</strong>:</Typography>

          <PriceInput requestId={requestId}/>
          <DateInput requestId={requestId}/>
        </TimelineContent>
      </TimelineItem>
    );
  }

  return (
    <TimelineItem key={index}>

        <TimelineSeparator>
          <TimelineDot color="grey">
            <AccessTimeFilled />
          </TimelineDot>
        </TimelineSeparator>

        <TimelineContent>
          <Typography>Ожидается <strong>рассмотрение</strong> скупщиком</Typography>
        </TimelineContent>
      </TimelineItem>
  );
};

export default AfterCreatedItem;
