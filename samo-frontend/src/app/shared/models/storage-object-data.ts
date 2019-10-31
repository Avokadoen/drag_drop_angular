import {MaterialType} from './material-type.enum';
import {MaterialCondition} from './material-condition.enum';
import {ContractType} from './contract-type.enum';

export interface StorageObjectData {
  nbId: string;
  organisationId: string;
  externalId: string;
  // TODO  creator?
  // TODO rename materialType to materialCategory
  /* Plate, bånd, kasset */
  materialType: MaterialType;
  materialCondition: MaterialCondition;
  contractType: ContractType;
  collectionTitle: string;
  notice: string;
  containerId: string;
  deliveryId: string;
}

export function partialCreateStorageObjectData(prototype: StorageObjectData): StorageObjectData {
  return {
    nbId: '',
    organisationId: prototype.organisationId,
    externalId: '',
    materialType: prototype.materialType,
    materialCondition: prototype.materialCondition,
    contractType: prototype.contractType,
    collectionTitle: prototype.collectionTitle,
    notice: '',
    containerId: prototype.containerId,
    deliveryId: prototype.deliveryId,
  };
}
