import { AccessTime, AttachMoney, CheckCircle, DoneAll, Event, Help } from "@mui/icons-material";
import { ProductRequest, Status, TypeEnum } from "@src/api";
import AfterCreatedItem from "@src/components/ui/timeline/items/AfterCreatedItem";
import DateOfferLoopItem from "@src/components/ui/timeline/items/DateOfferLoopItem";
import PreClosedStatusItem from "@src/components/ui/timeline/items/PreClosedStatusItem";
import PriceOfferLoopItem from "@src/components/ui/timeline/items/PriceOfferLoopItem";

type StatusView = {
  description: string,
  icon: React.ReactNode,
  color: "primary" | "success" | "warning" | "error" | "info" | "secondary",
}

const STATUS_VIEW: Record<TypeEnum, StatusView> = {
  'created_status': {
    description: 'Заявка создана',
    icon: <AccessTime />,
    color: 'info',
  },
  'price_offer_status': {
    description: 'Цена предложена',
    icon: <AttachMoney />,
    color: 'primary',
  },
  'price_accept_status': {
    description: 'Цена одобрена',
    icon: <CheckCircle />,
    color: 'success',
  },
  'date_offer_status': {
    description: 'Дата предложена',
    icon: <Event />,
    color: 'warning',
  },
  'date_accept_status': {
    description: 'Дата подтверждена',
    icon: <DoneAll />,
    color: 'success',
  },
  'closed_status': {
    description: 'Заявка закрыта',
    icon: <DoneAll />,
    color: 'success',
  },
};

export function getStatusView(status: Status) {
  const view = STATUS_VIEW[status.type] ?? {
    description: 'Неизвестный статус',
    icon: <Help />,
    color: 'error',
  }

  return view;
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
    return <PriceOfferLoopItem index={count} requestId={request.id}/>
  }
  else if (lastStatus.type === 'price_accept_status' || lastStatus.type === 'date_offer_status'){
    return <DateOfferLoopItem index={count} requestId={request.id}/>
  } 
  else if(lastStatus.type === 'date_accept_status'){
    return <PreClosedStatusItem index={count} requestId={request.id}/>
  }
}
