import { AccessTimeFilled, CurrencyRuble } from "@mui/icons-material";
import { TimelineItem, TimelineSeparator, TimelineDot, TimelineContent } from "@mui/lab";
import { Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import PriceInput from "../inputs/PriceInput";
import AcceptPrice from "../inputs/AcceptPrice";
import { UserResponse } from "@src/api";
import { useAppSelector } from "@src/hooks/ReduxHooks";
import { selectUser } from "@src/store/UserSlice";

const PriceOfferLoopItem = ({index, requestId, lastUser, offeredPrice}: {index: number, requestId: string, lastUser: UserResponse, offeredPrice: number} ) => {
  const user = useAppSelector(selectUser);
  const isLastParcitipated = lastUser.user_id == user!.user_id;
  return (
    <TimelineItem key={index}>
      <TimelineSeparator>
        <TimelineDot color={isLastParcitipated ? 'grey' : undefined} sx={isLastParcitipated ? undefined : { color: yellow }}>
          {isLastParcitipated ?
            <AccessTimeFilled /> 
          :
            <CurrencyRuble/>
          }
        </TimelineDot>
      </TimelineSeparator>

      <TimelineContent>
        {isLastParcitipated ? 
          <Typography>Ожидается подтверждение <strong>цены</strong> {lastUser.role === 'admin' ? <>скупщиком</> : <>пользователем</>} </Typography>
        :
          <>
            <Typography> {lastUser.role === 'admin' ? <>Скупщик</> : <>Пользователь</>} предложил <strong>цену {offeredPrice}</strong></Typography>
            
            <AcceptPrice requestId={requestId}/>
            <PriceInput requestId={requestId}/>
          </>
        }
      </TimelineContent>
    </TimelineItem>
  );
}

export default PriceOfferLoopItem;
