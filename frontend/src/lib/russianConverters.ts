import type { CategoryEnum } from '@src/api';

export const statusTypeToRussian = (type: string): string => {
  const typeMap: Record<string, string> = {
    created_status: 'Создан',
    price_offer: 'Предложена цена',
    price_accept: 'Цена подтверждена',
    date_offer: 'Предложена дата встречи',
    date_accept: 'Дата встречи подтверждена',
    closed_status: 'Закрыта',
  };

  return typeMap[type] ?? 'Неизвестный статус';
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
