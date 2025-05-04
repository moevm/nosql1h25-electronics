import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";
import { Typography } from "@mui/material";
import { Status } from "@src/api";
import { getStatusView } from "@src/lib/timelineItemUtility";

const PrimaryItem = ({ index, item }: { index: number, item: Status}) => {
  const view = getStatusView(item);

  return (
    <TimelineItem key={index}>
      <TimelineSeparator>
        <TimelineDot color={view.color}>
          {view.icon}
        </TimelineDot>
        {item.type !== 'closed_status' && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="body2" color="textSecondary">
          {new Date(item.timestamp).toLocaleString()}
        </Typography>
        <Typography>{view.description}</Typography>
      </TimelineContent>
    </TimelineItem>
  );
};

export default PrimaryItem;
