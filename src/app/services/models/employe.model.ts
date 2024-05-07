import {Designation} from "../enums/designation.enum";
import {Genre} from "../enums/genre.enum";
import {SituationFamiliale} from "../enums/situationFamiliale.enum";
import {StatutEmploye} from "../enums/statutEmploye.enum";
import {Departement} from "./departement.model";
import {Service} from "./service.model";
import {Fonction} from "./fonction.model";
import {TypeSalaire} from "../enums/typeSalaire.enum";
import {TypeContrat} from "../enums/typeContrat.enum";

export class Employe {

  // @ts-ignore
  public id: number;
  // @ts-ignore
  public nom: string;
  // @ts-ignore
  public prenom:string;
  // @ts-ignore
  public telephone:string;
  // @ts-ignore
  public email:string;
  // @ts-ignore
  public adresse:string;
  // @ts-ignore
  public cin:string;
  // @ts-ignore
  ville:string;
  // @ts-ignore
  numeroCompteBancaire:string;

  // @ts-ignore
  dateNaissance:string;
  // @ts-ignore
  dateEmbauche:string;
  // @ts-ignore
  dateEntree:string;
  // @ts-ignore
  dateFinContrat:string;

  // @ts-ignore
  salaire:number;
  // @ts-ignore
  soldeConge:number;

  // @ts-ignore
  designation:Designation;
  // @ts-ignore
  genre:Genre;
  // @ts-ignore
  situationFamiliale:SituationFamiliale;
  // @ts-ignore
  statutEmploye: StatutEmploye;
  // @ts-ignore
  typeContrat: TypeContrat;
  // @ts-ignore
  typeSalaire: TypeSalaire;
  // @ts-ignore
  departement: Departement;
  // @ts-ignore
  service: Service;
  // @ts-ignore
  fonction: Fonction;

}
