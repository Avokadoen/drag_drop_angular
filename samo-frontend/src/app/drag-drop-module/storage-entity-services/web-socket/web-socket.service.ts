import {Injectable, OnDestroy} from '@angular/core';
import {RxStomp} from '@stomp/rx-stomp';
import {EntityWsEvent, isEntityWsEvent} from '../../model/entity-ws-event';
import {isNodeChange, NodeChange} from '../../model/node-change-event';
import {map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

  private readonly RX_STOMP = new RxStomp();
  private readonly DESTROYED$ = new Subject();

  private currentIndex = 0;
  private timestampCollection: number[] = [0, 0, 0, 0, 0];

  readonly CHANGE$ = new Subject<EntityWsEvent>();
  readonly CREATED$ = new Subject<EntityWsEvent>();

  private readonly EVENT_LIST: EntityWsEvent[];
  private readonly MOVE_URI = '/app/storage_entity_move';
  private readonly CREATE_URI = '/app/storage_entity_create';

  public get getEventList(): EntityWsEvent[] {
    return this.EVENT_LIST;
  }

  // TODO: have a request change observer function where we lazy load a new watch if we don't have given url
  // i.e: getObserverFor(url: string)
  constructor() {
    // TODO: preallocate?
    this.EVENT_LIST = [];

    const stompConfig = {
      brokerURL: environment.webSocket,
      reconnectDelay: 200,
    };

    this.RX_STOMP.configure(stompConfig);
    this.RX_STOMP.activate();

    // TODO: watchCreator() builds this subscription based on url and subject
    // We don't lazy load this as we always want this connection if the service lives
    this.RX_STOMP.watch('/stomp_broker/work_area_move').pipe(
      map<any, EntityWsEvent>((message) => {
        // always use JSON.parse for optimization
        return JSON.parse(message.body);
      }),
      takeUntil(this.DESTROYED$)
    ).subscribe((payload: EntityWsEvent) => {
      this.handleUndo(payload);
      if (this.isSelfSentEvent(payload.timestamp)) {
        return;
      }
      this.CHANGE$.next(payload);
    });

    this.RX_STOMP.watch('/stomp_broker/work_area_create').pipe(
      map<any, EntityWsEvent>((message) => {
        return JSON.parse(message.body);
      }),
      takeUntil(this.DESTROYED$)
    ).subscribe((payload: EntityWsEvent) => {
      this.handleUndo(payload);
      if (this.isSelfSentEvent(payload.timestamp)) {
        return;
      }
      this.CREATED$.next(payload);
    });
  }

  ngOnDestroy(): void {
    this.DESTROYED$.next();
    this.DESTROYED$.complete();
  }

  sendMove(movingEntity: NodeChange, isUndo: boolean = false) {
    this.sendWsEvent(movingEntity, this.MOVE_URI, isUndo);
  }

  sendCreate(newEntity: NodeChange, isUndo: boolean = false) {
    this.sendWsEvent(newEntity, this.CREATE_URI, isUndo);
  }

  private sendWsEvent(event: NodeChange, uri: string, isUndo: boolean) {
    const parsedEvent: EntityWsEvent =
        {
          timestamp:              this.createTimestamp(),
          source:                 { barcode: event.movingEntity.barcode, entityType: event.movingEntity.entityType },
          currentParentBarcode:   event.currentParent?.barcode,
          newParentBarcode:       event.newParent.barcode,
          wasUndoEvent:           isUndo,
        };

    this.RX_STOMP.publish({destination: uri, body: JSON.stringify(parsedEvent)});
  }

  private handleUndo(payload: EntityWsEvent) {
    if (payload.wasUndoEvent) {
      const index = this.EVENT_LIST
        .findIndex(e => e.source.barcode === payload.source.barcode
          && e.currentParentBarcode === payload.newParentBarcode
          && e.newParentBarcode === payload.currentParentBarcode);
      this.EVENT_LIST.splice(index,1);
    } else {
      this.EVENT_LIST.push(payload);
    }
  }

  public createTimestamp(): number {
    this.currentIndex = this.currentIndex + 1 % 5;
    const newStamp = Math.floor(Date.now() / 1000);
    this.timestampCollection[this.currentIndex] = newStamp;
    return newStamp;
  }

  private isSelfSentEvent(timestamp: number): boolean {
    return this.timestampCollection.indexOf(timestamp) >= 0;
  }

}
