import {Component, OnInit} from '@angular/core';
import {DepartementService} from "../../../../services/services/departement.service";
import {Departement} from "../../../../services/models/departement.model";

@Component({
  selector: 'app-departement-list',
  standalone: true,
  imports: [],
  templateUrl: './departement-list.component.html',
  styleUrl: './departement-list.component.scss'
})
export class DepartementListComponent  implements OnInit {
  updatedLibelle!: string;

  constructor(private departementService: DepartementService) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  public findAll(): void {
    this.departementService.findall().subscribe(data => this.departements = data);
  }

  public deleteByCode(departement: Departement, index: number): void {
    this.departementService.deleteByCode(departement.code).subscribe(data => {
      if (data > 0) {
        this.departements.splice(index, 1);
      } else {
        alert('error accured');
      }
    });
  }

  public update(departement: Departement): void {
    if (this.updatedLibelle == null) {
      alert("enter un nom");
    } else {
      this.departement.libelle = this.updatedLibelle;
      this.departement.code = departement.code;

      this.departementService.update().subscribe(data => {
        if (data > 0) {
          const index = this.departements.findIndex(d => d.id === departement.id);
          if (index !== -1) {
            this.departements[index].libelle = this.departement.libelle;
            alert('UPDATE SUCCESS');
            this.updatedLibelle = '';
          } else {
            alert('Department not found');
          }
        } else {
          alert('Error occurred');
        }
        this.departementService.departement = new Departement();
      });
    }
  }

  public save(): void {
    if (this.departement.libelle == null) {
      alert("enter un nom");
    } else {
      this.departement.code = this.departement.libelle;
      this.departementService.save().subscribe(data => {
        if (data > 0) {
          this.departements.push({...this.departement});
          alert('SAVE SUCCESS');
        } else {
          alert('Departement existe déjà');
        }
        this.departementService.departement = new Departement();
      });
    }
  }

  public confirmDelete(departement: Departement, index: number): void {
    if (confirm('La suppression de ce département supprimera tous les services associés. Confirmez-vous la suppression ?')) {
      this.deleteByCode(departement, index);
    }
  }


  get departement(): Departement {
    return this.departementService.departement;
  }

  set departement(value: Departement) {
    this.departementService.departement = value;
  }

  get departements(): Array<Departement> {
    return this.departementService.departements;
  }

  set departements(value: Array<Departement>) {
    this.departementService.departements = value;
  }
}

