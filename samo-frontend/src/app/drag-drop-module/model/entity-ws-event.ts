export interface EntityWsEvent {
  timestamp:              number;
  movingBarcode:          string;
  previousParentBarcode:  string;
  newParentBarcode:       string;
  currentIndex:           number;
  targetIndex:            number;
}

