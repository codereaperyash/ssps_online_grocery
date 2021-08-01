import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { User } from '../model/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrlUsers = environment.apiUrl + 'users/'
  getCountries: any;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrlUsers}`);
  }
  getUsersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrlUsers}/get/count`).pipe(map((objectValue: any) => objectValue.userCount));
  }

  getUser(userid: string): Observable<User>{
    return this.http.get<User>(`${this.apiUrlUsers}${userid}`);
  }

  createUser(user: User): Observable<User>{
    return this.http.post<User>(`${this.apiUrlUsers}`, user);
  }

  updateUser(user: User): Observable<User>{
    return this.http.put<User>(`${this.apiUrlUsers}${user.id}`, user);
  }

  deleteUser(userid: string): Observable<unknown>{
    return this.http.delete<unknown>(`${this.apiUrlUsers}${userid}`);
  }
}
