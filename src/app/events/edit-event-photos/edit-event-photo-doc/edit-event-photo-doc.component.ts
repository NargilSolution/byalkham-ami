import { Component, Inject, OnInit } from '@angular/core';
import { orderBy, where } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { EventCategory, EventPhoto, EventPhotoUpdate } from 'src/app/models/event.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-edit-event-photo-doc',
  templateUrl: './edit-event-photo-doc.component.html',
  styleUrls: ['./edit-event-photo-doc.component.scss']
})
export class EditEventPhotoDocComponent implements OnInit {
  eventId: string;
  doc: EventPhoto;
  categoryId: string;
  date: Date;
  categories!: EventCategory[];

  constructor(
    public dialogRef: MatDialogRef<EditEventPhotoDocComponent>,
    private db: FirestoreService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public docInput: EventPhoto) {
      this.doc = {...this.docInput};
      this.eventId = this.doc.eventId;
      this.categoryId = this.doc.category.id!;
      this.date = this.doc.date.toDate();
      this.db.col$<EventCategory>('events/'+this.eventId+'/categories',
      orderBy('order')).subscribe((categories: EventCategory[]) => {
        this.categories = categories;
      });

    }

  ngOnInit(): void {
  }

  onCategorySelected() {
    // console.log(this.doc.category.id);
    this.db.col$('events/'+this.eventId+'/photos',
    where('category.id', '==', this.doc.category.id))
    .pipe(take(1)).subscribe(items => { this.doc.order = items.length + 1});
  }

  onSubmit() {
    let updateObj: EventPhotoUpdate = {};
    if(this.categoryId != this.docInput.category.id) {
      updateObj['category'] = this.categories.find(s => s.id == this.categoryId);
    }
    if(this.doc.title != this.docInput.title) {
      updateObj['title'] = this.doc.title;
    }
    if(this.doc.order != this.docInput.order) {
      updateObj['order'] = this.doc.order;
    }
    if(this.date.getTime() != this.docInput.date.toDate().getTime()) {
      updateObj['date'] = this.date;
    }
    // console.log(updateObj);
    // return;
    this.db.update('events/'+this.eventId+'/photos/'+this.doc.id, updateObj).then(() => {
      this.snack.open('Засагдлаа!', '', {duration: 2000});
    });
  }

}
