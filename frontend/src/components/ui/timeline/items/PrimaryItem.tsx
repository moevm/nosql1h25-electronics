import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import { ProductRequest, Status } from "@src/api";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { getStatusDescription, getStatusIcon } from "@src/lib/timelineItemUtility";
import { selectIsAdmin, selectUser } from "@src/store/UserSlice";

const PrimaryItem = ({ index, item, product }: { index: number, item: Status, product: ProductRequest }) => {
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);

  const icon = getStatusIcon(item);
  const description = getStatusDescription(product, item, user!, isAdmin);

  return (
    <TimelineItem key={index}>
      <TimelineSeparator>
        <TimelineDot sx={{ my: 0 }} color={item.type === 'closed_status' && !item.success ? 'error' : 'success'}>
          {icon}
        </TimelineDot>
        {item.type !== 'closed_status' && <Box sx={{ height: 40, width: 6, bgcolor: 'green' }} />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="body2" color="textSecondary" sx={{ my: -1 }}>
          {new Date(item.timestamp).toLocaleString()}
        </Typography>
        <Typography>{description}</Typography>
      </TimelineContent>
    </TimelineItem>
  );
};

export default PrimaryItem;
