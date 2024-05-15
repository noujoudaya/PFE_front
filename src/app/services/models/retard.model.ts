import {Employe} from "./employe.model";
import {StatutAbsence} from "../enums/statutAbsence.enum";

export class Retard {
  id: number = 0;
  employe: Employe = new Employe();
  dateRetard: string = '';
  heureDebutTravail: string = '';
  heureArrivee: string = '';
  // @ts-ignore
  statutRetard:StatutAbsence;
}
