import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
declare var $:any;
declare var window:any;
@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: []
})
export class ComponentRoot implements OnInit{
  @ViewChild('slider') slider;
  @ViewChild('navigation') navigation;
  @ViewChild('arrowTop') arrowTop;
  private  days;
  logoImg;
  showScheduleTraining;
  constructor(private Router:Router){
    this.days = window["config"].days;
    this.logoImg = window.config.logoImg;
  }
  slide(){
    $(this.navigation.nativeElement).toggleClass("in");
  }
  ngOnInit(): void {
    this.Router.events.
    filter((e)=> e instanceof NavigationEnd).
    subscribe((e)=>{
     let result = e['url'].match("/schedule/([a-z]+)")
      if(!result){
        this.showScheduleTraining =true
      }else{
        let day =  result[1]
        this.showScheduleTraining = (day === this.days[0])
      }
    })
    $(window).scroll(()=> {
      if ($(window).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $(this.arrowTop.nativeElement).fadeIn(200);    // Fade in the arrow
      } else {
        $(this.arrowTop.nativeElement).fadeOut(200);   // Else fade out the arrow
      }
    });
    $(this.arrowTop.nativeElement).click(function() {      // When arrow is clicked
      $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
      }, 500);
    });
  }
}
