import {Directive, ElementRef, HostListener, OnInit} from '@angular/core';
declare const $:any;
@Directive({
  selector: '[scall]'
})
export class GrowDirective implements OnInit{
  private elt:any;
  private height:number;
  @HostListener('mouseover') mousein(){
      if(this.height <=200){
        this.elt.height('auto').animate()
      }
  }
  @HostListener('mouseout') mouseout(){
      this.elt.height(this.height).animate()
  }
  constructor(private element:ElementRef) {

  }
  ngOnInit(): void {
    this.elt=$(this.element.nativeElement);
    this.height = this.elt.height();
  }

}
