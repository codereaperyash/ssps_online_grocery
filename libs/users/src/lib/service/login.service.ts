import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiUrlUsers = environment.apiUrl + 'users/'

  constructor(private http: HttpClient, private localStorage: LocalstorageService, private router: Router) { }

  login(email: string, password: string): Observable<User>{
    return this.http.post<User>(`${this.apiUrlUsers}login`, ({email, password}))
  }
  logOut(){
    this.localStorage.removeToken();
    this.router.navigate(['/login']);
  }
}
