/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '@codereaper/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit, OnDestroy {
  users=[];
  endSubs$: Subject<any> = new Subject;

  constructor(
    private usersService: UsersService,
    private route: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { 

  }

  ngOnInit(): void {
    this._getUsers();
  }
  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }

  private _getUsers(){
    this.usersService.getUsers().pipe(takeUntil(this.endSubs$)).subscribe((users)=>{
      this.users = users;
    })
  }

  deleteUser(userid){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete that user?',
      header: 'Deletion Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.usersService.deleteUser(userid).pipe(takeUntil(this.endSubs$)).subscribe(()=>{
          this._getUsers();
          this.messageService.add({severity:'success', summary:'Hooray!', detail:`User successfully Deleted :)`});
        },
        (error: Error)=>{
          this.messageService.add({severity:`${error}`, summary:'Oops!', detail:'User cannot be deleted :('});
        });
      }
  });
  }

  updateUser(userid: string){
    this.route.navigateByUrl(`users/form/${userid}`);
  }
}
