import { Timeline, TimelineItem, TimelineOppositeContent, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, timelineOppositeContentClasses, timelineItemClasses } from "@mui/lab";
import { Typography, Paper } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { motion } from 'framer-motion';
import { Status } from "@src/api";
import PrimaryItem from "./timeline.items/PrimaryItem";

const ProductTimeline = ({ statuses }: { statuses: Status[] }) => {
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
        {statuses.map((item, index) => (
          <PrimaryItem index={index} item={item}></PrimaryItem>
        ))}
      </Timeline>
    </motion.div>
  );
};

export default ProductTimeline;
