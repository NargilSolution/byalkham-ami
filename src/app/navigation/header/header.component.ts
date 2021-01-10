import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth = false;
  isAdmin = false;
  isEditor = false;
  nickname = '';
  public userAuth: Subscription;

  constructor( public auth: AuthService, public router: Router) {
    this.userAuth = this.auth.user$.subscribe(user => {
      if(user && user.roles){
        if(user.nickname) {
          this.nickname = user.nickname;
        }
        this.isAuth = true;
        this.isAdmin = this.auth.canAdminister(user);
        this.isEditor = this.auth.canEdit(user);
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

  goRouterLink(link: string){
    this.router.navigate([link]);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.auth.logout();
  }

  ngOnDestroy() {
    if (this.userAuth) this.userAuth.unsubscribe();
  }


}
