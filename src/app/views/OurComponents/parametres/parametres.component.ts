import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserServiceService} from "../../../services/services/user-service.service";
import {ChangePasswordRequest} from "../../../services/models/change-password-request.model";
import {NgIf} from "@angular/common";
import Swal from "sweetalert2";

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './parametres.component.html',
  styleUrl: './parametres.component.scss'
})
export class ParametresComponent {

  changePasswordForm: FormGroup;

  alertSuccess: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserServiceService) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmationPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const request: ChangePasswordRequest = this.changePasswordForm.value;
      this.userService.changePassword(request).subscribe(
        response => {
          console.log('Password changed successfully', response);
          Swal.fire({
            title: 'Mot de passe modifié !',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.changePasswordForm.reset();
          //this.alertSuccess = true;
          //setTimeout(() => {
            //this.alertSuccess = false; // Cacher l'alerte après quelques secondes
          //}, 4000);
        },
        error => {
          Swal.fire({
            title: 'Oops ! Une erreur est survenue',
            icon: 'error',
          });
          console.error('Error changing password', error);
          this.alertSuccess = false;
        }
      );
    }
  }

}
