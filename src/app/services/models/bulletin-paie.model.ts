import {Employe} from "./employe.model";
import {BulletinPaieRubrique} from "./bulletin-paie-rubrique.model";
import {Entreprise} from "./entreprise.model";

export class BulletinPaie {
  // @ts-ignore
  public id: number;
  // @ts-ignore
  public code: number;
  // @ts-ignore
  public employe: Employe = new Employe();
  // @ts-ignore
 public entreprise: Entreprise= new Entreprise();

  // @ts-ignore
  public month: string;
  // @ts-ignore
  public year: number = new Date().getFullYear();
  // @ts-ignore
  public nbrJourTravaille: number=26;
  // @ts-ignore
  public nbrHeuresTravaille: number=0;


  // @ts-ignore
  public tauxHoraire: number=0;
  // @ts-ignore
  public nbrJourCongeNonPaye: number=0;
  // @ts-ignore
  public nbrJourAbsenceNonJust: number=0;
  // @ts-ignore
  public anciennete: number=0;
  // @ts-ignore
  public salaireBaseMensuelle: number=0;
  // @ts-ignore
  public salaireBaseImposable: number=0;
  // @ts-ignore
  public salaireBruteGlobale: number=0;
  // @ts-ignore
  public salaireBrutImp: number=0;
  // @ts-ignore
  public salaireNetImp: number=0;
  // @ts-ignore
  public salNetPayer: number=0;
  // @ts-ignore
  public retenusCnss: number=0;
  // @ts-ignore
  public retenusAmo: number=0;
  // @ts-ignore
  public retenusIr: number=0;
  // @ts-ignore
  public tauxIr: number=0;
  // @ts-ignore
  public tauxAnc: number=0;
  // @ts-ignore
  public primeAnc: number=0;
  // @ts-ignore
  public heuresSupp25: number=0;
  // @ts-ignore
  public heuresSupp50: number=0;
  // @ts-ignore
  public heuresSupp100: number=0;

  // @ts-ignore
  public bulletinPaieRubriques:Array<BulletinPaieRubrique>;

}
