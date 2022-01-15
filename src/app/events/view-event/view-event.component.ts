import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Event, EventPhoto, EventVideo } from 'src/app/models/event.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { EditEventInfoComponent } from '../edit-event-info/edit-event-info.component';
import { ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewEventComponent implements OnInit {
  screenHeight!: number;
  screenWidth!: number;
  eventId: string;
  event!: Event;
  photoCount!: number;
  videoCount!: number;
  modules = {

    'toolbar': [
      ['bold', 'italic', 'underline'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

      [{ 'align': [] }],

      ['clean']                                         // remove formatting button

    ]
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly db: FirestoreService,
    public matDialog: MatDialog,
    public readonly auth: AuthService
    ) {
      this.eventId = this.route.snapshot.params['eventId'];
      this.db.doc$<Event>('events/'+this.eventId).subscribe(event => {
        this.event = event;
      });
      this.db.col$<EventPhoto>('events/'+this.eventId+'/photos')
      .subscribe((photos: EventPhoto[]) => {
        this.photoCount = photos.length;
      });
      this.db.col$<EventVideo>('events/'+this.eventId+'/videos')
      .subscribe((videos: EventVideo[]) => {
        this.videoCount = videos.length;
      });

      this.getScreenSize();
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize() {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
    }
    @HostListener('contextmenu', ['$event'])
    onRightClick(event: any) {
      event.preventDefault();
    }

  ngOnInit(): void {
  }

  editInfoDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.eventId;
    dialogConfig.disableClose = false;
    dialogConfig.width = this.screenWidth*0.8 + 'px';
    this.matDialog.open(EditEventInfoComponent, dialogConfig);
  }

}
