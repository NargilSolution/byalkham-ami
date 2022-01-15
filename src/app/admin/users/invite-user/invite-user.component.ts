import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Firestore, where } from '@angular/fire/firestore';
import { Roles, UserInvitation } from 'src/app/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService } from 'src/app/services/firestore.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit {
  roles: Roles = {
    admin: false,
    editor: false,
    subscriber: true,
    manager: false,
    accountant: false,
    coach: false
  };

  constructor(
    private readonly afs: Firestore,
    private readonly db: FirestoreService,
    private readonly snack: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  async onSubmit(form: NgForm) {
    // Check if user already exists
    this.db.col$('users', where('email', '==', form.value.email)).pipe(take(1)).subscribe(docs => {
      if(docs.length == 0) {
        // Check if user already invited
        this.db.col$('invitedUsers', where('email', '==', form.value.email)).pipe(take(1)).subscribe(docs => {
          if(docs.length == 0) {
            const invitation: UserInvitation = {
              firstName: form.value.firstName,
              displayName: form.value.displayName,
              roles: this.roles
            }
            if (form.value.email) {
              invitation['email'] = form.value.email;
            }
            this.db.add( 'invitedUsers', invitation).then(() => {
              form.resetForm();
              this.roles.subscriber = false;
              this.showMessage('Урилга илгээгдлээ!')
            });
          } else {
            this.showMessage('Мэйл хаягаар урилга илгээгдсэн байна')
          }
        });
      } else {
        this.showMessage('Мэйл хаягаар хэрэглэгч бүртгэлтэй байна')
      }
    });
  }

  showMessage(message: string) {
    this.snack.open(message, '', {
      duration: 3000,
    });
  }

}
