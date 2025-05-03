import type { CategoryEnum, TypeEnum } from '@src/api';

export const statusMap: Record<TypeEnum, string> = {
  created_status: 'Создан',
  price_offer_status: 'Предложена цена',
  price_accept_status: 'Цена подтверждена',
  date_offer_status: 'Предложена дата встречи',
  date_accept_status: 'Дата встречи подтверждена',
  closed_status: 'Закрыта',
};

export const statusTypeToRussian = (type: TypeEnum) => statusMap[type];

export const categoryMap: Record<CategoryEnum, string> = {
  laptop: 'Ноутбук',
  smartphone: 'Смартфон',
  tablet: 'Планшет',
  pc: 'Персональный компьютер',
  tv: 'Телевизор',
  audio: 'Наушники и колонки',
  console: 'Игровые приставки',
  periphery: 'Компьютерная периферия',
  other: 'Прочее',
};

export const categoryToRussian = (category: CategoryEnum) => categoryMap[category];
