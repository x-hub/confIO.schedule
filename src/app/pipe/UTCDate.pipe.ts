
import {Pipe, PipeTransform} from "@angular/core";
declare var moment:any;

@Pipe({
  name: 'UTCDate'
})
export  class UTCDate implements PipeTransform {
  transform(value:any, args:string[]):any {
    if (value) {
      var date = value instanceof Date ? value : new Date(value);
      date = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
      return moment(date).format(args[0],{ trim: false });
    }
  }
}
