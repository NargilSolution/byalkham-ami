import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WindowService } from 'src/app/services/window.service';
import { Auth, authState, isSignInWithEmailLink,
  RecaptchaVerifier, sendSignInLinkToEmail,
  signInWithPhoneNumber, UserCredential } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { signInWithEmailLink } from 'firebase/auth';
import { FirestoreService } from 'src/app/services/firestore.service';
import { where } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from 'src/app/models/user.model';

export interface LoginTitles {
  [key: string]: any;
  mailPassword: string;
  phone: string;
  mailLink: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user!: Observable<any>;
  email!: string;
  emailSent = false;
  errorMessage!: string;
  windowRef: any;
  phoneNumber!: number;
  phoneExist = false;
  usedNumber!: number;
  smsCode!: string;
  codeSent = false;
  loginMethod = 'mailPassword';
  method = '';
  methods: LoginTitles = {
    mailPassword: 'Мэйл хаяг, нууц үг оруулж нэвтрэх',
    phone: 'Утасны дугаараар код хүлээн авч нэвтрэх',
    mailLink: 'Мэйл хаягаар тусгай хаяг авч нэвтрэх',
  }
  methodChangeTitle = 'Мэйл, нууц үгээр нэвтрэх';

  constructor(
    private readonly auth: Auth,
    private db: FirestoreService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly win: WindowService,
    private snack: MatSnackBar,
  ) {
    this.auth.languageCode = 'mn'
    if (this.loginMethod) {
      this.method = this.methods[this.loginMethod];
    }
  }

  ngOnInit(): void {
    this.user = authState(this.auth);

    const url = this.router.url;

    this.confirmSignin(url);
  }


  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = '+976'+this.phoneNumber;

    signInWithPhoneNumber(this.auth, num, appVerifier)
            .then(result => {

                this.windowRef.confirmationResult = result;
                this.codeSent = true;

            })
            .catch( error => console.log(error) );

  }

  onPhoneChanged() {
    this.codeSent = false;
    this.phoneExist = false;
    if (this.phoneNumber > 80000000 && this.phoneNumber < 99999999) {
      // check if phone is linked for any user
      this.db.col$<Profile>('users', where('phone', '==', this.phoneNumber)).pipe(take(1)).subscribe(profile => {
        if (profile.length == 1) {
          if (profile[0].phoneLogin) {
            this.phoneExist = true;
          } else {
            this.snack.open('Энэ дугаараар нэвтрэх эрхгүй байна', '', {duration: 3000});
          }
        } else {
          this.snack.open('Утасны дугаар бүртгэлгүй байна', '', {duration: 3000});
        }
      });
    }
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
                  .confirm(this.smsCode)
                  .then( (result: any) => {

                    this.user = result.user;
                    // console.log(this.user);
                    this.router.navigate(['']);

    })
    .catch( (error: any) => console.log(error, "Incorrect code entered?"));
  }

  onSubmit(form: NgForm) {
    if( this.loginMethod == 'phone') {
      this.verifyLoginCode();
    } else if( this.loginMethod == 'mailPassword') {
      this.authService.login(form.value.email, form.value.password)
      .then((cred: UserCredential) => {
        this.router.navigate(['']);
      })
      .catch(err => {
        console.log(err);
      });
    } else if (this.loginMethod == 'mailLink') {
      this.checkEmailExists();

    }
  }

  checkEmailExists() {
    this.db.col$<Profile>('users', where('email', '==', this.email)).pipe(take(1)).subscribe(profile => {
      if (profile.length == 1) {
        this.sendEmailLink();
      } else {
        this.snack.open('Мэйл хаяг бүртгэлгүй байна', '', {duration: 3000});
        this.email = '';
      }
    });
  }

  async sendEmailLink() {
    const actionCodeSettings = {
      url: 'https://auto.nargil.net/login',
      handleCodeInApp: true
    };

    try {
      await sendSignInLinkToEmail(
        this.auth,
        this.email,
        actionCodeSettings
        );
        window.localStorage.setItem('emailForSignIn', this.email);
        this.emailSent = true;
        console.log('email sent');
    } catch (error: any) {
      this.errorMessage = error.message;
    }

  }

  async confirmSignin(url: string) {
    try {
      if (isSignInWithEmailLink(this.auth, url)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Мэйл хаягаа оруулж баталгаажуулна уу');
        }
        const result = signInWithEmailLink(this.auth, email!, url);
        window.localStorage.removeItem('emailForSignIn');
      }
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  changeMethod(loginMethod: string) {
    this.loginMethod = loginMethod;
    this.method = this.methods[this.loginMethod];
    if (this.loginMethod == 'phone') {
      this.windowRef = this.win.windowRef
      this.windowRef.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'normal',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signinWithPhoneNumber
          this.sendLoginCode();
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        }
      }, this.auth);

      this.windowRef.recaptchaVerifier.render();
    }


  }

}
