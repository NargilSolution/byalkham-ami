import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  docData,
  DocumentReference,
  CollectionReference,
  collection,
  query,
  QueryConstraint,
  serverTimestamp,
  addDoc,
  deleteDoc,
  collectionData,
  doc,
  updateDoc,
  setDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

type CollectionPeriodicate<T>   = string;
type DocPeriodicate<T>          = string;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private readonly auth: Auth,
    private readonly afs: Firestore
  ) { }



  // **************
  // Get Data
  // **************

  // col<T>(ref: CollectionPeriodicate<T>): CollectionReference<T> {
  //   return collection<T>(this.afs, ref)
  // }

  doc$<T>(ref: DocPeriodicate<T>): Observable<T> {
    return docData<T>(doc(this.afs, ref) as DocumentReference<T>);
  }

  col$<T>(ref: CollectionPeriodicate<T>, ...queryFn: QueryConstraint[]): Observable<T[]> {
    return collectionData<T>(
      query(
        collection(this.afs, ref) as CollectionReference<T>,
        ...queryFn
      ),
      {idField: 'id'}
    );
  }


  // **************
  // Write Data
  // **************

  add<T>(ref: CollectionPeriodicate<T>, data: any) {
    const timestamp = serverTimestamp();
    const username = this.auth.currentUser?.displayName || '';
    const userId = this.auth.currentUser?.uid || '';
    return addDoc(collection(this.afs, ref), {
      ...data,
      createdAt: timestamp,
      createdBy: username,
      createdId: userId
    });
  }

  set<T>(ref: DocPeriodicate<T>, data: any) {
    const timestamp = serverTimestamp();
    const username = this.auth.currentUser?.displayName || '';
    const userId = this.auth.currentUser?.uid || '';
    if(data.createdAt) {
      return setDoc(doc(this.afs, ref), {
        ...data,
        updatedAt: timestamp,
        updatedBy: username,
        updatedId: userId
      })
    } else {
      return setDoc(doc(this.afs, ref), {
        ...data,
        createdAt: timestamp,
        createdBy: username,
        createdId: userId
      })
    }
  }

  update<T>(ref: DocPeriodicate<T>, data: any) {
    const timestamp = serverTimestamp();
    const username = this.auth.currentUser?.displayName || '';
    const userId = this.auth.currentUser?.uid || '';
    return updateDoc(doc(this.afs, ref), {
      ...data,
      updatedAt: timestamp,
      updatedBy: username,
      updatedId: userId
    });
  }

  delete<T>(ref: DocPeriodicate<T>)  {
    return deleteDoc(doc(this.afs, ref));
  }

}
