import {Component, OnInit} from '@angular/core';
import {EmployeService} from "../../../../services/services/employe.service";
import {Employe} from "../../../../services/models/employe.model";
import {NgForOf, NgIf} from "@angular/common";
import {Genre} from "../../../../services/enums/genre.enum";
import {FormsModule} from "@angular/forms";
import {SituationFamiliale} from "../../../../services/enums/situationFamiliale.enum";
import {StatutEmploye} from "../../../../services/enums/statutEmploye.enum";
import {Designation} from "../../../../services/enums/designation.enum";
import {TypeSalaire} from "../../../../services/enums/typeSalaire.enum";
import {TypeContrat} from "../../../../services/enums/typeContrat.enum";
import {Departement} from "../../../../services/models/departement.model";
import {DepartementService} from "../../../../services/services/departement.service";
import {Service} from "../../../../services/models/service.model";
import {ServiceService} from "../../../../services/services/service.service";
import {Fonction} from "../../../../services/models/fonction.model";
import {FonctionService} from "../../../../services/services/fonction.service";
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-employes-list',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './employes-list.component.html',
  styleUrl: './employes-list.component.scss'
})
export class EmployesListComponent implements OnInit {

  private _selectedEmployee: Employe | null = null;

  private searchTerms = new Subject<string>();
  selectedFile!: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResponse: any;

  compareDepartments(d1: any, d2: any): boolean {
    return d1 && d2 ? d1.id === d2.id : d1 === d2;
  }

  compareServices(s1: any, s2: any): boolean {
    return s1 && s2 ? s1.id === s2.id : s1 === s2;
  }

  compareFonctions(f1: any, f2: any): boolean {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
  }

  get selectedEmployee(): Employe {
    // Retourne un employé vide par défaut si _selectedEmployee est nul
    return this._selectedEmployee ?? new Employe();
  }

  set selectedEmployee(value: Employe | null) {
    this._selectedEmployee = value;
  }

  showEmployeeDetails(employe: Employe) {
    console.log(employe);
    this.selectedEmployee = employe;
  }


  // Méthode pour fermer le modal de vue
  closeViewModal() {
    this.selectedEmployee = null;
  }

  //les enums
  genres = Object.values(Genre);
  situations = Object.values(SituationFamiliale);
  statuts = Object.values(StatutEmploye)
  designations = Object.values(Designation)
  typesSalaire = Object.values(TypeSalaire);
  typesContrats = Object.values(TypeContrat);

  departements: Departement[] = [];
  services: Service[] = [];
  fonctions: Fonction[] = [];


  ngOnInit(): void {
    this.findAll();
    this.loadDepartements();
    this.loadServices();
    this.loadFonctions();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.service.searchEmployes(term))
    ).subscribe(employes => {
      this.employes = employes;
    });
  }

  constructor(private service: EmployeService,
              private httpClient: HttpClient,
              private departementService: DepartementService,
              private serviceService: ServiceService,
              private fonctionService: FonctionService) {
  }

  private loadDepartements(): void {
    this.departementService.findAll().subscribe({
      next: (departements) => {
        this.departements = departements;
        console.log('Départements chargés:', this.departements);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des départements:', error);
      }
    });
  }

  private loadServices(): void {
    this.serviceService.findAll().subscribe({
      next: (services) => {
        this.services = services;
        console.log('Services chargés:', this.services);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des services:', error);
      }
    });
  }

  private loadFonctions(): void {
    this.fonctionService.findAll().subscribe({
      next: (fonctions) => {
        this.fonctions = fonctions;
        console.log('Fonctions chargés:', this.fonctions);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fonctions:', error);
      }
    });
  }
  public onFileChanged(event: any,employe: Employe) {
    // Select File
    this.selectedFile = event.target.files[0];
    this.onUpload(employe);


  }

  public findAll(): void {
    this.service.findAll().subscribe(data => {
        this.employes = data;
        for (let employe of this.employes ){
          this.base64Data = employe.image.picByte;
          employe.image = 'data:image/jpeg;base64,' + this.base64Data;

        }
      }
    );
  }
  onUpload(employe: Employe) {
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
    uploadImageData.append('cin', employe.cin)
    this.httpClient.post('http://localhost:8088/api/v1/image/upload', uploadImageData, {
      observe: 'response',
      responseType: 'text' // Specify the response type as text
    })
      .subscribe((response) => {
        if (response.status === 200) {
          alert('Image uploaded successfully');

        } else {
          alert('Image not uploaded successfully');
        }
      });
  }
  getImage() {
    //Make a call to Sprinf Boot to get the Image Bytes.
    this.httpClient.get('http://localhost:8088/api/v1/image/get/' + this.selectedFile.name)
      .subscribe(
        res => {
          this.retrieveResponse = res;
          this.base64Data = this.retrieveResponse.picByte;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        }
      );
  }


  search(term: string): void {
    this.searchTerms.next(term);
  }

  public save(): void {
    this.service.save().subscribe(data => {
      if (data > 0) {
        this.employes.push({...this.employe});
        this.employe = new Employe();
        alert("Employé enregisté avec succès");
      } else {
        alert("Erreur");
      }
    })
  }

  public update(): void {
    this.employe = this.selectedEmployee;
    this.service.update().subscribe(data=>{
      if (data > 0){
        alert("Employé modifié");
        this.employe = new Employe();
      }
      else {
        alert("erreur")
      }
    })
  }

  public deleteByCin(employe: Employe, index: number): void {
    if (employe.cin != null) {
      this.service.deleteByCin(employe.cin).subscribe(data => {
          if (data > 0) {
            this.employes.splice(index, 1);
          } else {
            alert("Erreur suppression");
          }
        }
      );
    }
  }

  get employe(): Employe {
    return this.service.employe;
  }

  set employe(value: Employe) {
    this.service.employe = value;
  }

  get employes(): Employe[] {
    return this.service.employes;
  }

  set employes(value: Employe[]) {
    this.service.employes = value;
  }

}
