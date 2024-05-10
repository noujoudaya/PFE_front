import { Pipe, PipeTransform } from '@angular/core';
import {StatutConge} from "./statutConge.enum";

@Pipe({
  standalone: true,
  name: 'enumToString'
})
export class EnumToStringPipe implements PipeTransform {
  transform(value: any): string {
    return StatutConge[value];
  }
}
