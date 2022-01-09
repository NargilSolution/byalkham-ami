import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { orderBy } from '@angular/fire/firestore';
import { AddEventTypeComponent } from './add-event-type/add-event-type.component';
import { EventType } from 'src/app/models/event.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditEventTypeComponent } from './edit-event-type/edit-event-type.component';

@Component({
  selector: 'app-event-types',
  templateUrl: './event-types.component.html',
  styleUrls: ['./event-types.component.scss']
})
export class EventTypesComponent implements OnInit {
  nextOrder!: number;
  columns = ['order', 'title', 'english', 'includes', 'action'];
  dataSource = new MatTableDataSource<EventType>();
  newEventType: EventType = {
    order: 1,
    title: '',
    english: '',
    hasPhotos: false,
    hasVideos: false,
    hasSchedule: false
  }

  constructor(
    public matDialog: MatDialog,
    public db: FirestoreService,
    public auth: AuthService,
    private snack: MatSnackBar
    ) {
      this.db.col$<EventType>('selections/events/types',
      orderBy('order')).subscribe((items: EventType[]) => {
        this.newEventType.order = items.length + 1;
      });
    }

  ngOnInit(): void {
    this.db.col$<EventType>('selections/events/types',
    orderBy('order')).subscribe((items: EventType[]) => {
      this.dataSource.data = items;
    });
  }

  showAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    // dialogConfig.width = "300px";
    this.matDialog.open(AddEventTypeComponent, dialogConfig);
  }

  showEditDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    // dialogConfig.width = "300px";
    this.matDialog.open(EditEventTypeComponent, dialogConfig);
  }

  onSubmit() {
    this.db.add('selections/events/types', this.newEventType).then(() => {
      this.snack.open('Нэмэгдлээ!', '', {
        duration: 2000
      });
    });
  }
}
