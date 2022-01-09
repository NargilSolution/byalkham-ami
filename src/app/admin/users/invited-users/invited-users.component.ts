import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserInvitation } from 'src/app/models/user.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-invited-users',
  templateUrl: './invited-users.component.html',
  styleUrls: ['./invited-users.component.scss']
})
export class InvitedUsersComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'email', 'roles', 'createdAt', 'action'];
  dataSource = new MatTableDataSource<UserInvitation>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly db: FirestoreService
  ) {
    // collectionData<UserInvitation>(
    //   query(
    //     collection(afs, 'invitedUsers') as CollectionReference<UserInvitation>,
    //     orderBy('createdAt', 'desc')
    //   ),
    //   {idField: 'id'}
    // ).subscribe(data => {
    //   this.dataSource.data = data;
    // });
    this.db.col$<UserInvitation>('invitedUsers', orderBy('createdAt', 'desc')).subscribe(data => {
      this.dataSource.data = data;
    })

  }

  async ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showLinkDialog(id: string) {

  }

  deleteRequest(id: string) {
    this.db.delete('invitedUsers/'+id);
  }

}
