import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase/app';

import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Observable } from 'rxjs';
import { ClubMember } from 'src/app/models/club.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RaceResult } from 'src/app/models/event.model';
import { StorageService } from 'src/app/services/storage.service';
import { deleteField } from '@angular/fire/firestore';

@Component({
  selector: 'app-result-photo',
  templateUrl: './result-photo.component.html',
  styleUrls: ['./result-photo.component.scss']
})
export class ResultPhotoComponent implements OnInit {
  @ViewChild('fileInput') inputFile!: ElementRef;
  profileSrc!: SafeResourceUrl;
  faceSrc!: SafeResourceUrl;
  portraitFile!: File;
  thumbFile!: File;
  faceFile!: File;
  portraitFileName!: string;
  faceFileName!: string;
  portraitExtension!: string;
  faceExtension!: string;
  photoURL!: string;
  thumbURL!: string;
  faceURL!: string;
  uploadPercent!: Observable<number | undefined>;
  downloadURL!: Observable<string>;
  loading = false;
  photoAvailable = false;
  memberPhotoChosen = false;
  member!: ClubMember;

  constructor(
    public dialogRef: MatDialogRef<ResultPhotoComponent>,
    private auth: AuthService,
    private db: FirestoreService,
    private cs: StorageService,
    private snack: MatSnackBar,
    private readonly sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public doc: RaceResult
  ) {
    if(doc.photoURL) {
      this.profileSrc = doc.photoURL;
    }
    if(doc.faceURL) {
      this.faceSrc = doc.faceURL;
    }
    // Check member photo
    if(this.doc.memberId) {
      this.db.doc$<ClubMember>('members/'+this.doc.memberId).subscribe((member: ClubMember) => {
        if(member.photoURL && member.faceURL) {
          this.photoAvailable = true;
          this.member = member;
        }
      });
    }
  }

  ngOnInit(): void {
  }

  getMemberPhoto() {
    this.profileSrc = this.member.photoURL!;
    this.faceSrc = this.member.faceURL!;
    this.memberPhotoChosen = true;
  }

  deleteProfilePhoto() {
    this.cs.delete(this.doc.photoURL!).then(() => {
      this.db.update('competitions/'+this.doc.eventId+'/results/'+this.doc.id, {
        photoURL: deleteField()
      }).then(() => {
        this.profileSrc = '';
      });
    });
  }

  deleteFacePhoto() {
    this.cs.delete(this.doc.faceURL!).then(() => {
      this.db.update('competitions/'+this.doc.eventId+'/results/'+this.doc.id, {
        faceURL: deleteField()
      }).then(() => {
        this.faceSrc = '';
      });
    });
  }

  onPortraitChange(event: any) {
    const file = event.target.files[0];
    this.portraitFile = file;
    this.portraitFileName = file.name;
    this.portraitExtension = file.name.split('.').pop()!;
    this.profileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
    // Create thumbnail
    this.resizeImage(file, 100).then((res: File) => {
      this.thumbFile = res;
    });
  }

  onFaceChange(event: any) {
    const file = event.target.files[0];
    this.faceFile = file;
    this.faceFileName = file.name;
    this.faceExtension = file.name.split('.').pop()!;
    this.faceSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
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
          }, 'image/jpeg', 0.9);
        }
      }
    });
  }

  uploadPhoto() {
    this.loading = true;

    if(this.memberPhotoChosen) {

      this.db.update('competitions/'+this.doc.eventId+'/results/'+this.doc.id, {
        // uploadedBy: this.user.nickname,
        // uploadedId: this.user.id,
        uploadedAt: new Date(),
        photoURL: this.member.photoURL,
        faceURL: this.member.faceURL
      }).then(() => {
        this.loading = false
        this.snack.open('Зураг хадгалагдлаа!', '', {duration: 2000});
      });

    } else {

      const storageName = this.doc.registry + '.' + this.portraitExtension;
      const faceName = this.doc.registry + '.' + this.faceExtension;

      // Upload original file
      this.cs.upload('portraits', storageName, this.portraitFile).then(fileURL => {
        this.photoURL = fileURL;
        this.cs.upload('portrait_thumbs', storageName, this.thumbFile).then(thumbURL => {
          this.thumbURL = thumbURL;
          this.cs.upload('faces', storageName, this.faceFile).then(faceURL => {
            this.faceURL = faceURL;
            this.db.update('competitions/'+this.doc.eventId+'/results/'+this.doc.id, {
              // uploadedBy: this.user.nickname,
              // uploadedId: this.user.id,
              uploadedAt: new Date(),
              photoURL: this.photoURL,
              thumbURL: this.thumbURL,
              faceURL: this.faceURL
            }).then(() => {
              this.loading = false
              this.snack.open('Зураг хадгалагдлаа!')
            });
          });

        });

      });
      // const filePath = '/portraits/' + storageName;
      // const fileRef = this.storage.ref(filePath);
      // const task = this.storage.upload(filePath, this.portraitFile);
      // this.uploadPercent = task.percentageChanges();
      // task.snapshotChanges().pipe(
      //   finalize(() => {
      //     fileRef.getDownloadURL().subscribe(url => {
      //       this.photoURL = url;
      //     });
      //     // Upload thumbnail file
      //     const thumbPath = '/portrait_thumbs/' + storageName;
      //     const thumbRef = this.storage.ref(thumbPath);
      //     const thumbTask = this.storage.upload(thumbPath, this.thumbFile);
      //     this.uploadPercent = thumbTask.percentageChanges();
      //     thumbTask.snapshotChanges().pipe(
      //       finalize(() => {
      //         thumbRef.getDownloadURL().subscribe(url => {
      //           this.thumbURL = url;
      //         });
      //         // Upload face file
      //         const facePath = '/faces/' + faceName;
      //         const faceRef = this.storage.ref(facePath);
      //         const faceTask = this.storage.upload(facePath, this.faceFile);
      //         this.uploadPercent = faceTask.percentageChanges();
      //         faceTask.snapshotChanges().pipe(
      //           finalize(() => {
      //             faceRef.getDownloadURL().subscribe(url => {
      //               this.faceURL = url;
      //               this.db.update('competitions/'+this.doc.eventId+'/results/'+this.doc.id, {
      //                 uploadedBy: this.user.nickname,
      //                 uploadedId: this.user.id,
      //                 uploadedAt: new Date(),
      //                 photoURL: this.photoURL,
      //                 thumbURL: this.thumbURL,
      //                 faceURL: this.faceURL
      //               }).then(() => {
      //                 this.loading = false
      //                 this.snack.open('Зураг хадгалагдлаа!')
      //               });
      //             });
      //           })
      //         ).subscribe();
      //       })
      //     ).subscribe();
      //   })
      // ).subscribe();
    }
  }

}
