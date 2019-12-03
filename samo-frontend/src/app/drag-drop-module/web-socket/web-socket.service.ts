import {Injectable, OnDestroy} from '@angular/core';
import {RxStomp} from "@stomp/rx-stomp";
import {EntityWsEvent} from "../model/entity-ws-event";
import {NodeChange} from "../model/node-change-event";
import {map, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy{

  private readonly RX_STOMP = new RxStomp();
  private readonly DESTROYED$ = new Subject();

  private currentIndex = 0;
  private timestampCollection: number[] = [0, 0, 0, 0, 0];

  readonly CHANGE$ = new Subject<EntityWsEvent>();

  // TODO: have a request change observer function where we lazy load a new watch if we don't have given url
  // i.e: getObserverFor(url: string)
  constructor() {
    const stompConfig = {
      brokerURL: environment.webSocket,
      reconnectDelay: 200,
    };

    this.RX_STOMP.configure(stompConfig);
    this.RX_STOMP.activate();

    // We don't lazy load this as we always want this connection if the service lives
    this.RX_STOMP.watch('/stomp_broker/work_area').pipe(
      map<any, EntityWsEvent>(function (message) {
        return JSON.parse(message.body);
      }),
      takeUntil(this.DESTROYED$)
    ).subscribe((payload: EntityWsEvent) => {
      if (this.isSelfSentEvent(payload.timestamp)) {
        return;
      }
      this.CHANGE$.next(payload);
    });
  }

  ngOnDestroy(): void {
    this.DESTROYED$.next();
    this.DESTROYED$.complete();
  }

  sendChange(change: NodeChange) {
    const parsedEvent: EntityWsEvent = {
      timestamp:              this.createTimestamp(),
      movingBarcode:          change.movingEntity.barcode,
      previousParentBarcode:  change.currentParent.barcode,
      newParentBarcode:       change.newParent.barcode,
      currentIndex:           change.currentIndex,
      targetIndex:            change.targetIndex,
    };

    this.RX_STOMP.publish({destination: '/app/storage_entity_change', body: JSON.stringify(parsedEvent)});
  }

  private createTimestamp(): number {
    this.currentIndex = this.currentIndex + 1 % 5;
    const newStamp = Math.floor(Date.now() / 1000);
    this.timestampCollection[this.currentIndex] = newStamp;
    return newStamp;
  }

  private isSelfSentEvent(timestamp: number): boolean {
    return this.timestampCollection.indexOf(timestamp) >= 0;
  }

}
