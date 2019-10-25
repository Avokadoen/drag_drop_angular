import {AfterViewInit, Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {MatCheckbox, MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {StorageObjectData} from '../../shared/models/storage-object-data';
import {ObjectRetrieverService} from '../../shared/object-retriever.service';
import {ControlFormComponent} from '../control-form/control-form.component';
import {MaterialType} from '../../shared/models/material-type.enum';
import {MaterialCondition} from '../../shared/models/material-condition.enum';
import {ContractType} from '../../shared/models/contract-type.enum';
import {ActivatedRoute, Params} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {merge, Observable} from "rxjs";
import {PageEvent} from "@angular/material/paginator";

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

  displayedColumns: string[];

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
              private snackBar: MatSnackBar) {
    this.displayedColumns = this.masterColumnList;
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

    // this.dataSource.sort = this.sort;
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.objectRetrieverService.getDeliveryBatch(this.deliveryId, this.paginator.pageIndex, this.paginator.pageSize)
      }),
      map(data => {
        this.isLoadingResults = false;
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

  private updateDisplayColumns(event: MatCheckboxChange): void {
    const column = event.source.value.split(':')[0];
    const index = parseInt(event.source.value.split(':')[1], 10);
    if (event.checked) {
      this.displayedColumns.splice(index, 0, column);
    } else {
      this.displayedColumns = this.displayedColumns.filter(dc => dc !== column);
    }
  }

  storageObjectSelected(incoming: StorageObjectData) {
    if (this.isLoadingResults) {
      return;
    }

    const dialogRef = this.dialog.open(ControlFormComponent, {
      width: '80vw',
      height: '80vh',
      data: incoming,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      // TODO: change value through a service
      const incomingIndex = this.dataSource.data.findIndex(o => o === incoming);
      this.dataSource.data[incomingIndex] = result;
      this.dataSource._updateChangeSubscription();
    });
  }

  registerNewStorageObject(): void {
    const newStorageObject: StorageObjectData = {
      nbId: '',
      organisationId: '',
      externalId: '',
      materialType: MaterialType.UNSET,
      materialCondition: MaterialCondition.UNSET,
      contractType: ContractType.UNSET,
      collectionTitle: '',
      notice: '',
      containerId: '',
    };

    const dialogRef = this.dialog.open(ControlFormComponent, {
      width: '80vw',
      height: '80vh',
      data: newStorageObject,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      // TODO: change value through a service
      this.dataSource.data.push(result);
      this.dataSource._updateChangeSubscription();
    });
  }
}
