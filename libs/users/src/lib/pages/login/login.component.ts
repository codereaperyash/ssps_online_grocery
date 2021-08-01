import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../service/localstorage.service';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  isSubmitted = false;
  isError = true;
  errorMessage = 'Email or Password is Invalid. Please Check!';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private localStorage: LocalstorageService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm(){
    this.loginFormGroup = this.formBuilder.group({
      email!: ['', [Validators.required, Validators.email]],
      password!: ['', Validators.required]
    })
  }

  get loginForm(){
    return this.loginFormGroup.controls;
  }

  onLogin(){
    this.isSubmitted = true;
    
    if(this.loginForm.invalid){
      return;
    }else{
      this.loginService.login(this.loginForm.email.value, this.loginForm.password.value).subscribe((user)=>{
        this.isError = false
        this.localStorage.setToken(user.token);
        this.route.navigate(['/']);
      },(error: HttpErrorResponse)=>{
        this.isError = true;
        if(error.status !== 400) {
          this.errorMessage = "Fatal Sever Error! Please try again later :("
        }
      }
 )}
  }
}
