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
import {JwtHelperService} from "@auth0/angular-jwt";
import Swal from "sweetalert2";

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

  // @ts-ignore
  public userRole: string;
  private jwtHelper: JwtHelperService = new JwtHelperService();


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
        this.userRole = this.extractUserRoleFromToken();
        if (this.userRole === 'ADMIN'){
          this.router.navigate(['dashboard']);
        }
        else if (this.userRole === 'EMPLOYE'){
          this.router.navigate(['employe/dashboard']);
        }
        else if(this.userRole === 'SECRETAIRE'){
          this.router.navigate(['secretaire/dashboard']);
        }

      },
      error: (err) => {
        console.log(err);
        if (err.error.validationErrors) {
          // Affichage des erreurs avec SweetAlert
          this.errorMsg = err.error.validationErrors;
          this.showSweetAlertErrors(this.errorMsg);
        } else {
          // Affichage de l'erreur générale avec SweetAlert
          this.errorMsg.push(err.error.businessExceptionDescription);
          this.showSweetAlertError(this.errorMsg[0]);
        }
      }
    });
  }

  showSweetAlertErrors(errors: Array<string>) {
    let errorMessage = '<ul>';
    errors.forEach(error => {
      errorMessage += `<li>${error}</li>`;
    });
    errorMessage += '</ul>';

    Swal.fire({
      title: 'Erreurs de validation',
      html: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  showSweetAlertError(error: string) {
    Swal.fire({
      title: 'Erreur',
      text: error,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  register() {
    this.router.navigate(['register']);
  }

  activate() {
    this.router.navigate(['activate-account']);
  }

  private extractUserRoleFromToken(): string {
    const token = this.tokenService.token;
    const decodedToken = this.jwtHelper.decodeToken(token);
    const authorities = decodedToken.authorities; // Récupérer la liste des autorités
    const userRole = authorities[0]; // Récupérer le premier élément de la liste (le rôle)
    return userRole;
  }
}
