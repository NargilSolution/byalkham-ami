import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Subscription, Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class EditorGuard implements CanActivate {
    isAuth = false;
    isAdmin = false;
    authSubscription: Subscription | undefined;

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Observable<boolean> {

        return this.authService.user$.pipe(
            take(1),
            map(user => user && this.authService.canEdit(user) ? true : false),
            tap(isAdmin => {
                if (!isAdmin) {
                    console.log('Access denied - Editor only');
                }
            })
        );
    }
}