import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(
    private router: Router,
    public auth: AuthService
  ) {  }

  ngOnInit(): void {
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  goRouterLink(link: string) {
    this.router.navigate([link]);
  }

  onLogout() {
    this.auth.logout().then(() => {
      this.router.navigate(['']);
    })
  }

}
