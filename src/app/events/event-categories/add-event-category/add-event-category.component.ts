import { Component, Inject, OnInit } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventCategory } from 'src/app/models/event.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-add-event-category',
  templateUrl: './add-event-category.component.html',
  styleUrls: ['./add-event-category.component.scss']
})
export class AddEventCategoryComponent implements OnInit {
  nextOrder!: number;

  constructor(
    public dialogRef: MatDialogRef<AddEventCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public eventId: string,
    private db: FirestoreService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.db.col$<EventCategory>('events/'+this.eventId+'/categories',
    orderBy('order')).subscribe((items: EventCategory[]) => {
      this.nextOrder = items.length + 1;
    });
  }

  onSubmit(form: NgForm) {
    const newCategory: EventCategory = {
      order: form.value.order,
      title: form.value.title
    };
    this.db.add('events/'+this.eventId+'/categories', newCategory).then(() => {
      this.snack.open('Нэмэгдлээ!', '', {
        duration: 2000
      });
    });
  }

}
