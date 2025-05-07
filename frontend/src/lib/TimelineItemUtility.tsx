import { Add, Check, Clear, CurrencyRuble, DoneAll, Event, Help } from "@mui/icons-material";
import { ProductRequest, Status, UserResponse } from "@src/api";
import AfterCreatedItem from "@src/components/ui/timeline/items/AfterCreatedItem";
import AfterPriceAccpetItem from "@src/components/ui/timeline/items/AfterPriceAccpetItem";
import DateOfferLoopItem from "@src/components/ui/timeline/items/DateOfferLoopItem";
import PreClosedStatusItem from "@src/components/ui/timeline/items/PreClosedStatusItem";
import PriceOfferLoopItem from "@src/components/ui/timeline/items/PriceOfferLoopItem";
import dayjs from "dayjs";

export function getStatusIcon(status: Status) {
  if (status.type === 'created_status') {
    return <Add />
  }
  else if (status.type === 'price_offer_status') {
    return <CurrencyRuble />
  }
  else if (status.type === 'price_accept_status') {
    return <Check />
  }
  else if (status.type === 'date_offer_status') {
    return <Event />
  }
  else if (status.type === 'date_accept_status') {
    return <Check />
  }
  else if (status.type === 'closed_status') {
    if (status.success) {
      return <DoneAll />
    }
    else {
      return <Clear />
    }
  }

  return <Help />;
}

export function getStatusDescription(product: ProductRequest, status: Status, currentUser: UserResponse, isAdmin: boolean) {
  const isParcitipated = currentUser.user_id === status.user_id
  const isBuyer = isParcitipated ? isAdmin : !isAdmin;

  if (status.type === 'created_status') {
    return 'Заявка создана'
  }
  else if (status.type === 'price_offer_status') {
    return <>{isBuyer ? 'Скупщиком' : 'Пользователем'} была предложена <strong>цена {status.price}₽</strong></>
  }
  else if (status.type === 'price_accept_status') {
    return <>{isBuyer ? 'Скупщик' : 'Пользователь'} согласился <strong>с ценой</strong></>
  }
  else if (status.type === 'date_offer_status') {
    return <>{isBuyer ? 'Скупщиком' : 'Пользователем'} была предложена <strong>дата встречи {dayjs(status.date).format('DD.MM.YYYY HH:mm')}</strong></>
  }
  else if (status.type === 'date_accept_status') {
    return <>{isBuyer ? 'Скупщик' : 'Пользователь'} согласился с <strong>датой встречи</strong></>
  }
  else if (status.type === 'closed_status') {
    if (status.success) {
      return <>Заявка завершена с итоговой ценой <strong>{product.price}₽</strong></>
    }
    else {
      return <>Заявка закрыта {isBuyer ? 'скупщиком' : 'пользователем'}</>
    }
  }
}

export function getFictitiousStatus(request: ProductRequest) {
  const count = request.statuses.length;
  const lastStatus = request.statuses[count - 1];

  if (lastStatus.type === 'closed_status') {
    return null;
  }
  else if (lastStatus.type === 'created_status') {
    return <AfterCreatedItem requestId={request.id} index={count} />;
  }
  else if (lastStatus.type === 'price_offer_status') {
    return <PriceOfferLoopItem index={count} requestId={request.id} lastUserId={lastStatus.user_id} offeredPrice={lastStatus.price!} />
  }
  else if (lastStatus.type === 'price_accept_status') {
    return <AfterPriceAccpetItem index={count} requestId={request.id} />
  }
  else if (lastStatus.type === 'date_offer_status') {
    return <DateOfferLoopItem index={count} requestId={request.id} lastUserId={lastStatus.user_id} offeredDate={lastStatus.date!} />
  }
  else if (lastStatus.type === 'date_accept_status') {
    return <PreClosedStatusItem index={count} requestId={request.id} />
  }
}
