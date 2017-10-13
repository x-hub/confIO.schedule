import {Directive, Input, ElementRef, OnInit} from '@angular/core';
import {HttpService} from "../service/Http.service";
declare const $:any;
declare const window:any;
@Directive({
  selector: '[appLazyImg]'
})
export class LazyImgDirective implements OnInit{
  @Input('appLazyImg') url:string;
  constructor(private Element:ElementRef,private _Http:HttpService) {}
  ngOnInit(): void {
    $(this.Element.nativeElement).attr('src', window.config.loadingImg).animate();
    if(this.url){
      this._Http.SpeakerByUrl(this.url).subscribe((e)=>{
        $(this.Element.nativeElement).attr('src',e ? e : "https://avatars2.githubusercontent.com/adob?v=3&s=40").animate();
      },(error)=>{
        $(this.Element.nativeElement).attr('src',"https://avatars2.githubusercontent.com/adob?v=3&s=40").animate();
      },()=>{
        //
      })
    }
  }
}
