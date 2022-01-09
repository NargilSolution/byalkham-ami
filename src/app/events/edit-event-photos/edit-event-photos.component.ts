import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Gallery } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Event, EventCategory, EventPhoto, PhotoGallery } from 'src/app/models/event.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditEventPhotoDocComponent } from './edit-event-photo-doc/edit-event-photo-doc.component';
import { orderBy, where } from '@angular/fire/firestore';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-edit-event-photos',
  templateUrl: './edit-event-photos.component.html',
  styleUrls: ['./edit-event-photos.component.scss']
})
export class EditEventPhotosComponent implements OnInit {
  gap=5;
  cols=5;
  gridHeight=100;
  gridWidth=177.7;
  imgHeight=100;
  screenHeight!: number;
  screenWidth!: number;
  categories!: EventCategory[];
  categoryId!: string;
  photos!: EventPhoto[];
  galleries: PhotoGallery[] = [];
  eventId: string;
  fileName!: string;
  storageFileName!: string;
  title!: string;
  date = new Date();
  selectedDate = new Date();
  order = 1;
  file!: File;
  thumbFile!: File;
  previewFile!: File;
  src!: SafeResourceUrl;
  thumbSrc!: SafeResourceUrl;
  originalSize!: number;
  previewSize!: number;
  thumbSize!: number;
  originalURL!: string;
  previewURL!: string;
  thumbURL!: string;
  uploadPercent!: Observable<number | undefined>;
  downloadURL!: Observable<string>;
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

        if (this.categoryId) {
          this.order = photos.filter(s => s.category.id == this.categoryId).length + 1;
        }

      });
    });
    this.getScreenSize();

   }

   @HostListener('window:resize', ['$event'])
   getScreenSize() {
     this.screenHeight = window.innerHeight;
     this.screenWidth = window.innerWidth;
     // console.log(this.screenWidth);
    if(this.screenWidth > 500) {
      this.gridWidth = 150;
      this.cols = Math.floor(this.screenWidth / (this.gridWidth+this.gap));
    } else {
      this.gridWidth = 130;
      this.cols = Math.floor(this.screenWidth / (this.gridWidth+this.gap));
    }
    // console.log(this.cols);
   }

  ngOnInit(): void {
  }

  showImagePreview(galleryId: string, i: number) {
    this.lightbox.open(i, galleryId, {
      panelClass: 'fullscreen'
    });
  }

  showEditDialog(doc: EventPhoto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = false;
    this.matDialog.open(EditEventPhotoDocComponent, dialogConfig);
  }

  askToDelete(doc: EventPhoto) {
    // console.log(doc);
    let snackBarRef = this.snack.open(doc.title+' зураг устгах уу?', 'Тийм', { duration: 3000});

    // Delete doc and photos on action
    snackBarRef.onAction().subscribe(() => {
      // console.log('The snackbar action was triggered!');
      if(!doc.originalURL && !doc.previewURL && !doc.thumbURL) {
        this.db.delete('events/'+this.eventId+'/photos/'+doc.id).then(() => {
          this.snack.open('Зураг устгагдлаа!', '', { duration: 2000});
        });
      } else {
        this.cs.delete(doc.originalURL).then(() => {
          this.cs.delete(doc.previewURL).then(() => {
            this.cs.delete(doc.thumbURL).then(() => {
              this.db.delete('events/'+this.eventId+'/photos/'+doc.id).then(() => {
                this.snack.open('Зураг устгагдлаа!', '', { duration: 2000});
              });
            });
          });
        });
      }
    });
  }

  onCategorySelected(form: NgForm) {
    // console.log(form.value.categoryId);
    this.db.col$('events/'+this.eventId+'/photos',
    where('category.id', '==', this.categoryId))
    .pipe(take(1)).subscribe(items => { this.order = items.length + 1});
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
    const ext = this.file.name.split('.').pop();
    this.fileName = this.file.name.replace('.'+ext!, '');
    this.originalSize  = Math.round(this.file.size/1024 * 100) / 100;
    // console.log(this.originalSize);
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.file));
    // Create preview
    this.resizeImage(this.file, 1800).then((res: File) => {
      this.previewFile = res;
      this.previewSize = Math.round(res.size/1024 * 100) / 100;
      // console.log(this.previewSize);
    });
  }

  // Get thumbnail
  onThumbChange(event: any) {
    this.thumbFile = event.target.files[0];
    this.thumbSize = Math.round(this.thumbFile.size/1024 * 100) / 100;
    this.thumbSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.thumbFile));
  }

  uploadPhoto(form: NgForm) {
    this.loading = true;
    const category: EventCategory = this.categories.find(s => s.id == this.categoryId)!;
    this.db.add('events/'+this.eventId+'/photos', {
      date: this.date,
      category: category,
      order: this.order,
      title: this.title || '',
      isUploaded: false
    }).then((doc: any) => {
      // console.log(doc.id);

      // Upload original file
      this.cs.upload('events/'+this.eventId, this.fileName, this.file).then(fileURL => {
        this.originalURL = fileURL;
        this.cs.upload('events/'+this.eventId, this.fileName+'_preview', this.previewFile).then(previewURL => {
          this.previewURL = previewURL;
          this.cs.upload('events/'+this.eventId, this.fileName+'_thumb', this.thumbFile).then(thumbURL => {
            this.thumbURL = thumbURL;
            this.db.update('events/'+this.eventId+'/photos/'+doc.id, {
              eventId: this.eventId,
              originalURL: this.originalURL,
              orignalSize: this.originalSize,
              previewURL: this.previewURL,
              previewSize: this.previewSize,
              thumbURL: this.thumbURL,
              thumbSize: this.thumbSize,
              isUploaded: true
            }).then(() => {
              this.fileName = '';
              this.src = '';
              this.thumbSrc = '';
              this.title = '';
              this.order = this.order + 1;
              this.loading = false;
              });
          });
        });
      });

    });
  }

  resizeImage(file: File, maxSide: number ) {
    return new Promise<File>((resolve, reject) => {
      const fileName = file.name;
      const extension = file.name.split('.').pop();
      const name = fileName.substring(0, fileName.length - 1 - extension?.length!);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (ev) => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const height = img.naturalHeight;
          const width = img.naturalWidth;
          // Changed size
          var resize_width = maxSide;
          var resize_heigth = maxSide;
          if(height < width) {
            resize_heigth = height*maxSide/width;
          } else {
            resize_width = width*maxSide/height;
          }
          const elem = document.createElement('canvas');
          elem.width = resize_width;
          elem.height = resize_heigth;
          const ctx = elem.getContext('2d');
          ctx?.drawImage(img, 0, 0, resize_width, resize_heigth);
          ctx?.canvas.toBlob((blob) => {
            const resizedFile = new File([blob!], name+'_'+maxSide+'.'+extension, {
              type: 'image/jpeg',
              lastModified: Date.now(),

            });
            // console.log(Math.round(resizedFile.size/1024 * 100) / 100);
            // this.thumbSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(resizedFile));
            resolve(resizedFile);
          }, 'image/jpeg', 1);
        }
      }
    });
  }

}
