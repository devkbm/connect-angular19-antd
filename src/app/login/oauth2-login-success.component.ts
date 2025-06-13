import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './login.service';
import { UserToken } from './user-token.model';
import { SessionManager } from '../core/session-manager';

@Component({
  selector: 'app-oauth2-login-success',
  imports: [
    CommonModule,
  ],
  template: `
  `,
  styles: `
    :host {
      display: block;
    }
  `
})
export class Oauth2LoginSuccessComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loginService = inject(LoginService);

  private FIRST_PAGE_URL = '/home';

  token = "";

  ngOnInit(): void {
    this.token = this.route.snapshot.params['id'];

    if (this.token != null) {
      sessionStorage.setItem('token', this.token);

      this.loginService.getOAuth2Token('001')
          .subscribe(
            (model: UserToken) => {
              this.setItemSessionStorage(model);

              this.router.navigate([this.FIRST_PAGE_URL, {isForwarding: true}]);
            }
          );
    }

  }

  private setItemSessionStorage(data: UserToken) {
    SessionManager.saveSessionStorage(data);
  }

}
