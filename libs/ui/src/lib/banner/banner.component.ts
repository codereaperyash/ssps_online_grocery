import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-banner',
  templateUrl: './banner.component.html'
})
export class BannerComponent   {

  constructor(
    private router: Router
  ) { }

  routeToPro(){
    this.router.navigate(['/products']);
  }
}
