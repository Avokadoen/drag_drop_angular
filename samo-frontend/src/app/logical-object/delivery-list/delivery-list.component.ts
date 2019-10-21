import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {MatCheckbox, MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {StorageObjectData} from '../../models/storage-object-data';
import {ObjectRetrieverService} from '../../services/object-retriever.service';
import {ControlFormComponent} from '../control-form/control-form.component';
import {MaterialType} from '../../models/material-type.enum';
import {MaterialCondition} from '../../models/material-condition.enum';
import {ContractType} from '../../models/contract-type.enum';
import {ActivatedRoute, Params} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-delivery-object-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit, AfterViewInit {

  masterColumnList: string[] = [
    'nbId', 'externalId', 'materialType', 'materialCondition',
    'contractType', 'collectionTitle', 'containerId'
  ];

  displayedColumns: string[];

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort: MatSort;
  @ViewChildren(MatCheckbox)
  checkboxes: MatCheckbox[];

  dataSource: MatTableDataSource<StorageObjectData>;

  constructor(private dialog: MatDialog,
              private objectRetrieverService: ObjectRetrieverService,
              private route: ActivatedRoute,
              private _snackBar: MatSnackBar) {
    this.displayedColumns = this.masterColumnList;
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.handleParamsChange(params));
  }

  ngAfterViewInit(): void {
    this.checkboxes.forEach(c => c.change.subscribe(v => this.tableColumnChange(v)));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private handleParamsChange(params: Params) {
    // TODO: loading indication?
    if (!params.id) {
      return;
    }
    this.objectRetrieverService.getDeliveryBatch(params.id, 0, 5).subscribe(batch => {
      this.dataSource = new MatTableDataSource(batch);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      if (!environment.production) {
        console.log('failed to retrieve delivery');
        console.log(error);
      }

      let errorMessage = 'an error has occurred';
      if (error instanceof ErrorEvent) {
        errorMessage = error.message;
      }

      this._snackBar.open(errorMessage, 'ok', {
        duration: 20000,
      });
    });
  }

  private tableColumnChange(event: MatCheckboxChange): void {
    const column = event.source.value.split(':')[0];
    const index = parseInt(event.source.value.split(':')[1], 10);
    if (event.checked) {
      this.displayedColumns.splice(index, 0, column);
    } else {
      this.displayedColumns = this.displayedColumns.filter(dc => dc !== column);
    }
  }

  storageObjectSelected(incoming: StorageObjectData) {
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
