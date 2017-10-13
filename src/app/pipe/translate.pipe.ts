import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  private days={
    "fr":{
      "monday":"lundi",
      "tuesday":"mardi",
      "wednesday":"mercredi",
      "thursday":"jeudi",
      "friday":"vendredi",
      "saturday":"samedi",
      "sunday":"dimanche"
    }
  }
  private navigatorLang = navigator.language || navigator["userLanguage"];
  transform(day: any, type?: any): any {
    if(!type) return day
    switch (type){
      case "day":
        Object.keys(this.days).forEach((item)=>{
          if(this.navigatorLang.toLocaleLowerCase().search(item.toLocaleLowerCase()) != -1){
            var Obj = this.days[item];
            day = Obj[day];
            return;
          }
        })
    }
    return day
  }

}
