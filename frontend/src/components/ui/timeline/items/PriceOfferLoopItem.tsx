import { AccessTimeFilled } from "@mui/icons-material";
import { TimelineItem, TimelineSeparator, TimelineDot, TimelineContent } from "@mui/lab";
import { Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import PriceInput from "../inputs/PriceInput";
import AcceptPrice from "../inputs/AcceptPrice";

const PriceOfferLoopItem = ({index, requestId}: {index: number, requestId: string} ) => {
  return (
    <TimelineItem key={index}>
      <TimelineSeparator>
        <TimelineDot sx={{ color: yellow }}>
          <AccessTimeFilled />
        </TimelineDot>
      </TimelineSeparator>

      <TimelineContent>
        <Typography>Ожидается <strong>рассмотрение</strong>:</Typography>

        <AcceptPrice requestId={requestId}/>
        <PriceInput requestId={requestId}/>
      </TimelineContent>
    </TimelineItem>
  );
}

export default PriceOfferLoopItem;
