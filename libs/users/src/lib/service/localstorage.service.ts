import { Injectable } from '@angular/core';

const TOKEN = 'jwttoken';

@Injectable({
  providedIn: 'root'
})

export class LocalstorageService {

  constructor() { }

  setToken(token: string){
    localStorage.setItem(TOKEN, token);
  }

  getToken(){
    return localStorage.getItem(TOKEN);
  }

  removeToken(){
    localStorage.removeItem(TOKEN);
  }
}
