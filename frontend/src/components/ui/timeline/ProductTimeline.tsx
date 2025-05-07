import { Timeline, timelineItemClasses } from "@mui/lab";
import { useInView } from "react-intersection-observer";
import { motion } from 'framer-motion';
import { ProductRequest } from "@src/api";
import PrimaryItem from "./items/PrimaryItem";
import { getFictitiousStatus } from "@src/lib/TimelineItemUtility";

const ProductTimeline = ({ product }: { product: ProductRequest }) => {
  const { ref, inView } = useInView({ threshold: 0.2 });

  const fictitiousStatus = getFictitiousStatus(product);

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
        {product.statuses.map((item, index) => (
          <PrimaryItem product={product} index={index} item={item}></PrimaryItem>
        ))}

        {fictitiousStatus !== null && fictitiousStatus}
      </Timeline>
    </motion.div>
  );
};

export default ProductTimeline;
