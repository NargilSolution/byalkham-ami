import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private authService: AuthService) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {

        return this.authService.profile$.pipe(
            take(1),
            map(user => user && user.roles.admin ? true : false),
            tap(isAdmin => {
                if (!isAdmin) {
                    console.log('Access denied - Admin only');
                }
            })
        );
    }
}
