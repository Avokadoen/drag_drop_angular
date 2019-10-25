import {StorageObjectData} from "./storage-object-data";

export interface DeliveryData {
  deliveryId: string;
  objectCount: number;
  storageObjects: StorageObjectData[];
}

export interface DeliveryOverviewData {
  deliveryId: string;
  organisationId: string;
  timeStamp: string;
}

