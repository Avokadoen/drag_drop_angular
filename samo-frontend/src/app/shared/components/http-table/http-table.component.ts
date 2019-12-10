import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatDialog} from '@angular/material/dialog';
import {ObjectRetrieverService} from '../../object-retriever.service';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BreakpointObserver} from '@angular/cdk/layout';
import {SelectTableRowArrayPipe} from '../../pipes/select-table-row-array.pipe';

// TODO: refactor 2 arrays required to display table using pipe, if this was called in html we
//  would have pipe in 3 different locations in the html

// TODO: this might introduce too much complexity (remove | implement)

@Component({
  selector: 'app-http-table',
  templateUrl: './http-table.component.html',
  styleUrls: ['./http-table.component.css']
})
export class HttpTableComponent<T> implements OnInit {

  @Input()
  dataSource: MatTableDataSource<T>;

  /**
  * used to render tables on screens larger than 600px
  * */
  @Input()
  largeTableColumns: string[];

  /**
   * used to render tables on screens less than 600px
   * */
  @Input()
  smallTableColumns: string[];

  /**
   * event emitted on pagination request
   * */
  @Output()
  onPaginate: EventEmitter<PageEvent> = new EventEmitter();

  /**
   * event emitted when element clicked
   * */
  @Output()
  onElementSelected: EventEmitter<T> = new EventEmitter();

  @ViewChild(MatPaginator, {static: false})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: false})
  sort: MatSort;

  @ViewChildren(MatCheckbox)
  checkboxes: MatCheckbox[];

  isLoadingResults = true;
  screenWidth: number;
  displayColumns: string[];
  selectTableRowArrayPipe = new SelectTableRowArrayPipe();

  constructor() {
    this.onResize();
  }
  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.displayColumns
      = this.selectTableRowArrayPipe.transform(this.largeTableColumns, this.smallTableColumns, window.innerWidth);
  }

  /**
   * this function will update the data source and stop the component from indicate loading
    * @param data the data used to update the data source
   */
  public updateData(data: T[]): void {
    this.dataSource.data = data;
    this.isLoadingResults = false;
  }

  private handlePaginate(event: PageEvent) {
    this.isLoadingResults = true;
    this.onPaginate.emit(event);
  }

}
