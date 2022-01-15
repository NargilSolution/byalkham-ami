import { Injectable } from '@angular/core';
import {
  Auth,
  user,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
  PhoneAuthProvider,
  GoogleAuthProvider,
  linkWithPhoneNumber,
  onAuthStateChanged
} from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { linkWithPopup } from '@firebase/auth';
import { NewUserData } from 'functions/src/models/user.model';
import { authState } from 'rxfire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators'
import { Profile, Roles, SignupData } from '../models/user.model';
import { CloudService } from './cloud.service';
import { FirestoreService } from './firestore.service';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;
  profile$: Observable<Profile | null>;
  displayName!: string;
  noRoles: Roles = {
    admin: false,
    editor: false,
    subscriber: false,
    manager: false,
    accountant: false,
    coach: false
  };
  roles: Roles = this.noRoles;
  public isAuth = false;
  public isAdmin = false;
  public userId: string | undefined;
  public username: string | undefined;

  constructor(
    private readonly auth: Auth,
    private readonly afs: Firestore,
    private readonly cloud: CloudService,
    private readonly db: FirestoreService
    ) {
      this.user$ = user(auth);
      this.profile$ = user(auth).pipe(
        switchMap(user => {
          this.userId = user ? user.uid : '';
          this.username = '';
          this.isAuth = user ? true : false;
          this.isAdmin = false;
          if(user) {
            this.db.doc$<Profile>('users/'+user.uid).subscribe((doc: Profile) => {
              if(doc) {
                this.username = doc.displayName ? doc.displayName : '';
                this.isAdmin = doc.roles.admin!;
                return {
                  id: user.uid,
                  ...doc
                }
              } {
                return of(null)
              }
            })
            return docData(doc(this.afs, 'users', user.uid)) as Observable<Profile>;
          } else {
            return of(null)
          }
        }
        )
      )
    }

  getUser(): User | null {
    return this.auth.currentUser;
  }

  getUser$(): Observable<User | null> {
    return of(this.getUser());
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signup(signup: SignupData): Promise<UserCredential> {
    try {
      const newUserCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, signup.email, signup.password);

      const uid: string = newUserCredential.user.uid;

      const profileUpdate = await this.cloud.updateAuthProfile({
        uid: uid,
        update: {
          displayName: signup.displayName,
          phoneNumber: '+976' + signup.phoneNumber
        }
      });
      // console.log(profileUpdate);

      let signupCopy: any = {...signup};
      delete signupCopy.password;
      const newProfile: NewUserData = {
        userId: uid,
        ...signupCopy
      }
      const userProfile = await this.cloud.createUserProfile(newProfile);
      // console.log(userProfile);

      return newUserCredential;
    } catch (error) {
      throw error;
    }
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }



  ///// Role-based Authorization //////

  canRead(profile: Profile): boolean {
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(profile, allowed)
  }

  canEdit(profile: Profile): boolean {
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(profile, allowed)
  }

  canDelete(profile: Profile): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(profile, allowed)
  }

  canAdminister(profile: Profile): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(profile, allowed)
  }

  canAssist(profile: Profile): boolean {
    const allowed = ['assistant']
    return this.checkAuthorization(profile, allowed)
  }

  canManageSupport(profile: Profile): boolean {
    const allowed = ['supporter', 'admin']
    return this.checkAuthorization(profile, allowed)
  }

  // determines if user has matching role
  private checkAuthorization(profile: Profile, allowedRoles: string[]): boolean {
    if (!profile) return false
    for (const role of allowedRoles) {
        if ( profile.roles[role] ) {
            return true
        }
    }
    return false
  }
}
