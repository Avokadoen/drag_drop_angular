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
}
