/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UsersService } from '@codereaper/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import * as countryList from 'i18n-iso-countries';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare const require;
@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html',
  styles: [
  ]
})
export class UsersFormComponent implements OnInit, OnDestroy {
  editMode = false;
  form: FormGroup;
  currentUid: string;
  isSubmitted = false;
  countries = [];
  endSubs$: Subject<any> = new Subject;

  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private usersService: UsersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._checkEditMode();
    this._getCountries();
  }
  ngOnDestroy(){
    this.endSubs$.next();
    this.endSubs$.unsubscribe();
  }

  private _initForm(){
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      phone: ['', Validators.required],
      isAdmin: [false, Validators.required],
      doorNo: ['', Validators.required],
      locality: ['', Validators.required],
      street: ['', Validators.required],
      zip: ['', Validators.required],
      city: ['', Validators.required],
      country: ['INDIA'],
    })
  }

  private _checkEditMode(){
    this.router.params.pipe(takeUntil(this.endSubs$)).subscribe(params=>{
      if(params.id){
        this.editMode = true;
        this.currentUid = params.id;
        this.usersService.getUser(params.id).subscribe(user=>{
          this.userForm.name.setValue(user.name);
          this.userForm.email.setValue(user.email);
          this.userForm.doorNo.setValue(user.doorNo);
          this.userForm.phone.setValue(user.phone);
          this.userForm.locality.setValue(user.locality);
          this.userForm.city.setValue(user.city);
          this.userForm.zip.setValue(user.zip);
          this.userForm.country.setValue(user.country);
          this.userForm.isAdmin.setValue(user.isAdmin);
          this.userForm.street.setValue(user.street);
          this.userForm.password.setValidators([]);
          this.userForm.password.updateValueAndValidity();
        })
      }
    })
  }
  private _getCountries(){
    countryList.registerLocale(require("i18n-iso-countries/langs/en.json"));
    this.countries = Object.entries(countryList.getNames("en", {select: "official"})).map((entry)=>{
      return {
        id: entry[0],
        name: entry[1]
      }
    });
  }

  onCancel(){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to cancel the operation?',
      header: 'Cancellation Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        return this.location.back();
      }
  });
  }

  onCreate(){
    this.isSubmitted = true;
    if(this.form.invalid){
      return;
    }else{
      const user: User = {
        id: this.currentUid,
        name: this.userForm.name.value,
        email: this.userForm.email.value,
        phone: this.userForm.phone.value,
        isAdmin: this.userForm.isAdmin.value,
        doorNo: this.userForm.doorNo.value,
        street: this.userForm.street.value,
        locality: this.userForm.locality.value,
        city: this.userForm.city.value,
        zip: this.userForm.zip.value,
        country: this.userForm.country.value,
        password: this.userForm.password.value
      }
      if(this.editMode){
        this._updateUser(user);
      }else{
        this._addUser(user);
      }
    }
  }
  private _addUser(user: User){

      this.confirmationService.confirm({
      message: 'Are you sure that you want to add the user?',
      header: 'Creation Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.usersService.createUser(user).pipe(takeUntil(this.endSubs$)).subscribe(()=>{
          this.messageService.add({severity:'success', summary:'Hooray!', detail:`User successfully created :)`});
          timer(1000).toPromise().then(()=>{
            this.location.back();
          })
        },
        (error: Error)=>{
          this.messageService.add({severity:`${error}`, summary:'Oops!', detail:'User cannot be created :('});
        });
      }
  });
  }
  private _updateUser(user: User){
    this.usersService.updateUser(user).pipe(takeUntil(this.endSubs$)).subscribe((user: User)=>{
      this.confirmationService.confirm({
        message: 'Are you sure that you want to update that user?',
        header: 'Updation Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {         
          this.usersService.updateUser(user).pipe(takeUntil(this.endSubs$)).subscribe(()=>{
            this.messageService.add({severity:'success', summary:'Hooray!', detail:`User successfully updated :)`});
            timer(1000).toPromise().then(()=>{
              this.location.back();
            })
          },
          (error: Error)=>{
            this.messageService.add({severity:`${error}`, summary:'Oops!', detail:'User cannot be updated :('});
          });
        }
    })
    })
  }

  get userForm(){
    return this.form.controls;
  }
}
