/* tslint:disable */
/* eslint-disable */
import {Role} from "./role.model";

export interface RegistrationRequest {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  role:Role;
}
