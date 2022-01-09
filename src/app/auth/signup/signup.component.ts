import { Component, OnInit } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
  User
} from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UserInvitation } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  invitationId: string;
  newUser!: UserInvitation;
  userEmail = '';
  lastName = '';
  firstName = '';
  displayName = '';
  registry ='';
  user!: User | null;
  isLoading = false;

  constructor(
    route: ActivatedRoute,
    private readonly auth: Auth,
    private db: FirestoreService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.invitationId = route.snapshot.params['invitationId'];
    this.authService.user$.subscribe(user => { this.user = user })
  }

  ngOnInit(): void {

    this.db.doc$<UserInvitation>('invitedUsers/'+this.invitationId).pipe(take(1))
    .subscribe((doc: UserInvitation) => {
      if(doc){
        this.newUser = doc;
        this.userEmail = doc.email;
        if(doc.lastName) {
          this.lastName = doc.lastName;
        }
        if(doc.firstName) {
          this.firstName = doc.firstName;
        }
        if(doc.displayName) {
          this.displayName = doc.displayName;
        }
      }
      this.isLoading = false;
    });
  }

  onNameKeyPress(event: any) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[ЁёҮүӨөА-я-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressAlphanumeric(event: any) {

    var inp = String.fromCharCode(event.keyCode);
    var length = this.registry.length;
    console.log(length);

    if (/[ЁёҮүӨөА-я]/.test(inp) && length < 2) {
      return true;
    } else if(/[0-9]/.test(inp) && length >= 2 && length < 10) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onRegistryChange() {
    // const reg = this.registry.toUpperCase();
    // console.log(reg);
    // const len = reg.length;
    // let numbers = '';
    // let letters = reg.substring(0,2).replace(/[^ЁҮӨА-Я]/g, "");
    // // let letters = reg.substring(0,len > 2 ? 2 : len);
    // // let letters = reg.replace(/[^ЁҮӨА-Я]/g, "");
    // if(len > 2) {
    //   numbers = reg.substring(2, len-1).replace(/[^0-9]/g, "");
    //   // numbers = reg.substring(2, len-1);
    //   console.log(numbers);
    // }
    // console.log(len, letters, numbers);
    this.registry = this.registry.toUpperCase();
    // this.registry = letters + numbers;
  }

  loginWithPassword(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {

  }

  async onSubmit(form: NgForm) {
    console.log('submitting...');
    // this.auth.signup(form.value.email, form.value.password)
    // const loading = await this.loadingCtrl.create();
    try {
      this.isLoading = true;

      await this.authService.signup({
        invitationId: this.invitationId,
        firstName: this.firstName,
        lastName: this.lastName,
        registry: this.registry,
        displayName: this.displayName,
        email: this.userEmail,
        password: form.value.password,
        phoneNumber: form.value.phone,
        roles: this.newUser.roles
      });
      console.log('user created');

      this.isLoading = false;
      this.router.navigateByUrl('');
    } catch (error) {
      // await loading.dismiss();
      // this.displayAlertMessage(error);
      console.log(error);
    }
  }

}
