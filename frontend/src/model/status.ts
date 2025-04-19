import type { IdType, DateType } from "./misc";

export interface StatusBase {
  type: string;
  timestamp: DateType; // TODO: решить в каком формате передавать дату (Unix Timestamp / ISO 8601)
}

export interface CreatedStatus extends StatusBase {
  type: 'created';
}

export interface PriceOfferStatus extends StatusBase {
  type: 'price_offer';
  userId: IdType;
  price: number;
} 

export interface PriceAcceptStatus extends StatusBase {
  type: 'price_accept';
  userId: IdType;
}

export interface DateOfferStatus extends StatusBase {
  type: 'date_offer';
  userId: IdType;
  date: DateType;
}

export interface DateAcceptStatus extends StatusBase {
  type: 'date_accept';
  userId: IdType;
}

export interface ClosedStatus extends StatusBase {
  type: 'closed';
  userId: IdType;
  success: boolean;
}

export type Status = CreatedStatus | PriceOfferStatus | PriceAcceptStatus | DateOfferStatus | DateAcceptStatus | ClosedStatus;
