import {Component, OnInit} from '@angular/core';
import {Employe} from "../../../services/models/employe.model";

@Component({
  selector: 'app-dashboard-employe',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-employe.component.html',
  styleUrl: './dashboard-employe.component.scss'
})
export class DashboardEmployeComponent implements OnInit{

  // @ts-ignore
  authenticatedEmploye: Employe;

  ngOnInit(): void {
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
  }

}
