import {Employe} from "./employe.model";
import {StatutAbsence} from "../enums/statutAbsence.enum";

export class Absence {
  id: number = 0;
  employe: Employe = new Employe();
  dateAbsence: string = '';
  // @ts-ignore
  statutAbsence: StatutAbsence;
}
