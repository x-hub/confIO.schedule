import {Subject} from "rxjs";
/**
 * Created by Hassan on 6/16/2017.
 */

export class Helper {
  public roomChange: Subject<any> = new Subject();
  public trackChange: Subject<any> = new Subject();
  public talksChange: Subject<any> = new Subject();
  public talks: Subject<any> = new Subject();
  public tracks: Subject<any> = new Subject();
  public openPopup(url: string, title: string, width: number, height: number){
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen["left"];
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen["top"];

    var Windowwidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var Windowheight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((Windowwidth / 2) - (width / 2)) + dualScreenLeft;
    var top = ((Windowheight / 2) - (height / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, `scrollbars=yes,width=${width},height=${height} top=${top}, left=${left}`);

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus();
    }

  }
  public  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
}
