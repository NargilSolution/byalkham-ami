import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { AuthService } from '../auth/auth.service';


type CollectionPeriodicate<T>   = string | AngularFirestoreCollection<T>;
type DocPeriodicate<T>          = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private afs: AngularFirestore, private authService: AuthService) { }

  // **************
  // Get a Reference
  // **************
  
  col<T>(ref: CollectionPeriodicate<T>, queryFn?: QueryFn | undefined): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn): ref
  }

  
  doc<T>(ref: DocPeriodicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref): ref
  }  


  // **************
  // Get Data
  // **************

  doc$<T>(ref: DocPeriodicate<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(map(doc => {
      return doc.payload.data() as T;
    }))
  }

  col$<T>(ref: CollectionPeriodicate<T>, queryFn?: any): Observable<T[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(map(docs => {
      return docs.map(a => a.payload.doc.data()) as T[]
    }))
  }

  colWithId$<T>(ref: CollectionPeriodicate<T>, queryFn?: { (ref: any): any; (ref: any): any; }): Observable<T[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data}
      });
    }));
  }


  // **************
  // Write Data
  // **************

  // Firebase Server Timestamp
  get timestamp() {
    return firebase.default.firestore.FieldValue.serverTimestamp();
  }

  set<T>(ref: DocPeriodicate<T>, data: any) {
    const timestamp = this.timestamp
    return this.doc(ref).set({
      ...data,
      updatedAt: this.timestamp,
      createdAt: this.timestamp
    })
  }

  delete<T>(ref: DocPeriodicate<T>) {
    return this.doc(ref).delete()
  }

  add<T>(ref: CollectionPeriodicate<T>, data: any) {
    const timestamp = this.timestamp;
    const userId = this.authService.userId;
    return this.col(ref).add({
      ...data,
      createdAt: this.timestamp,
      updatedAt: this.timestamp,
      // createdBy: userId
    })
  }

  update<T>(ref: DocPeriodicate<T>, data: any) {
    const timestamp = this.timestamp
    const userId = this.authService.userId;
    return this.doc(ref).update({
      ...data,
      updatedAt: this.timestamp,
      updatedBy: userId
    })
  }


}


