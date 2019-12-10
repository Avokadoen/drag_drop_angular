import {Component, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {ObjectRetrieverService} from '../shared/object-retriever.service';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {from, Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl} from '@angular/forms';
import {MatDrawer} from '@angular/material/sidenav';
import {DeliveryOverviewData} from '../shared/models/delivery-data';

@Component({
  selector: 'app-internal-dashboard',
  templateUrl: './internal-dashboard.component.html',
  styleUrls: ['./internal-dashboard.component.css']
})
export class InternalDashboardComponent implements OnInit {
  readonly tableData: DeliveryOverviewData[] = [
    {
      organisationId: 'burde',
      deliveryId: 'test',
      timeStamp: '12.12.12T24:12',
    },
    {
      organisationId: 'test',
      deliveryId: 'hello',
      timeStamp: '12.12.12T24:12',
    },
    {
      organisationId: 'test',
      deliveryId: 'world',
      timeStamp: '12.12.12T24:12',
    },
    {
      organisationId: 'test',
      deliveryId: 'nbdelivery',
      timeStamp: '12.12.12T24:12',
    },
    {
      organisationId: 'test',
      deliveryId: 'monkeycode',
      timeStamp: '12.12.12T24:12',
    },
  ];

  readonly tableColumns = ['deliveryId', 'organisationId', 'timeStamp'];

  deliveryDataSource: MatTableDataSource<DeliveryOverviewData> = new MatTableDataSource();

  // TODO: this and delivery list should share paginator, sorting a http behaviour for listing things
  user: string;

  // TODO: validator that takes organisations and makes sure it matches on of the ids loaded
  organisationFormControl = new FormControl('');
  organisationIds: string[];

  @ViewChild(MatDrawer, {static: false})
  drawer: MatDrawer;

  constructor(private route: ActivatedRoute,
              private router: Router,
              // TODO: should be another service which fetch organisations or rename service?
              private objectRetriever: ObjectRetrieverService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.deliveryDataSource = new MatTableDataSource();
    this.deliveryDataSource.data = this.tableData;

    this.route.params.subscribe(params => {
      this.user = params.user;
    });

    this.objectRetriever.getAllOrganisations()
      .pipe(
        startWith(['']),
        catchError(() => {

          this.snackBar.open('failed to retrieve organisations', 'ok', {
            duration: 20000,
          });
          return new Observable<void>();
        })
      ).subscribe(data => {
        if (data) {
          this.organisationIds = data;
          // TODO: this is a terrible hack with race conditions
          this.organisationFormControl.setValue(this.organisationFormControl.value);
        }
    });
  }

  routeToDelivery(deliveryId: string): void  {
    this.router
      .navigate(['delivery-list', deliveryId])
      .catch(e => console.log(`failed to route! error: ${e}`)); // TODO toast
  }

  private toggleDrawer() {
    // TODO: handle this, also this seems to leak
    from(this.drawer.toggle()).pipe(
      switchMap(event => event),
      // TODO: actually handle error
      catchError(err => {
        console.log(err);
        return new Observable<void>();
      })
    );
  }

}



