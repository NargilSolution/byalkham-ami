import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthData } from './auth-data.model';
import { Roles, User } from './user.model';

export interface NewUser {
    roles: Roles;
    name: string;
    email: string;
    code: string;
    date?: Date;
    html: string;
}

export interface RegData {
    lastName: string;
    firstName: string;
    nickname: string;
    phone: number;
    position?: string;
    email: string;
    password: string;
    roles: Roles;
    hint?: string;
    registered?: Date;
}

@Injectable()
export class AuthService {
    user$: Observable<User>;
    authChange = new Subject<boolean>();
    private isAuthenticated = false;
    public userId = '';
    public user: User | undefined;

    constructor(
        private auth: AngularFireAuth, 
        private afs: AngularFirestore, 
        private fns: AngularFireFunctions,
        private router: Router,
    ) {
        this.user$ = this.auth.authState.pipe(
            switchMap(user => {
                if(user) { 
                    this.userId = user.uid;
                    return afs.doc<User | any>(`users/${user.uid}`).snapshotChanges().pipe(map(doc => {
                        this.isAuthenticated = true;
                        this.user = {id: user.uid,
                            ...doc.payload.data()}
                        return {
                            id: user.uid,
                            ...doc.payload.data()
                        }
                    }));
                } else {
                    return of(null);
                }
            })
        )
        
    }


    async googleSignin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const credential = await this.auth.signInWithPopup(provider);
        console.log(credential.user?.email);
        console.log(credential.user?.uid);
        // Check if email is accepted
        if(credential.user) {
            const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${credential.user.uid}`);
            console.log(userRef);
        }

        return this.updateUserData(credential.user);
      }

    private updateUserData(user: any) {
        // Sets user data to firestore on login
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    
        const data = { 
          uid: user.uid, 
          email: user.email, 
          displayName: user.displayName, 
          photoURL: user.photoURL
        } 
    
        return userRef.set(data, { merge: true })
    
    }

  ///// Role-based Authorization //////

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(user, allowed)
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(user, allowed)
  }

  canDelete(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  canAdminister(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  canAssist(user: User): boolean {
    const allowed = ['assistant']
    return this.checkAuthorization(user, allowed)
  }

  canManageSupport(user: User): boolean {
    const allowed = ['supporter', 'admin']
    return this.checkAuthorization(user, allowed)
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
        if ( user.roles && user.roles[role] ) {
            return true
        }
    }
    return false
  }

    inviteUser(newUser: NewUser) {
        const userRef = this.afs.collection('invitedUsers').doc(newUser.email);
        userRef.get()
            .subscribe(docSnapshot => {
                // console.log(docSnapshot.data());
                if (!docSnapshot.exists) {
                    this.afs.collection('invitedUsers').doc(newUser.email).set(newUser);
                } else {
                    alert('Хэрэглэгч уригдсан байна');
                }
        });
        
    }


    createUser(regData: RegData) {
        
        this.auth.createUserWithEmailAndPassword(regData.email, regData.password)
        .then((credential: any) => {
            if(credential){
                this.postUserProfile(credential.user.uid, regData).subscribe((result: any) => {
                    if(result) {
                        console.log('User created');
                        this.router.navigate(['']);
                    }
                });
              }
        })
        .catch(error => {
            console.log(error);
        });
    }

    postUserProfile(uid: string, profile: RegData){
        const callable = this.fns.httpsCallable('createUserProfile');
        return callable({
            uid: uid,
            ...profile
        });
    }

    login(authData: AuthData) {
        this.auth
        .signInWithEmailAndPassword(authData.email, authData.password)
        .then( result => {
            this.router.navigate(['']);
        })
        .catch(error => {
            console.log(error);
        });
    }

    logout() {
        this.router.navigate(['']);
        this.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }
}