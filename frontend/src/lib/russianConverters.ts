import type { CategoryEnum, TypeEnum } from '@src/api';

export const statusTypeToRussian = (type: TypeEnum): string => {
  const typeMap: Record<TypeEnum, string> = {
    created_status: 'Создан',
    price_offer_status: 'Предложена цена',
    price_accept_status: 'Цена подтверждена',
    date_offer_status: 'Предложена дата встречи',
    date_accept_status: 'Дата встречи подтверждена',
    closed_status: 'Закрыта',
  };

  return typeMap[type];
};

export const categoryToRussian = (category: CategoryEnum): string => {
  const categoryMap: Record<CategoryEnum, string> = {
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

  return categoryMap[category];
};
