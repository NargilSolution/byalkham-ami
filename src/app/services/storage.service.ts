import { Injectable } from '@angular/core';
import {
  Storage,
  ref,
  deleteObject,
  uploadBytes,
  uploadString,
  uploadBytesResumable,
  UploadTaskSnapshot,
  percentage,
  getDownloadURL
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  uploadPercent = 0;

  constructor(
    private readonly storage: Storage
  ) { }

  async upload(
    folder: string,
    name: string,
    file: File | null
  ): Promise<any> {
    const ext = file!.name.split('.').pop();
    const path = `${folder}/${name}.${ext}`;
    if(file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        this.uploadPercent = 0;
        percentage(task).subscribe(percent => {
          this.uploadPercent = percent.progress;
        });
        await task;
        const url = await getDownloadURL(storageRef);
        return url;
      } catch(e: any) {
        console.error(e);
      }
    } else {
      console.log('invalid file');
      return null
    }
  }

  async delete(
    url: string
  ): Promise<string | void> {

    const storageRef = ref(this.storage, url);
    return deleteObject(storageRef);
  }

}
