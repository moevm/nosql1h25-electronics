import { AccessTime, AttachMoney, CheckCircle, DoneAll, Event, Help } from "@mui/icons-material";
import { ApiService, ProductRequest, Status, TypeEnum, UserResponse } from "@src/api";
import AfterCreatedItem from "@src/components/ui/timeline/items/AfterCreatedItem";
import DateOfferLoopItem from "@src/components/ui/timeline/items/DateOfferLoopItem";
import PreClosedStatusItem from "@src/components/ui/timeline/items/PreClosedStatusItem";
import PriceOfferLoopItem from "@src/components/ui/timeline/items/PriceOfferLoopItem";
import dayjs from "dayjs";
import { ReactNode } from "react";

const STATUS_ICON: Record<TypeEnum, ReactNode> = {
  'created_status': <AccessTime />,
  'price_offer_status': <AttachMoney />,
  'price_accept_status': <CheckCircle />,
  'date_offer_status': <Event />,
  'date_accept_status': <CheckCircle />,
  'closed_status': <DoneAll />
};

export function getStatusIcon(status: Status) {
  const icon = STATUS_ICON[status.type] ?? <Help />

  return icon;
}

export function getStatusDescription(product: ProductRequest, status: Status, currentUser: UserResponse, isAdmin: boolean) {
  const isParcitipated = currentUser.user_id === status.user_id
  const isBuyer = isParcitipated ? isAdmin : !isAdmin;

  if(status.type === 'created_status'){
    return <>Заяка создана</>
  }
  else if (status.type === 'price_offer_status'){
    return <>{isBuyer ? <>Скупщиком</> : <>Пользователем</>} была предложена <strong>цена {status.price}</strong></>
  }
  else if(status.type === 'price_accept_status'){
    return <>{isBuyer ? <>Скупщик</> : <>Пользователь</>} согласился <strong>с ценой {status.price}</strong></>
  }
  else if(status.type === 'date_offer_status'){
    return <>{isBuyer ? <>Скупщиком</> : <>Пользователем</>} была предложена <strong>дата встречи {dayjs(status.date).format('DD.MM.YYYY HH:mm')}</strong></>
  }
  else if(status.type === 'date_accept_status'){
    return <>{isBuyer ? <>Скупщик</> : <>Пользователь</>} согласился с <strong>датой встречи {dayjs(status.date).format('DD.MM.YYYY HH:mm')}</strong></>
  }
  else if(status.type === 'closed_status'){
    return <>Заявка завершена с итоговой ценой <strong>{product.price}₽</strong></>
  }
}

export function getFictitiousStatus(request: ProductRequest){
  const count = request.statuses.length;
  const lastStatus = request.statuses[count - 1];
  
  if(lastStatus.type === 'closed_status'){
    return null;
  } 
  else if (lastStatus.type === 'created_status'){
    return <AfterCreatedItem requestId={request.id} index={count}/>;
  }
  else if (lastStatus.type === 'price_offer_status'){
    return <PriceOfferLoopItem index={count} requestId={request.id} lastUserId={lastStatus.user_id} offeredPrice={lastStatus.price!}/>
  }
  else if (lastStatus.type === 'price_accept_status' || lastStatus.type === 'date_offer_status'){
    return <DateOfferLoopItem index={count} requestId={request.id}  lastUserId={lastStatus.user_id} offeredDate={lastStatus.date!}/>
  } 
  else if(lastStatus.type === 'date_accept_status'){
    return <PreClosedStatusItem index={count} requestId={request.id}/>
  }
}
