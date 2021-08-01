import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})

export class Authguard implements CanActivate{

  constructor(
    private router: Router,
    private localStorage: LocalstorageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const token = this.localStorage.getToken();

    if(token){
      const tokenDecode = JSON.parse(atob(token.split('.')[1]))
      if(tokenDecode.isAdmin && (!+this._tokenExpiry(tokenDecode.exp))) return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
  private _tokenExpiry(expiration: number): boolean{
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }
}
