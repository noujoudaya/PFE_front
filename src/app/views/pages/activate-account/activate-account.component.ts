import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/services/authentication.service";
import {NgIf} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {CodeInputModule} from "angular-code-input";

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    NgIf,
    HttpClientModule,
    CodeInputModule
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {

  message: string = '';
  isOkay: boolean = true;
  submitted:boolean = false;

  constructor(private router: Router,
              private authService: AuthenticationService ) {
  }


  onCodeCompleted(token: string) {
    this.confirmationAccount(token);
  }


  redirectToLogin() {
    this.router.navigate(['login']);
  }

  private confirmationAccount(token: string) {
    this.authService.confirm({
      token
    }).subscribe({
      next: () => {
        this.message = 'Votre compte a été activé avec succès. \n Vous pouvez maintenant vous connecter.';
        this.submitted=true;
        this.isOkay=true;
      },
      error:() => {
        this.message = 'Le code d\'activation a expiré ou est invalide.';
        this.submitted=true;
        this.isOkay=false;
      }
    })
  }

}
