import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SportType, SportTypeUpdate } from 'src/app/models/sport.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-edit-sport',
  templateUrl: './edit-sport.component.html',
  styleUrls: ['./edit-sport.component.scss']
})
export class EditSportComponent implements OnInit {
  doc: SportType;

  constructor(
    public dialogRef: MatDialogRef<EditSportComponent>,
    public db: FirestoreService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public docInput: SportType
  ) {
    this.doc = {...docInput};
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const sportUpdate: SportTypeUpdate = {};
    if(this.doc.order != this.docInput.order) {
      sportUpdate['order'] = this.doc.order;
    }
    if(this.doc.title != this.docInput.title) {
      sportUpdate['title'] = this.doc.title;
    }
    if(this.doc.acronym != this.docInput.acronym) {
      sportUpdate['acronym'] = this.doc.acronym;
    }
    if(this.doc.english != this.docInput.english) {
      sportUpdate['english'] = this.doc.english;
    }

    if(Object.keys(sportUpdate).length != 0) {
      this.db.update('selections/events/sports/'+this.doc.id, sportUpdate).then(() => {
        this.snack.open('Засагдлаа!', '', {
          duration: 2000
        });
      });
    }
  }

}
