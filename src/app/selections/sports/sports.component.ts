import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { orderBy } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddSportComponent } from './add-sport/add-sport.component';
import { EditSportComponent } from './edit-sport/edit-sport.component';
import { SportType } from 'src/app/models/sport.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.scss']
})
export class SportsComponent implements OnInit {
  nextOrder!: number;
  columns = ['order', 'acronym', 'title', 'english', 'action'];
  dataSource = new MatTableDataSource<SportType>();
  newDoc: SportType = {
    order: 1,
    title: '',
    acronym: '',
    english: ''
  }

  constructor(
    public matDialog: MatDialog,
    public db: FirestoreService,
    public auth: AuthService,
    private snack: MatSnackBar
    ) {
      this.db.col$<SportType>('selections/events/sports',
      orderBy('order')).subscribe((items: SportType[]) => {
        this.newDoc.order = items.length + 1;
      });
    }

  ngOnInit(): void {
    this.db.col$<SportType>('selections/events/sports',
    orderBy('order')).subscribe((items: SportType[]) => {
      this.dataSource.data = items;
    });
  }

  showAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    // dialogConfig.width = "300px";
    this.matDialog.open(AddSportComponent, dialogConfig);
  }

  showEditDialog(doc: SportType) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = true;
    // dialogConfig.width = "300px";
    this.matDialog.open(EditSportComponent, dialogConfig);
  }

  onSubmit(form: NgForm) {
    this.db.add('selections/events/sports', this.newDoc).then(() => {
      form.resetForm({
        order: this.newDoc.order
      });
      this.snack.open('Нэмэгдлээ!', '', {
        duration: 2000
      });
    });
  }
}
