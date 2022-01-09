import { Component, Inject, OnInit } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClubMember } from 'src/app/models/club.model';
import { Event, Race, RaceResult, ResultUpdate } from 'src/app/models/event.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-edit-result',
  templateUrl: './edit-result.component.html',
  styleUrls: ['./edit-result.component.scss']
})
export class EditResultComponent implements OnInit {
  doc: RaceResult;
  date!: Date;
  minutes: number;
  seconds: number;
  milliseconds: number;
  races!: Race[];
  race!: Race;
  allMembers!: ClubMember[];
  members!: ClubMember[];

  constructor(
    public dialogRef: MatDialogRef<EditResultComponent>,
    private db: FirestoreService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public docInput: RaceResult
  ) {
    this.doc = {...docInput};
    this.minutes = Math.floor(this.doc.time / 60);
    this.seconds = Math.floor(this.doc.time % 60);
    this.milliseconds = Math.round(this.doc.time % 1 * 100);
    this.db.doc$<Event>('competitions/'+this.doc.eventId).subscribe((doc: Event) => {
      this.date = doc.startDate.toDate();
    });
    this.db.col$<ClubMember>('members', orderBy('firstName')).subscribe((members: ClubMember[]) => {
      members.forEach((member, i) => {
        if(member.DOB) {
          members[i]['age'] = new Date().getFullYear() - member.DOB.toDate().getFullYear();
        }
      });
      this.allMembers = members;
      this.db.col$<Race>('competitions/'+this.doc.eventId+'/range',
      orderBy('date'), orderBy('order')).subscribe((races: Race[]) => {
          this.races = races;
          this.onRaceSelected();
        }
      );
    });
   }

  ngOnInit(): void {
  }

  onRaceSelected() {
    this.race = this.races.find(s => s.id == this.doc.raceId)!;
    this.members = this.allMembers.filter(s => s.age! >= this.race?.minAge! && s.age! <= this.race?.maxAge!
       && this.race?.gender.includes(s.gender));
    this.doc.distance = this.race.distance;
  }

  onMemberSelected() {
    let member = this.members.find(s => s.id == this.doc.memberId);
    this.doc.lastName = member?.lastName!;
    this.doc.firstName = member?.firstName!;
    this.doc.registry = member?.registry!;
    this.doc.distance = this.race.distance!;
  }

  onSubmit(form: NgForm) {
    const resultUpdate: ResultUpdate = {};
    if(this.doc.raceId != this.docInput.raceId) {
      resultUpdate['raceId'] = this.doc.raceId;
    }
    if(this.doc.order != this.docInput.order) {
      resultUpdate['order'] = this.doc.order;
    }
    if(this.doc.memberId != this.docInput.memberId) {
      resultUpdate['memberId'] = this.doc.memberId;
      if(this.doc.memberId) {
        resultUpdate['member'] = this.members.find(s => s.id == this.doc.memberId);
      }
    }
    if(this.doc.lastName != this.docInput.lastName) {
      resultUpdate['lastName'] = this.doc.lastName;
    }
    if(this.doc.firstName != this.docInput.firstName) {
      resultUpdate['firstName'] = this.doc.firstName;
    }
    if(this.doc.registry != this.docInput.registry) {
      resultUpdate['registry'] = this.doc.registry;
    }
    if(this.doc.raceNumber != this.docInput.raceNumber) {
      resultUpdate['raceNumber'] = this.doc.raceNumber;
    }
    if(this.doc.distance != this.docInput.distance) {
      resultUpdate['distance'] = this.doc.distance;
    }
    let time = this.minutes * 60 + this.seconds + this.milliseconds / 100;
    if(time != this.docInput.time) {
      resultUpdate['time'] = time;
    }
    if(Object.keys(resultUpdate).length > 0) {
      this.db.update('competitions/'+this.doc.eventId+'/results/'+this.doc.id, resultUpdate).then(() => {
        this.dialogRef.close();
        this.snack.open('Засагдлаа!', '', {
          duration: 2000
        });
      });
    }
  }

}
