import { Role } from './user';
import type { User } from './user';
import type { Request } from './request';
import { Category } from './category';
import dayjs from 'dayjs';

export const client: User = {
  id: 2,
  role: Role.Client,
  fullname: 'Иванов Иван Иванович',
  phone: '89212345678',
  creationDate: dayjs().subtract(10, 'days'),
  editDate: dayjs().subtract(5, 'days'),
};

export const admin: User = {
  id: 1,
  role: Role.Admin,
  fullname: 'Артём Артёмов Артёмович',
  phone: '89112233445',
  creationDate: dayjs().subtract(1, 'month'),
  editDate: dayjs().subtract(20, 'days'),
}; 

export const requests: Request[] = [
  {
    id: 1,
    authorId: 2,
    address: 'City 17, A street, 32',
    title: 'Наушники JBL',
    description: 'Наушники JBL в хорошем состоянии. Продаю по причине ненадобности.',
    category: Category.Audio,
    photos: ['https://c.dns-shop.ru/thumb/st4/fit/wm/0/0/b88bdb21d135a8478c7e1e6d8462bd8d/0fd6a5aa3e6696b0470f8dad48e782f94dde9467ca77d96c849f39251c2e64a4.jpg.webp'],
    price: 2000,
    statuses: [
      {
        type: 'created',
        timestamp: dayjs().subtract(3, 'days'),
      },
    ],
  },
  {
    id: 2,
    authorId: 2,
    address: 'City 17, A street, 32',
    title: 'Утюг Bork',
    description: 'Утюг. Гладит. С функцией отпаривания.',
    category: Category.Other,
    photos: ['https://yandex-images.clstorage.net/4kGVR8216/125a61zGv6s/hWGYmtaSO4nkybIzZYFn1B9KIZOo5l65krC_4GcZizjcKuB71IY9W0eu5DOa1cQHMtb6-eEPPFwWwMCK5Aou_pQi31xDBDlI5czlIyJCIshWwipaJmuBsFo_56fmHxl63jskLU7deMIes_Kj1BTASDuUp6L-3KjEhtweVfdT-SOD80bN35J-xmfLNaijg6LCVcOr0C2tzP6efeKkrhaaMlhmK-pHkmsMHv56YdWbTsi0W-3tdRKjS4MUFZl_VzFiBz7CB5DWeIGixPsjrwroRBFHoxokq8C4UTugK-rW3T5cYaAlDxJkyZa_sSZSUIvKM5stYv4UJM_K1V5Zd5G164JyAI9SX__FL483YKZFoQqQSipR560AtBI77SKkFpg2lO7mqYWQbo6e93Pi3F_GDXGfZOe6XC0FDhZfXbCa_qbLOwfBXFQ3B2nO_CqlgyILXc_sF6SkhbRbcymq4haSPZolaSsK2eMEnjB76R2dRYG0nSSmOxSkz4Kd2NZyWfrqAf4GQBUWusWqj_BrZ4rmTFCOLtAjakAxETDoIuNeXjFUKi0hzd8hTF-4e2WZXU9INt3q5bOZ6YgKX9YU_d5-YMPxTssSXbuH6AA1bCoN48ITya6ZbyLLs1IwaOIrEFA7WK3trYqYowLWuXZjHpDJSzUW5my7nGBLyhpc1rFfdutN8oVE1dwwDKAA_6IlweqMFUfpmecpQPqYMGaqYpGR8lCjZe0JWWAEUbr2JtyYz4E8VaLifd_lAIFSnd97F36lwLNCAtSTt0muxnah54qmzlyK7hNjKU4-Fnxo5G9QGf0RY-tszx7lBRK3s2YVlMcE9N9kbDrTJ8cIl1ue9Vs5psTyxUVTknuFIQj_4yIL6YrSQ2Gbo2HHvFj1Z-ev2hN5nGDlpYCZ7ASbPrqlFZRJyLFSpmk80mOKzd1VmXjcfmOMP06CX9y-B2qHNKktjCvJ3A8kECqtAbBf--Rg6A'],
    price: 9000,
    statuses: [
      {
        type: 'created',
        timestamp: dayjs().subtract(2, 'days'),
      },
    ],
  },
]; 
