import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnDef } from 'src/app/models/table.model';
import { Event } from '../models/event.model';
import { AddEventComponent } from './add-event/add-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { Router } from '@angular/router';
import { SportType } from '../models/sport.model';
import { DeleteEventComponent } from './delete-event/delete-event.component';
import { orderBy } from '@angular/fire/firestore';
import { Profile } from '../models/user.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, AfterViewInit {
  screenHeight!: number;
  screenWidth!: number;
  isMobile = false;
  columns!: string[];
  showFilter = false;
  columnDefinitions!: ColumnDef[];
  dataSource = new MatTableDataSource<Event>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public matDialog: MatDialog,
    private db: FirestoreService,
    public auth: AuthService,
    private router: Router
    ) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    // console.log(this.screenHeight, this.screenWidth);

    this.columnDefinitions = [
      { def: 'name', hide: false},
      { def: 'type', hide: this.screenWidth < 500},
      { def: 'date',hide: this.screenWidth < 600},
      { def: 'place', hide: this.screenWidth < 700},
      { def: 'organizer', hide: this.screenWidth < 800},
      { def: 'medals', hide: true},
      { def: 'action', hide: false}
    ];
    this.getDisplayedColumns()
  }

  getDisplayedColumns() {
    this.columns = this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
  }


  ngOnInit(): void {
    this.db.col$<Event>('events', orderBy('startDate', 'desc')).subscribe(
      (items: Event[]) => {
        this.dataSource.data = items;
      }
    );

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewCompetition(doc: Event) {
    this.router.navigate(['events/'+doc.id]);
  }

  viewRange(doc: Event) {
    this.router.navigate(['events/'+doc.id+'/range']);
  }

  viewPhotos(doc: Event) {
    this.router.navigate(['events/'+doc.id+'/photos']);
  }

  viewApplication(doc: Event) {
    this.router.navigate(['events/'+doc.id+'/application']);
  }

  showEditDialog(doc: Event) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = false;
    dialogConfig.width = (this.screenWidth > 800 ? 700 : this.screenWidth - 20) + 'px';
    this.matDialog.open(EditEventComponent, dialogConfig);
  }

  eventResults(doc: Event) {
    this.router.navigate(['events/'+doc.id+'/results']);
  }
  editEventPhotos(doc: Event) {
    this.router.navigate(['events/'+doc.id+'/edit-photos']);
  }
  editEventVideos(doc: Event) {
    this.router.navigate(['events/'+doc.id+'/edit-videos']);
  }

  showAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = (this.screenWidth > 800 ? 500 : this.screenWidth - 12) + 'px';
    this.matDialog.open(AddEventComponent, dialogConfig);
  }

  showDeleteDialog(doc: Event) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = false;
    this.matDialog.open(DeleteEventComponent, dialogConfig);
  }

}

