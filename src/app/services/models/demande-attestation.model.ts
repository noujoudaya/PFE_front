import {Employe} from "./employe.model";
import {TypeAttestation} from "../enums/typeAttestation.enum";
import {StatutAttestation} from "../enums/statutAttestation.enum";

export class DemandeAttestation {
  id: number = 0;
  employe: Employe = new Employe();
  dateDemande: string = '';
  // @ts-ignore
  typeAttestation: TypeAttestation;
  // @ts-ignore
  statutAttestation: StatutAttestation;
}
