import {Component, OnInit} from '@angular/core';
import {FonctionService} from "../../../../services/services/fonction.service";
import {Fonction} from "../../../../services/models/fonction.model";
import {Service} from "../../../../services/models/service.model";
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-fonction-emp-sec',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './fonction-emp-sec.component.html',
  styleUrl: './fonction-emp-sec.component.scss'
})
export class FonctionEmpSecComponent implements OnInit {
  ngOnInit(): void {
    this.findAll();
  }

  constructor(private fonctionService: FonctionService) {
  }

  public findAll(): void {
    this.fonctionService.findAll().subscribe(data => this.fonctions = data);
  }

  get fonctions(): Array<Fonction> {
    for (let fonction of this.fonctionService.fonctions) {
      if (fonction.service == null) {
        fonction.service = new Service();
      }
    }
    return this.fonctionService.fonctions;
  }

  set fonctions(value: Fonction[]) {
    this.fonctionService.fonctions = value;
  }
}
