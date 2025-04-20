import { AccessTime, AttachMoney, CheckCircle, DoneAll, Cancel, Event } from "@mui/icons-material";
import { Timeline, TimelineItem, TimelineOppositeContent, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, timelineOppositeContentClasses, timelineItemClasses } from "@mui/lab";
import { Typography, Paper } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { motion } from 'framer-motion';

type TimelineStatus = 'Created' | 'PriceOffer' | 'PriceAccept' | 'DateOffer' | 'DateAccept' | 'Closed';

export interface TimelineItemType {
  type: TimelineStatus;
  date: string;
  price?: number;
  user_id?: number;
  success?: boolean;
}

const iconMap = {
  Created: <AccessTime />,
  PriceOffer: <AttachMoney />,
  PriceAccept: <CheckCircle />,
  DateOffer: <Event />,
  DateAccept: <DoneAll />,
  Closed: <DoneAll />,
};

const colorMap: Record<string, "primary" | "success" | "warning" | "error" | "info" | "secondary"> = {
  Created: 'info',
  PriceOffer: 'primary',
  PriceAccept: 'success',
  DateOffer: 'warning',
  DateAccept: 'success',
  Closed: 'success',
};

const getDescription = (item: any) => {
  switch (item.type) {
    case 'Created':
      return 'Заявка создана';
    case 'PriceOffer':
      return `Предложена цена: ${item.price}₽`;
    case 'PriceAccept':
      return `Пользователь ${item.user_id} принял цену`;
    case 'DateOffer':
      return `Предложена дата пользователем ${item.user_id}`;
    case 'DateAccept':
      return `Дата подтверждена пользователем ${item.user_id}`;
    case 'Closed':
      return item.success ? 'Заказ успешно завершён' : 'Заказ закрыт без успеха';
    default:
      return '';
  }
};

const ProductTimeline = ({ timeline }: { timeline: TimelineItemType[] }) => {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.3 }}
    >
      <Timeline sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
        position="right"
      >
        {timeline.map((item, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color={colorMap[item.type]}>
                {iconMap[item.type]}
              </TimelineDot>
              {index !== timeline.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body2" color="textSecondary">
                {new Date(item.date).toLocaleString()}
              </Typography>
              <Typography>{getDescription(item)}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </motion.div>
  );
};

export default ProductTimeline;
