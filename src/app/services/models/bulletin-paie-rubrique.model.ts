import {BulletinPaie} from "./bulletin-paie.model";
import {Rubrique} from "./rubrique.model";
import {Employe} from "./employe.model";

export class BulletinPaieRubrique {
  // @ts-ignore
  public bulletinPaieId?: number;
  // @ts-ignore
  public rubriqueId?: number;
  // @ts-ignore
  public montant: number;
  // @ts-ignore
  public nombre: number;
  // @ts-ignore
  public rubrique: Rubrique;

}
