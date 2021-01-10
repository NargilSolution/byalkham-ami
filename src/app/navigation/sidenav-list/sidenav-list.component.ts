import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth = false;
  isAdmin = false;
  isEditor = false;
  nickname = '';
  public userAuth: Subscription;
  user: User | undefined;

  constructor(public authService: AuthService) {
    this.userAuth = this.authService.user$.subscribe(user => {
      if(user && user.roles) {
        this.user = user;
        if(user.nickname) {
          this.nickname = user.nickname;
        }
        this.isAuth = true;
        this.isAdmin = this.authService.canAdminister(user);
        this.isEditor = this.authService.canEdit(user);
      } else {
        this.nickname = '';
        this.isAuth = false;
        this.isEditor = false;
        this.isAdmin = false;
      }
    });
   }

  ngOnInit() {

  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.authService.logout();
    this.onClose();
  }

  ngOnDestroy() {
    if (this.userAuth) this.userAuth.unsubscribe();
  }

}
