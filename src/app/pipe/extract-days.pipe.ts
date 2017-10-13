import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractDays'
})
export class ExtractDaysPipe implements PipeTransform {

  transform(values: any, args?: any): any {
    if(!values) return values;
    return values.map((item)=>{
      return  (item.href.match("\/([a-zA-Z]+)\/?$") && item.href.match("\/([a-zA-Z]+)\/?$")[1]) || "";
    })
  }

}
