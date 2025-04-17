import type { IdType, DateType } from './misc';

export enum Role {
  Admin = 'admin',
  Client = 'client',
}

export interface User {
  id: IdType;
  fullname: string;
  role: Role;
  phone: string;
  creationDate: DateType;
  editDate: DateType;
}
