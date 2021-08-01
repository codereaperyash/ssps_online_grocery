/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { LoginService } from '@codereaper/users';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }
 logOut(){
  this.confirmationService.confirm({
    message: 'Are you sure that you want to logout?',
    header: 'Logout Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {         
      this.loginService.logOut()
      this.messageService.add({severity:'success', summary:'Hooray!', detail:`Successfully Logged Out:)`});

      (error: Error)=>{
        this.messageService.add({severity:`${error}`, summary:'Oops!', detail:'Cant Log you out now:('});
      };
    }
})
}
}
