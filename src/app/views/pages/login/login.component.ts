import { Component } from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import {Router, RouterLink} from "@angular/router";
import {AuthenticationRequest} from "../../../services/models/authentication-request";
import {FormsModule} from "@angular/forms";
import {AuthenticationService} from "../../../services/services/authentication.service";
import {TokenService} from "../../../services/token/token.service";
import {EmployeService} from "../../../services/services/employe.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, RouterLink, FormsModule, NgIf, NgForOf]
})
export class LoginComponent {
  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];


  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private employeService: EmployeService
  ) {
  }

  login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        this.tokenService.token = res.token as string;
        console.log(res.employe);
        this.employeService.authenticatedEmploye = res.employe;
        console.log(this.employeService.authenticatedEmploye);
        localStorage.setItem('authenticatedEmploye', JSON.stringify(res.employe));
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        console.log(err);
        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.businessExceptionDescription);
        }
      }
    });
  }
  register() {
    this.router.navigate(['register']);
  }

  activate() {
    this.router.navigate(['activate-account']);
  }
}
