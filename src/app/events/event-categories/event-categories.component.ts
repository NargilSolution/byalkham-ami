import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventCategory } from 'src/app/models/event.model';
import { AddEventCategoryComponent } from './add-event-category/add-event-category.component';
import { orderBy } from '@angular/fire/firestore';

@Component({
  selector: 'app-event-categories',
  templateUrl: './event-categories.component.html',
  styleUrls: ['./event-categories.component.scss']
})
export class EventCategoriesComponent implements OnInit {
  eventId: string;
  columns = ['order', 'title', 'action'];
  dataSource = new MatTableDataSource<EventCategory>();

  constructor(
    public matDialog: MatDialog,
    public db: FirestoreService,
    public auth: AuthService,
    private route: ActivatedRoute
    ) {
      this.eventId = this.route.snapshot.params['eventId'];
    }

  ngOnInit(): void {
    this.db.col$<EventCategory>('events/'+this.eventId+'/categories',
    orderBy('order')).subscribe((items: EventCategory[]) => {
      this.dataSource.data = items;
    });
  }

  showAddDialog(taskId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = taskId;
    dialogConfig.disableClose = true;
    dialogConfig.width = "300px";
    this.matDialog.open(AddEventCategoryComponent, dialogConfig);
  }
}
