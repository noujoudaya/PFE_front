/* tslint:disable */
/* eslint-disable */
import {Employe} from "./employe.model";

export interface AuthenticationResponse {
  token?: string;
  employe:Employe;
}
