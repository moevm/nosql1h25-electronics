import { AccessTimeFilled} from "@mui/icons-material";
import { TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";
import { Typography } from "@mui/material";
import { grey, yellow } from "@mui/material/colors";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectIsAdmin } from "@src/store/UserSlice";
import CloseRequest from "../inputs/CloseRequest";

const PreClosedStatusItem = ({ index, requestId }: { index: number, requestId: string }) => {
  const isAdmin = useAppSelector(selectIsAdmin);

  return (
    <TimelineItem key={index}>
        <TimelineSeparator>
          <TimelineDot sx={{ my: 0, bgcolor: !isAdmin ? grey[500] : yellow[600] }}>
            <AccessTimeFilled />
          </TimelineDot>
        </TimelineSeparator>

        <TimelineContent>
          <Typography>Ожидается подтверждение <strong>рассмотрения</strong> заявки</Typography>
          {isAdmin ? <CloseRequest requestId={requestId}/> : <></>}
        </TimelineContent>
      </TimelineItem>
  );
};

export default PreClosedStatusItem;
