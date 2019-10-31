import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-http-table',
  templateUrl: './http-table.component.html',
  styleUrls: ['./http-table.component.css']
})
export class HttpTableComponent<T> implements OnInit {

  @Input()
  datasource: MatTableDataSource<T>;

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

  isLoadingResults: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  /**
   * this function will update the data source and stop the component from indicate loading
    * @param data the data used to update the data source
   */
  public updateData(data: T[]): void {
    this.datasource.data = data;
    this.isLoadingResults = false;
  }

  private handlePaginate(event: PageEvent) {
    this.isLoadingResults = true;
    this.onPaginate.emit(event);
  }

}
