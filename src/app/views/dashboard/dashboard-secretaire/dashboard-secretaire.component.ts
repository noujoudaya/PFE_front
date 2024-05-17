import {Component, OnInit} from '@angular/core';
import {Employe} from "../../../services/models/employe.model";

@Component({
  selector: 'app-dashboard-secretaire',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-secretaire.component.html',
  styleUrl: './dashboard-secretaire.component.scss'
})
export class DashboardSecretaireComponent implements OnInit{
  // @ts-ignore
  authenticatedEmploye: Employe;

  ngOnInit(): void {
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
  }
}
