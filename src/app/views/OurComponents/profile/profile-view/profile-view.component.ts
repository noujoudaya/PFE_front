import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {EmployeService} from "../../../../services/services/employe.service";
import {Employe} from "../../../../services/models/employe.model";
import {Genre} from "../../../../services/enums/genre.enum";
import {SituationFamiliale} from "../../../../services/enums/situationFamiliale.enum";
import Swal from "sweetalert2";

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss'
})
export class ProfileViewComponent implements OnInit{

  // @ts-ignore
  authenticatedEmploye: Employe;
  // @ts-ignore
  selectedEmploye:Employe;

  editMode: boolean = false;

  showSuccessAlert: boolean = false;

  genres = Object.values(Genre);
  situations = Object.values(SituationFamiliale);


  constructor(private employeService:EmployeService) { }

  ngOnInit(): void {
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
  }

  protected readonly Array = Array;

  public modifier():void{
    this.employe=this.authenticatedEmploye;
    this.employeService.update().subscribe(data=>{
      if (data>0){
        Swal.fire({
          title: 'Modifications enregistrées ! Les modifications seront visibles après la prochaine connexion',
          icon: 'success',
          confirmButtonText: 'OK'

        });
        //this.showSuccessAlert = true;
        //setTimeout(() => this.showSuccessAlert = false, 7000); // Hide alert after 3 seconds
        //this.employe = new Employe();
        //this.editMode = false;
      }
      else {
        Swal.fire({
          title: 'Oops , une erreur est survenue !',
          icon: 'error',
        });
      }
    })
  }

  annuler(): void {
    this.editMode = false; // Désactiver le mode édition
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  get employe(): Employe {
    return this.employeService.employe;
  }

  set employe(value: Employe) {
    this.employeService.employe = value;
  }
}
