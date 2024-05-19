import {Component, OnInit} from '@angular/core';
import {DepartementService} from "../../../../services/services/departement.service";
import {Departement} from "../../../../services/models/departement.model";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-departement-emp-sec',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './departement-emp-sec.component.html',
  styleUrl: './departement-emp-sec.component.scss'
})
export class DepartementEmpSecComponent implements OnInit{


  constructor(private departementService: DepartementService) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  public findAll(): void {
    // @ts-ignore
    this.departementService.findAll().subscribe(data=>
    {
      this.departements=data;
    });
  }

  get departements(): Array<Departement> {
    return this.departementService.departements;
  }

  set departements(value: Array<Departement>) {
    this.departementService.departements = value;
  }
}
