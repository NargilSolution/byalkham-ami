import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Gallery } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { EventVideo } from 'src/app/models/event.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { orderBy } from '@angular/fire/firestore';

@Component({
  selector: 'app-event-videos',
  templateUrl: './event-videos.component.html',
  styleUrls: ['./event-videos.component.scss']
})
export class EventVideosComponent implements OnInit {
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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly db: FirestoreService,
    public gallery: Gallery,
    private lightbox: Lightbox
  ) {
    this.eventId = this.route.snapshot.params['eventId'];
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



}
