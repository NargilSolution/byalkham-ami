import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { NewUserData } from 'src/app/models/user.model';
import { ProfileUpdateData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CloudService {

  constructor(private functions: Functions) { }

  getAuthProfile(userId: string){
    const callable = httpsCallable(this.functions,'getAuthProfile');
    return callable(userId);
  }

  updateAuthProfile(data: ProfileUpdateData){
    const callable = httpsCallable(this.functions,'updateAuthProfile');
    return callable(data);
  }

  createUserProfile(data: NewUserData){
    const callable = httpsCallable(this.functions,'createUserProfile');
    return callable(data);
  }


}
