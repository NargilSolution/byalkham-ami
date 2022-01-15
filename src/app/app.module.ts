import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angularfire
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';

// Services
import { AuthService } from './services/auth.service';
import { AdminGuard } from './auth/admin.guard';
import { EditorGuard } from './auth/editor.guard';
import { WindowService } from './services/window.service';

// Material & Style Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './modules/angular-material.module';

// Additional Modules
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { YouTubePlayerModule } from "@angular/youtube-player";
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from  'ng-gallery/lightbox';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './admin/users/users.component';
import { InviteUserComponent } from './admin/users/invite-user/invite-user.component';
import { ViewUserComponent } from './admin/users/view-user/view-user.component';
import { EditUserComponent } from './admin/users/edit-user/edit-user.component';
import { DeleteUserComponent } from './admin/users/delete-user/delete-user.component';
import { InvitedUsersComponent } from './admin/users/invited-users/invited-users.component';
import { NewsComponent } from './news/news.component';
import { AthletesComponent } from './athletes/athletes.component';
import { ClubsComponent } from './clubs/clubs.component';
import { EventsComponent } from './events/events.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { AddEventComponent } from './events/add-event/add-event.component';
import { MatDatepicker } from '@angular/material/datepicker';
// Events
import { SportsComponent } from './selections/sports/sports.component';
import { EventTypesComponent } from './selections/event-types/event-types.component';
import { EventStatusesComponent } from './selections/event-statuses/event-statuses.component';
import { EditEventComponent } from './events/edit-event/edit-event.component';
import { DeleteEventComponent } from './events/delete-event/delete-event.component';
import { AddEventTypeComponent } from './selections/event-types/add-event-type/add-event-type.component';
import { EditEventTypeComponent } from './selections/event-types/edit-event-type/edit-event-type.component';
import { AddSportComponent } from './selections/sports/add-sport/add-sport.component';
import { EditSportComponent } from './selections/sports/edit-sport/edit-sport.component';
import { ViewEventComponent } from './events/view-event/view-event.component';
import { EditEventPhotosComponent } from './events/edit-event-photos/edit-event-photos.component';
import { EditEventPhotoDocComponent } from './events/edit-event-photos/edit-event-photo-doc/edit-event-photo-doc.component';
import { EventCategoriesComponent } from './events/event-categories/event-categories.component';
import { AddEventCategoryComponent } from './events/event-categories/add-event-category/add-event-category.component';
import { EventTitleComponent } from './events/event-title/event-title.component';
// Event Gallery
import { EventPhotosComponent } from './events/event-photos/event-photos.component';
// results
import { ResultsComponent } from './events/results/results.component';
import { AddResultComponent } from './events/results/add-result/add-result.component';
import { EditResultComponent } from './events/results/edit-result/edit-result.component';
import { RaceResultComponent } from './events/results/race-result/race-result.component';
import { ResultPhotoComponent } from './events/results/result-photo/result-photo.component';
import { EditEventInfoComponent } from './events/edit-event-info/edit-event-info.component';
import { EditEventVideosComponent } from './events/edit-event-videos/edit-event-videos.component';
import { EventVideosComponent } from './events/event-videos/event-videos.component';
import { EditEventVideoDocComponent } from './events/edit-event-videos/edit-event-video-doc/edit-event-video-doc.component';
import { AuthGuard } from './auth/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    AdminComponent,
    UsersComponent,
    InviteUserComponent,
    ViewUserComponent,
    EditUserComponent,
    DeleteUserComponent,
    InvitedUsersComponent,
    NewsComponent,
    AthletesComponent,
    ClubsComponent,
    EventsComponent,
    SettingsComponent,
    AddEventComponent,
    SportsComponent,
    EventTypesComponent,
    AddEventTypeComponent,
    EventStatusesComponent,
    EditEventComponent,
    DeleteEventComponent,
    EditEventTypeComponent,
    AddSportComponent,
    EditSportComponent,
    ViewEventComponent,
    EditEventPhotosComponent,
    EditEventPhotoDocComponent,
    EventCategoriesComponent,
    AddEventCategoryComponent,
    EventTitleComponent,
    EventPhotosComponent,
    ResultsComponent,
    AddResultComponent,
    EditResultComponent,
    RaceResultComponent,
    ResultPhotoComponent,
    EditEventInfoComponent,
    EditEventVideosComponent,
    EventVideosComponent,
    EditEventVideoDocComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    FlexLayoutModule,
    AngularMaterialModule,
    NgxMaterialTimepickerModule,
    YouTubePlayerModule,
    GalleryModule,
    LightboxModule
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    AuthService,
    AdminGuard,
    EditorGuard,
    AuthGuard,
    MatDatepicker,
    WindowService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
