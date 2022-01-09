import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/models/event.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-event-title',
  templateUrl: './event-title.component.html',
  styleUrls: ['./event-title.component.scss']
})
export class EventTitleComponent implements OnInit {
  eventId: string;
  event!: Event;

  constructor(
    private route: ActivatedRoute,
    private db: FirestoreService
  ) {
    this.eventId = this.route.snapshot.params['eventId'];
    this.db.doc$<Event>('events/'+this.eventId).subscribe((doc: Event) => {
      this.event = doc;
    });
  }

  ngOnInit(): void {
  }

}
