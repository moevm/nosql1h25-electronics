import { AccessTimeFilled, CurrencyRuble } from "@mui/icons-material";
import { TimelineItem, TimelineSeparator, TimelineDot, TimelineContent } from "@mui/lab";
import { Typography } from "@mui/material";
import { grey, yellow } from "@mui/material/colors";
import PriceInput from "../inputs/PriceInput";
import AcceptPrice from "../inputs/AcceptPrice";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectIsAdmin, selectUser } from "@src/store/UserSlice";

const PriceOfferLoopItem = ({ index, requestId, lastUserId, offeredPrice }: { index: number, requestId: string, lastUserId: string, offeredPrice: number }) => {
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isLastParcitipated = lastUserId == user!.user_id;
  return (
    <TimelineItem key={index}>
      <TimelineSeparator>
        <TimelineDot sx={{ my: 0, bgcolor: isLastParcitipated ? grey[500] : yellow[600] }}>
          {isLastParcitipated ?
            <AccessTimeFilled />
            :
            <CurrencyRuble />
          }
        </TimelineDot>
      </TimelineSeparator>

      <TimelineContent>
        {isLastParcitipated ?
          <>
            <Typography>Ожидается подтверждение <strong>цены</strong> {!isAdmin ? <>скупщиком</> : <>пользователем</>} </Typography>
          </>
          :
          <>
            <Typography> {!isAdmin ? <>Скупщик</> : <>Пользователь</>} предложил <strong>цену {offeredPrice}</strong></Typography>

            <AcceptPrice requestId={requestId} />
            <PriceInput requestId={requestId} />
          </>
        }
      </TimelineContent>
    </TimelineItem>
  );
}

export default PriceOfferLoopItem;
