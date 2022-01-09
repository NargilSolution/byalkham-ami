import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Event, Race } from 'src/app/models/event.model';
import { ActivatedRoute } from '@angular/router';
import { AddResultComponent } from './add-result/add-result.component';
import { AuthService } from 'src/app/services/auth.service';
import { orderBy } from '@angular/fire/firestore';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  eventId: string;
  event!: Event;
  races!: Race[];
  @Input() hideTitle!: boolean;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    public matDialog: MatDialog,
    private db: FirestoreService,
    public auth: AuthService
    ) {
      this.auth.profile$.subscribe(profile => {
        this.isAdmin = profile ? profile.roles.admin! : false;
      })
      this.eventId = this.route.snapshot.params['eventId'];
      this.db.doc$<Event>('events/'+this.eventId).subscribe((doc: Event) => {
        this.event = doc;
      });
      this.db.col$<Race>('events/'+this.eventId+'/range',
      orderBy('date'), orderBy('order')).subscribe((items: Race[]) => {
          this.races = items;
        }
      );
  }

  ngOnInit(): void {

  }

  showAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.eventId;
    dialogConfig.disableClose = false;
    this.matDialog.open(AddResultComponent, dialogConfig);
  }

}

