import type { Status } from '@src/model/status';
import { Category } from '@src/model/category';

export const statusTypeToRussian = (type: Status['type']): string => {
  const typeMap: Record<typeof type, string> = {
    created: 'Создан',
    price_offer: 'Предложена цена',
    price_accept: 'Цена подтверждена',
    date_offer: 'Предложена дата встречи',
    date_accept: 'Дата встречи подтверждена',
    closed: 'Закрыта',
  };

  return typeMap[type];
};

export const categoryToRussian = (category: Category): string => {
  const categoryMap: Record<Category, string> = {
    [Category.Laptop]: 'Ноутбук',
    [Category.Smartphone]: 'Смартфон',
    [Category.Tablet]: 'Планшет',
    [Category.PC]: 'Персональный компьютер',
    [Category.TV]: 'Телевизор',
    [Category.Audio]: 'Наушники и колонки',
    [Category.Console]: 'Игровые приставки',
    [Category.Periphery]: 'Компьютерная периферия',
    [Category.Other]: 'Прочее',
  };

  return categoryMap[category];
};
