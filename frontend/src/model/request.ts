import type { Status } from './status'
import type { Category } from './category';
import { IdType } from './misc';

export interface Request {
  id: IdType;
  authorId: IdType;
  title: string;
  description: string;
  category: Category;
  address: string;
  price: number;
  statuses: Status[];
  photos: string[];
}
