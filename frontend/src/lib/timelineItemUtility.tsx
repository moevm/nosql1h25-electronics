import { AccessTime, AttachMoney, CheckCircle, DoneAll, Event, Help } from "@mui/icons-material";
import { Status, TypeEnum } from "@src/api";

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
    color: 'success',
  }

  return view;
}
