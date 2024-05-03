import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {RegistrationRequest} from "../../../services/models/registration-request";
import {AuthenticationService} from "../../../services/services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    NgForOf,
    NgIf,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerRequest : RegistrationRequest = {email:'',firstname:'',lastname:'',password:''};
  errorMsg: Array<string> = [];
  userCreated: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
  }

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.errorMsg = [];
    this.authService.register({
      body: this.registerRequest
    })
      .subscribe({
        next: () => {
          this.userCreated = true;
          setTimeout(() => {
            this.userCreated = false; // Cacher l'alerte après quelques secondes
          }, 4000);
        },
        error: (err) => {
         this.errorMsg = err;
        }
      });
  }

}
