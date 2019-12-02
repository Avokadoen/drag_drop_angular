import {AfterViewInit, Component, ViewChild, ViewChildren} from '@angular/core';
import {MatCheckbox, MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {partialCreateStorageObjectData, StorageObjectData} from '../../shared/models/storage-object-data';
import {ObjectRetrieverService} from '../../shared/object-retriever.service';
import {ControlFormComponent} from '../control-form/control-form.component';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError, map, mergeMap, startWith, switchMap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {BreakpointObserver} from "@angular/cdk/layout";
import {isEqual} from "../../shared/functions/equality";

/* sources:
* mobile friendly table: https://stackblitz.com/edit/angular-mohmt5-y88uhq?file=app%2Ftable-basic-example.ts
* */

// TODO: @donts arrays sorting should be filtered with a pipe instead of functions
// TODO: @donts breakpointObserver should be used in a interior class=

@Component({
  selector: 'app-delivery-object-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements AfterViewInit {

  masterColumnList: string[] = [
    'nbId', 'externalId', 'materialType', 'materialCondition',
    'contractType', 'collectionTitle', 'containerId'
  ];

  displayedSettingsColumns: string[];
  displayColumns: string[];
  isNarrow = false;

  @ViewChild(MatPaginator, {static: false})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: false})
  sort: MatSort;

  @ViewChildren(MatCheckbox)
  checkboxes: MatCheckbox[];

  dataSource: MatTableDataSource<StorageObjectData>  = new MatTableDataSource();
  isLoadingResults = true;
  deliveryId: string;

  constructor(private dialog: MatDialog,
              private objectRetrieverService: ObjectRetrieverService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              breakpointObserver: BreakpointObserver) {
    this.displayedSettingsColumns = this.masterColumnList;

    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayColumns = result.matches ?
        ['nbId', 'materialType'] :
        this.displayedSettingsColumns;
      this.isNarrow = result.matches;
    });
  }


  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.deliveryId = params.id;
      this.paginator.page.emit(new PageEvent())
    });

    const checkBoxEvents = this.checkboxes.map(check => check.change.asObservable());
    merge(... checkBoxEvents).subscribe(change  => {
      this.updateDisplayColumns(change)
    });
    // TODO: backend sort
    // this.dataSource.sort = this.sort;
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.objectRetrieverService.getDeliveryBatch(this.deliveryId, this.paginator.pageIndex, this.paginator.pageSize)
      }),
      map(data => {
        this.paginator.length = data.objectCount;
        return data.storageObjects;
      }),
      catchError(() => {
        this.isLoadingResults = false;

        this.snackBar.open('failed to retrieve page', 'ok', {
          duration: 20000,
        });

        return new Observable<void>();
      })
    ).subscribe(data => {
      this.isLoadingResults = false;
      if (data) {
        this.dataSource.data = data
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // TODO: remove this functionality
  private updateDisplayColumns(event: MatCheckboxChange): void {
    const column = event.source.value.split(':')[0];
    const index = parseInt(event.source.value.split(':')[1], 10);
    if (event.checked) {
      this.displayedSettingsColumns.splice(index, 0, column);
    } else {
      this.displayedSettingsColumns = this.displayedSettingsColumns.filter(dc => dc !== column);
    }

    if (!this.isNarrow) {
      this.displayColumns = this.displayedSettingsColumns;
    }
  }

  storageObjectSelected(refSO: StorageObjectData) {
    if (this.isLoadingResults) {
      return;
    }

    const dialogRef = this.dialog.open(ControlFormComponent, {
      width: '80vw',
      height: '80vh',
      data: refSO,
      disableClose: true,
    });

    dialogRef.afterClosed().pipe(
      mergeMap(newSO => {
        if (!newSO || isEqual(newSO, refSO)) {
          return new Observable<void>();
        }
        const refIndex = this.dataSource.data.findIndex(o => o === refSO);
        const oldSO = this.dataSource.data[refIndex];
        this.dataSource.data[refIndex] = newSO;
        this.dataSource._updateChangeSubscription();
        return this.objectRetrieverService.updateObject(oldSO, (<StorageObjectData>newSO));
      })
      ).subscribe(e => console.log(e));
  }

  registerNewStorageObject(): void {
    //  TODO: if length == 0
    const refSO = this.dataSource.data[0];

    const newStorageObject = partialCreateStorageObjectData(refSO);

    const dialogRef = this.dialog.open(ControlFormComponent, {
      width: '80vw',
      height: '80vh',
      data: newStorageObject,
      disableClose: true,
    });

    dialogRef.afterClosed().pipe(
      mergeMap(newSO => {
        if (!(<StorageObjectData>newSO)) {
          return new Observable<void>();
        }
        console.log(newSO);
        return this.objectRetrieverService.registerObject((<StorageObjectData>newSO));
      }),
      catchError(err => err),
    ).subscribe(result => {
      console.log(result);
    });
  }

}
