import { Component, HostListener, Input, OnInit } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Gallery } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { Event, EventCategory, PhotoGallery, EventPhoto } from 'src/app/models/event.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-event-photos',
  templateUrl: './event-photos.component.html',
  styleUrls: ['./event-photos.component.scss']
})
export class EventPhotosComponent implements OnInit {
  gap=5;
  cols=4;
  gridHeight=100;
  gridWidth=133.3;
  imgHeight=100;
  screenHeight!: number;
  screenWidth!: number;
  categories!: EventCategory[];
  photos!: EventPhoto[];
  galleries: PhotoGallery[] = [];
  eventId: string;
  event!: Event;
  @Input() hideTitle!: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly db: FirestoreService,
    public gallery: Gallery,
    private lightbox: Lightbox,
    public auth: AuthService
    ) {
    this.eventId = this.route.snapshot.params['eventId'];
    this.db.doc$<Event>('events/'+this.eventId).subscribe(event => {
      this.event = event;
    });
    this.db.col$<EventCategory>('events/'+this.eventId+'/categories',
    orderBy('order')).subscribe((categories: EventCategory[]) => {
      this.categories = categories;

      this.db.col$<EventPhoto>('events/'+this.eventId+'/photos',
      orderBy('order')).subscribe((photos: EventPhoto[]) => {
        this.photos = photos;
        // Prepare separe albums for each category
        this.galleries = [];
        categories.forEach(category => {
          const galleryRef = this.gallery.ref(category.id);
          galleryRef.reset();
          let galleryPhotos = photos.filter(s => s.category.id == category.id);
          galleryPhotos.forEach(photo => {
            galleryRef.addImage({
              src: photo.previewURL,
              thumb: photo.thumbURL,
              title: photo.title
            });
          });
          this.galleries.push({
            id: category.id,
            title: category.title,
            order: category.order,
            photos: galleryPhotos
          });
        });

      });
    });
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth - 85;
    // console.log(this.screenWidth);
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

  downloadImage(doc: EventPhoto) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', doc.originalURL);
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    link.remove();

    // window.open(doc.originalURL);
  }
}
