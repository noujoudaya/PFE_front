import {Employe} from "./employe.model";

export class Retard {
  id: number = 0;
  employe: Employe = new Employe();
  dateRetard: string = '';
  heureDebutTravail: string = '';
  heureArrivee: string = '';
}
