import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WindowService } from 'src/app/services/window.service';
import { Auth, RecaptchaVerifier, signInWithPhoneNumber, UserCredential } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  windowRef: any;
  phoneNumber!: number;
  smsCode!: string;
  codeSent = false;
  user: any;
  loginMethod = 'phone';
  title = 'Утасны дугаараар код хүлээн авч нэвтрэх';
  methodChangeTitle = 'Мэйл, нууц үгээр нэвтрэх';

  constructor(
    private readonly auth: Auth,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly win: WindowService
  ) { }

  ngOnInit(): void {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signinWithPhoneNumber
        this.sendLoginCode();
      }
    }, this.auth)

    this.windowRef.recaptchaVerifier.render()
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

  verifyLoginCode() {
    this.windowRef.confirmationResult
                  .confirm(this.smsCode)
                  .then( (result: any) => {

                    this.user = result.user;
                    console.log(this.user);
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
    }
  }

  changeMethod() {
    if( this.loginMethod == 'phone') {
      this.loginMethod = 'mailPassword';
      this.methodChangeTitle = 'Утасны дугаараар нэвтрэх';
      this.title = 'Мэйл хаяг, нууц үг оруулж нэвтрэх';
    } else {
      this.loginMethod = 'phone';
      this.methodChangeTitle = 'Мэйл, нууц үгээр нэвтрэх';
      this.title = 'Утасны дугаараар код хүлээн авч нэвтрэх';
    }
  }

}
