import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ble';

  constructor(
  ) {
    // const navEndEvent$ = router.events.pipe(filter(e => e instanceof NavigationEnd));
}

  ngOnInit() {
      // If maintenance window is acting up, only use this method.
      // this.getAuthenticationType();
  }
  gotoViewDevices(){

  }
}
