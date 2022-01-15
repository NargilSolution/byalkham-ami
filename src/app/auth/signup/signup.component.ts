import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Roles, UserInvitation } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  invitation!: UserInvitation | {};
  numberInvited = false;
  isLoading = false;
  roles: Roles = {
    admin: false,
    editor: false,
    subscriber: true,
    manager: false,
    accountant: false
  }

  constructor(
    route: ActivatedRoute,
    private db: FirestoreService,
    public auth: AuthService,
    private readonly router: Router
  ) {  }

  ngOnInit(): void {

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

  checkPhoneNumber(phone: number) {
    if (phone > 80000000 && phone < 99999999) {
      this.db.doc$<UserInvitation>('invitedUsers/'+phone).pipe(take(1))
      .subscribe((doc: UserInvitation) => {
        if(doc){
          this.invitation = doc;
          this.numberInvited = true;
        } else {
          this.invitation = {};
          this.numberInvited = false;
        }
      });
    }
  }


  loginWithPassword(email: string, password: string) {
    this.auth.login(email, password);
  }


  async onSubmit(form: NgForm) {
    console.log('submitting...');
    // this.auth.signup(form.value.email, form.value.password)
    // const loading = await this.loadingCtrl.create();
    try {
      this.isLoading = true;

      await this.auth.signup({
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        registry: form.value.registry,
        displayName: form.value.displayName,
        email: form.value.userEmail,
        password: form.value.password,
        phoneNumber: form.value.phone,
        roles: this.roles
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
