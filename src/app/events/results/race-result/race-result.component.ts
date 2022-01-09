import { Component, HostListener, Input, OnInit } from '@angular/core';
import { orderBy, where } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { RaceResult } from 'src/app/models/event.model';
import { ColumnDef } from 'src/app/models/table.model';
import { Profile } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { EditResultComponent } from '../edit-result/edit-result.component';
import { ResultPhotoComponent } from '../result-photo/result-photo.component';

@Component({
  selector: 'app-race-result',
  templateUrl: './race-result.component.html',
  styleUrls: ['./race-result.component.scss']
})
export class RaceResultComponent implements OnInit {
  eventId: string;
  user!: Profile | null;
  screenHeight!: number;
  screenWidth!: number;
  columns!: string[];
  columnDefinitions!: ColumnDef[];
  dataSource = new MatTableDataSource<RaceResult>();
  @Input() raceId!: string;
  Math = Math;

  constructor(
    private readonly route: ActivatedRoute,
    public matDialog: MatDialog,
    private db: FirestoreService,
    public auth: AuthService
    ) {
      this.auth.profile$.subscribe(profile => {
        this.user = profile;
      });
      this.eventId = this.route.snapshot.params['eventId'];
    }

    ngOnInit(): void {
      // console.log(this.raceId);
      this.db.col$<RaceResult>('competitions/'+this.eventId+'/results',
      where('raceId', '==', this.raceId), orderBy('order')).subscribe((items: RaceResult[]) => {
          this.dataSource.data = items;
      });
    this.getScreenSize();
}

@HostListener('window:resize', ['$event'])
getScreenSize() {
  this.screenHeight = window.innerHeight;
  this.screenWidth = window.innerWidth;

  this.columnDefinitions = [
    { def: 'face', hide: false},
    { def: 'order', hide: false},
    { def: 'name', hide: false},
    { def: 'number', hide: this.screenWidth < 400},
    { def: 'distance', hide: this.screenWidth < 350},
    { def: 'time', hide: false},
    { def: 'action', hide: !this.user || !this.user.roles.admin}
  ];
  this.getDisplayedColumns()
}

getDisplayedColumns() {
  this.columns = this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
}

showProfilePhoto(doc: RaceResult) {
  if(doc.photoURL) {
    // this.lightbox.open([{
    //   src: doc.photoURL,
    //   caption: doc.lastName + ' ' + doc.firstName,
    //   thumb: doc.faceURL!,
    // }]);
  }
}

showEditDialog(doc: RaceResult) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = doc;
  dialogConfig.disableClose = false;
  this.matDialog.open(EditResultComponent, dialogConfig);
}

showPortraitDialog(doc: RaceResult) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = doc;
  dialogConfig.disableClose = false;
  dialogConfig.width = (this.screenWidth > 600 ? 550 : this.screenWidth - 20) + 'px';
  this.matDialog.open(ResultPhotoComponent, dialogConfig);
}

}
