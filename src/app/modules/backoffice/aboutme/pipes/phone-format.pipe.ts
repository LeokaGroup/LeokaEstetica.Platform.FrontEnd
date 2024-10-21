import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat'
})
/**
 * Пайп форматирует строку с номером телефона в строку вида: "(012) 345-67-89"
 */
export class PhoneFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (value.length < 10) return '';
    return `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,8)}-${value.slice(8,11)}`;
  }

}
