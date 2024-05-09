import {Employe} from "./employe.model";
import {StatutConge} from "../enums/statutConge.enum";
import {TypeConge} from "./type-conge.model";

export class DemandeConge {
  id: number = 0;
  employe: Employe = new Employe();
  dateDebut: string = '';
  dateFin: string = '';
  dateDemande = '';
  // @ts-ignore
  statutConge: StatutConge;
  // @ts-ignore
  typeConge: TypeConge;
}
