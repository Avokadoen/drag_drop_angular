import {
  Component,
  DoCheck,
  EventEmitter,
  Input, IterableDiffer,
  IterableDiffers,
  Output,
} from '@angular/core';
import {EntityWsEvent} from "../../model/entity-ws-event";
import {Observable} from "rxjs";

// TODO: don't save sort events
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements DoCheck {

  // expected to be sorted by oldest to newest
  @Input() eventList: EntityWsEvent[];
  private iterableDiffer: IterableDiffer<EntityWsEvent>;
  private uniqueBarcodes: string[];
  private readonly eventsMapped: Map<string, EntityWsEvent[]>;

  @Input() undoComplete: Observable<EntityWsEvent>;

  @Output()
  undoEvent: EventEmitter<EntityWsEvent>;

  constructor(private _iterableDiffers: IterableDiffers) {
    this.undoEvent      = new EventEmitter<EntityWsEvent>();
    this.eventsMapped   = new Map<string, EntityWsEvent[]>();
    this.uniqueBarcodes = [];
    this.iterableDiffer = _iterableDiffers.find([]).create(null);
  }

  ngDoCheck() {
    const changes = this.iterableDiffer.diff(this.eventList);
    if (changes) {
      const beforeSize = this.eventsMapped.size;
      const allBarcodes = this.eventList.map(event => event.source.barcode);
      this.uniqueBarcodes = [... new Set(allBarcodes)];
      for (const barcode of this.uniqueBarcodes) {
        this.eventsMapped.set(barcode, this.eventList.filter(e => e.source.barcode === barcode));
      }
      const afterSize = this.eventsMapped.size;

      if (Math.abs(afterSize - beforeSize) === 1) {
        console.log('resize!');
      }
    }
  }

  onUndoPressed(event: EntityWsEvent) {
    // remove old event collections
    this.undoEvent.emit(event);
  }

  onUndoComplete(event: EntityWsEvent) {
    const barcode = event.source.barcode;
    if (this.eventsMapped.get(barcode).length === 1) {
      this.eventsMapped.delete(barcode);
      this.uniqueBarcodes = this.uniqueBarcodes.filter(b => b !== barcode);
    }
  }

  getMostRecentEvent(barcode: string): EntityWsEvent {
    const mostRecent = this.eventsMapped.get(barcode).length - 1;
    if (mostRecent < 0) {
      return null;
    }

    return this.eventsMapped.get(barcode)[mostRecent];
  }

  eventFormattedDate(event: EntityWsEvent): string {
    const dateTimestamp = new Date(event.timestamp*1000);
    return dateTimestamp.toDateString();
  }
}
