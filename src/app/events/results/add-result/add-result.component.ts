import { Component, Inject, OnInit } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClubMember } from 'src/app/models/club.model';
import { Event, Race, RaceResult } from 'src/app/models/event.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-add-result',
  templateUrl: './add-result.component.html',
  styleUrls: ['./add-result.component.scss']
})
export class AddResultComponent implements OnInit {
  date!: Date;
  races!: Race[];
  raceId!: string;
  race!: Race;
  allMembers!: ClubMember[];
  memberId!: string;
  members!: ClubMember[];
  lastName!: string;
  firstName!: string;
  registry!: string;
  distance!: number;

  constructor(
    public dialogRef: MatDialogRef<AddResultComponent>,
    private db: FirestoreService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public eventId: string
  ) {
    this.db.doc$<Event>('competitions/'+this.eventId).subscribe((doc: Event) => {
      this.date = doc.startDate.toDate();
    });
    this.db.col$<Race>('competitions/'+this.eventId+'/range',
    orderBy('date'), orderBy('order')).subscribe((races: Race[]) => {
        this.races = races;
      }
    );
    this.db.col$<ClubMember>('members', orderBy('firstName')).subscribe((members: ClubMember[]) => {
      members.forEach((member, i) => {
        if(member.DOB) {
          members[i]['age'] = new Date().getFullYear() - member.DOB.toDate().getFullYear();
        }
      });
      this.allMembers = members;
    });
   }

  ngOnInit(): void {
  }

  onRaceSelected() {
    this.race = this.races.find(s => s.id == this.raceId)!;
    this.members = this.allMembers.filter(s => s.age! >= this.race?.minAge! && s.age! <= this.race?.maxAge!
       && this.race?.gender.includes(s.gender));
    this.distance = this.race.distance;
  }

  onMemberSelected() {
    let member = this.members.find(s => s.id == this.memberId);
    this.lastName = member?.lastName!;
    this.firstName = member?.firstName!;
    this.registry = member?.registry!;
    this.distance = this.race.distance!;
  }

  onSubmit(form: NgForm) {
    const newResult: RaceResult = {
      eventId: this.eventId,
      raceId: this.raceId,
      order: form.value.order,
      memberId: this.memberId || '',
      lastName: this.lastName,
      firstName: this.firstName,
      registry: this.registry,
      raceNumber: form.value.raceNumber,
      distance: form.value.distance,
      time: form.value.minutes * 60 + form.value.seconds + form.value.milliseconds / 100
    };
    if(this.memberId) {
      newResult['member'] = this.members.find(s => s.id == this.memberId);
    }
    this.db.add('competitions/'+this.eventId+'/results', newResult).then(() => {
      let raceIdSelected = this.raceId;
      let distanceInput = this.distance;
      form.resetForm({
        raceId: raceIdSelected,
        distance: distanceInput
      });
      this.snack.open('Нэмэгдлээ!', '', {
        duration: 2000
      });
    });
  }

}
