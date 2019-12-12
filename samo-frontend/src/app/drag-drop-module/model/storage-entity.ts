import {EntityType} from './entity-type.enum';
import {ElementRef} from '@angular/core';

export interface DisplayStorageEntity {
  barcode: string;
  entityType: EntityType;
  children: StorageEntity[] | DisplayStorageEntity[];
  containerElementRefCache?: ElementRef<Element>;
  hideChildren?: boolean;
  alias?: string;
}

export enum FindMode {
  SPECIFIC,
  PARENT,
}

export function findNode(targetBarcode: string, currentTreeNode: DisplayStorageEntity, findMode: FindMode): DisplayStorageEntity | null {
  switch (findMode) {
    case FindMode.SPECIFIC:
      if (currentTreeNode.barcode === targetBarcode) {
        return currentTreeNode;
      }
      break;

    case FindMode.PARENT:
      if (currentTreeNode.children.findIndex(c => c.barcode === targetBarcode) >= 0) {
        return currentTreeNode;
      }
      break;

    default:
      console.error('findNode() got unknown FindMode');
      return null;
  }

  for (const child of currentTreeNode.children) {
    const found = findNode(targetBarcode, child, findMode);
    if (found != null) {
      return found;
    }
  }

  return null;
}

/**
 * can be used for ui elements that has some custom behaviour. i.e delete list
 */
export interface UtilityStorageEntity {
  barcode: string;
  entityType: EntityType.LOCATION;
  children: [];
  containerElementRefCache?: ElementRef<Element>;
  hideChildren: boolean;
  alias: string;
}

export interface StorageEntity {
  barcode: string;
  entityType: EntityType;
  children: StorageEntity[] | DisplayStorageEntity[];
}

export interface StorageEntityMeta {
  barcode: string;
  entityType: EntityType;
}

