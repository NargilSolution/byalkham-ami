import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Gallery } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { Event, EventVideo } from 'src/app/models/event.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { orderBy, where } from '@angular/fire/firestore';
import { StorageService } from 'src/app/services/storage.service';
import { EditEventVideoDocComponent } from './edit-event-video-doc/edit-event-video-doc.component';

@Component({
  selector: 'app-edit-event-videos',
  templateUrl: './edit-event-videos.component.html',
  styleUrls: ['./edit-event-videos.component.scss']
})
export class EditEventVideosComponent implements OnInit {
  gap=5;
  cols=5;
  gridHeight=100;
  gridWidth=177.7;
  imgHeight=100;
  screenHeight!: number;
  screenWidth!: number;
  videos!: EventVideo[];
  eventId: string;
  fileName!: string;
  title!: string;
  youtubeId!: string;
  date = new Date();
  order = 1;
  thumbFile!: File;
  thumbSrc!: SafeResourceUrl;
  thumbSize!: number;
  thumbURL!: string;
  loading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly db: FirestoreService,
    private readonly sanitizer: DomSanitizer,
    private readonly cs: StorageService,
    public gallery: Gallery,
    private lightbox: Lightbox,
    private readonly snack: MatSnackBar,
    private readonly matDialog: MatDialog
  ) {
    this.eventId = this.route.snapshot.params['eventId'];
    this.db.doc$<Event>('events/'+this.eventId).subscribe(event => {
      // console.log(event.startDate.toDate());
      if(event && event.startDate) { this.date = event.startDate.toDate()}
    });
    this.db.col$<EventVideo>('events/'+this.eventId+'/videos',
    orderBy('order')).subscribe((videos: EventVideo[]) => {
      this.videos = videos;
      const galleryRef = this.gallery.ref(this.eventId);
      galleryRef.reset();
      videos.forEach(video => {
        galleryRef.addYoutube({
          src: video.youtubeId
        });
      });

      this.order = videos.length + 1;

    });
    this.getScreenSize();

   }

   @HostListener('window:resize', ['$event'])
   getScreenSize() {
     this.screenHeight = window.innerHeight;
     this.screenWidth = window.innerWidth;
    if(this.screenWidth > 500) {
      this.gridWidth = 150;
      this.cols = Math.floor(this.screenWidth / (this.gridWidth+this.gap));
    } else {
      this.gridWidth = 130;
      this.cols = Math.floor(this.screenWidth / (this.gridWidth+this.gap));
    }
   }

  ngOnInit(): void {
  }

  showImagePreview(galleryId: string, i: number) {
    this.lightbox.open(i, galleryId, {
      panelClass: 'fullscreen'
    });
  }

  showEditDialog(doc: EventVideo) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = false;
    this.matDialog.open(EditEventVideoDocComponent, dialogConfig);
  }

  askToDelete(doc: EventVideo) {
    // console.log(doc);
    let snackBarRef = this.snack.open(doc.title+' зураг устгах уу?', 'Тийм', { duration: 3000});

    // Delete doc and photos on action
    snackBarRef.onAction().subscribe(() => {
      // console.log('The snackbar action was triggered!');
      if(!doc.thumbURL) {
        this.db.delete('events/'+this.eventId+'/videos/'+doc.id).then(() => {
          this.snack.open('Бүртгэл устгагдлаа!', '', { duration: 2000});
        });
      } else {
        this.cs.delete(doc.thumbURL).then(() => {
          this.db.delete('events/'+this.eventId+'/videos/'+doc.id).then(() => {
            this.snack.open('Бүртгэл устгагдлаа!', '', { duration: 2000});
          });
        });
      }
    });
  }

  // Get thumbnail
  onThumbChange(event: any) {
    this.thumbFile = event.target.files[0];
    const ext = this.thumbFile.name.split('.').pop();
    this.fileName = this.thumbFile.name.replace('.'+ext!, '');
    this.thumbSize = Math.round(this.thumbFile.size/1024 * 100) / 100;
    this.thumbSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.thumbFile));
  }

  uploadPhoto(form: NgForm) {
    this.loading = true;
    this.db.add('events/'+this.eventId+'/videos', {
      date: this.date,
      order: this.order,
      title: this.title || '',
      youtubeId: this.youtubeId,
      isUploaded: false
    }).then((doc: any) => {
      // console.log(doc.id);

      // Upload original file
      this.cs.upload('events/'+this.eventId, this.fileName+'_thumb', this.thumbFile).then(thumbURL => {
        this.thumbURL = thumbURL;
        this.db.update('events/'+this.eventId+'/videos/'+doc.id, {
          eventId: this.eventId,
          thumbURL: this.thumbURL,
          thumbSize: this.thumbSize,
          isUploaded: true
        }).then(() => {
          this.fileName = '';
          this.thumbSrc = '';
          this.title = '';
          this.youtubeId = '';
          this.order = this.order + 1;
          this.loading = false;
          });
      });

    });
  }

}
