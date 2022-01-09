import { Component, OnInit } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event, EventType, Sport } from 'src/app/models/event.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  types!: EventType[];
  sports!: Sport[];
  startDate!: Date;
  endDate!: Date;
  dateRange!: string;
  status = 'planned';

  constructor(
    private dialogRef: MatDialogRef<AddEventComponent>,
    private db: FirestoreService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.db.col$<EventType>('selections/events/types', orderBy('title')).subscribe((types: EventType[]) => {
      this.types = types;
    });
    this.db.col$<Sport>('selections/events/sports', orderBy('title')).subscribe((sports: Sport[]) => {
      this.sports = sports;
    });
  }

  onDateSelected() {
    if(this.startDate && this.endDate) {
      const sMonth = this.startDate.getMonth()+1 < 10 ? '0'+(this.startDate.getMonth()+1) : ''+(this.startDate.getMonth()+1);
      const sDay = this.startDate.getDate() < 10 ? '0'+this.startDate.getDate() : ''+this.startDate.getDate();
      const eDay = this.endDate.getDate() < 10 ? '0'+this.endDate.getDate() : ''+this.endDate.getDate();
      if(this.startDate.getTime() == this.endDate.getTime()) {
        this.dateRange = this.startDate.getFullYear()+'.'+sMonth+'.'+sDay;
        console.log(this.dateRange);
      } else {
        this.dateRange = this.startDate.getFullYear()+'.'+sMonth+'.'+sDay+'-'+eDay;
        console.log(this.dateRange);
      }
    }
  }

  onSubmit(form: NgForm) {
    const newEvent: Event = {
      typeId: form.value.typeId,
      type: this.types.find(s => s.id == form.value.typeId)!.title,
      name: form.value.name,
      englishName: form.value.englishName,
      startDate: this.startDate,
      endDate: this.endDate,
      dateRange: this.dateRange,
      place: form.value.place,
      organizer: form.value.organizer,
      status: form.value.status,
      resultAvailable: false,
      pdfAvailable: false,
      hasChanges: false,
      isCanceled: false
    };
    this.db.add('events', newEvent).then(() => {
      form.resetForm();
      this.snack.open('Нэмэгдлээ!', '', {
        duration: 2000
      });
      setTimeout(() => {
        this.dialogRef.close();
      }, 500);
    });
  }

}
