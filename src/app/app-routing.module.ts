import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './auth/admin.guard';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { AthletesComponent } from './athletes/athletes.component';
import { NewsComponent } from './news/news.component';
import { ClubsComponent } from './clubs/clubs.component';
import { EventsComponent } from './events/events.component';
import { UsersComponent } from './admin/users/users.component';
import { InvitedUsersComponent } from './admin/users/invited-users/invited-users.component';
import { InviteUserComponent } from './admin/users/invite-user/invite-user.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { AddEventComponent } from './events/add-event/add-event.component';
import { EventTypesComponent } from './selections/event-types/event-types.component';
import { SportsComponent } from './selections/sports/sports.component';
import { ViewEventComponent } from './events/view-event/view-event.component';
import { EditEventPhotosComponent } from './events/edit-event-photos/edit-event-photos.component';
import { EditEventVideosComponent } from './events/edit-event-videos/edit-event-videos.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard],
  children: [
    { path: 'users', component: UsersComponent},
    { path: 'invited', component: InvitedUsersComponent },
    { path: 'invite', component: InviteUserComponent },
    { path: 'settings', component: SettingsComponent },
  ] },
  // { path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  // { path: 'places', component: PlacesComponent, canActivate: [EditorGuard]},
  // { path: 'sports', component: AdminComponent, canActivate: [EditorGuard]},
  { path: 'event-types', component: EventTypesComponent, canActivate: [AdminGuard] },
  { path: 'sport-types', component: SportsComponent, canActivate: [AdminGuard] },
  { path: 'events', component: EventsComponent },
  { path: 'events/add', component: AddEventComponent, canActivate: [AdminGuard]},
  { path: 'events/:eventId', component: ViewEventComponent, canActivate: [AuthGuard]},
  { path: 'events/:eventId/edit-photos', component: EditEventPhotosComponent, canActivate: [AdminGuard]},
  { path: 'events/:eventId/edit-videos', component: EditEventVideosComponent, canActivate: [AdminGuard]},
  { path: 'athletes', component: AthletesComponent},
  { path: 'news', component: NewsComponent},
  // { path: 'documents', component: DocumentsComponent},
  { path: 'clubs', component: ClubsComponent},
  // { path: 'register', component: RegisterComponent},
  { path: 'signup/:invitationId', component: SignupComponent},
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
