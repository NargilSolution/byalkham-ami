import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from 'src/app/models/event.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-edit-event-info',
  templateUrl: './edit-event-info.component.html',
  styleUrls: ['./edit-event-info.component.scss']
})
export class EditEventInfoComponent implements OnInit {
  event!: Event;

  constructor(
    private dialogRef: MatDialogRef<EditEventInfoComponent>,
    private db: FirestoreService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public eventId: string
    ) {
      this.db.doc$<Event>('events/'+this.eventId).subscribe(doc => {
        this.event = doc;
      });
     }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.db.update('events/'+this.eventId, {
      info: form.value.info
    }).then(() => {
      form.resetForm();
      this.snack.open('Шинэчлэгдлээ!', '', {
        duration: 2000
      });
      setTimeout(() => {
        this.dialogRef.close();
      }, 500);
    });
  }

}
