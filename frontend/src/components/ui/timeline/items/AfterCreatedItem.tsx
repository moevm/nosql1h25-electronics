import { AccessTimeFilled } from "@mui/icons-material";
import { TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";
import { Typography } from "@mui/material";
import { grey, yellow } from "@mui/material/colors";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectIsAdmin } from "@src/store/UserSlice";
import PriceInput from "../inputs/PriceInput";
import DateInput from "../inputs/DateInput";

const AfterCreatedItem = ({ index, requestId }: { index: number, requestId: string }) => {
  const isAdmin = useAppSelector(selectIsAdmin);

  return (
    <TimelineItem key={index}>

      <TimelineSeparator>
        <TimelineDot sx={{  my: 0, bgcolor: isAdmin ? yellow[700] : grey[500] }}>
          <AccessTimeFilled />
        </TimelineDot>
      </TimelineSeparator>

      <TimelineContent>
        <Typography />
        {isAdmin ?
          <>
            <Typography>Ожидается <strong>рассмотрение</strong>:</Typography>

            <PriceInput requestId={requestId} />
            <DateInput requestId={requestId} />
          </>
          :
          <Typography>Ожидается <strong>рассмотрение</strong> скупщиком</Typography>
        }

      </TimelineContent>
    </TimelineItem>
  );
};

export default AfterCreatedItem;
