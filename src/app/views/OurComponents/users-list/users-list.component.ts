import {Component, OnInit} from '@angular/core';
import {UserServiceService} from "../../../services/services/user-service.service";
import {User} from "../../../services/models/user.model";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Employe} from "../../../services/models/employe.model";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {Page} from "../../../services/models/page.model";
import {Fonction} from "../../../services/models/fonction.model";

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {

  usersPage: Page<User> = new Page<User>();

  constructor(private userService: UserServiceService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getPureUsersPage(0,5);
  }

  getPageNumbers(): number[] {
    const totalPages = this.usersPage.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  getPureUsersPage(page: number, size: number): void {
    this.userService.getPureUsers(page, size).subscribe({
      next: (page) => {
        this.usersPage = page;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des users paginés:', error);
      }
    });
  }

  public findAllUsers(): void {
    // @ts-ignore
    this.userService.findAllUsers().subscribe(data => {
      this.users = data;
    })
  }

  public findPureUsers(): void {
    this.userService.findPureUsers().subscribe(data => {
      this.users = data;
    })
  }

  public deleteByLogin(user: User, index: number): void {
    this.userService.deleteByLogin(user.login).subscribe(data => {
      if (data > 0) {
        this.users.splice(index, 1);
        this.showThirdAlert();
      } else {
        Swal.fire({
          title: 'Oops, une erreur est survenue !',
          icon: 'error',
        });
      }
    });
  }

  confirmDelete(user: User, index: number) {
    Swal.fire({
      title: 'Voulez-vous vraiment supprimer cet utilisateur ?',
      showDenyButton: true,
      denyButtonText: 'Annuler',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showSecondAlert(user, index);
      } else if (result.isDenied) {
        console.log('Supression annulée');
      }
    });
  }

  showSecondAlert(user: User, index: number) {
    Swal.fire({
      title: 'Cet utilisateur sera supprimé de façon définitive , poursuivre ?',
      showDenyButton: true,
      denyButtonText: 'Annuler',
      confirmButtonText: 'Supprimer',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteByLogin(user, index);
      } else if (result.isDenied) {
        console.log("supression annulée");
      }
    });

  }

  showThirdAlert(): void {
    Swal.fire({
      title: 'Opération réussite !',
      icon: 'success',
      confirmButtonText: 'OK'

    })

  }


  get user(): User {
    return this.userService.user;
  }

  set user(value: User) {
    this.userService.user = value;
  }

  get users(): User[] {
    return this.userService.users;
  }

  set users(value: User[]) {
    this.userService.users = value;
  }

  redirectToRegister() {
    this.router.navigate(['/register']);
  }
}
