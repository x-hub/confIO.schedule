import {Component, OnInit, ViewEncapsulation, Inject, Host} from "@angular/core";
import {Subscription, Observable} from "rxjs";
import {HttpService} from "../service/Http.service";
import {Helper} from "../service/Helper.service";
import {Room} from "../models/Room";
import { ComponentRoot} from "../app.component";
import {ScheduleNormalComponent} from "../schedule-normal/schedule-normal.component";
import {ActivatedRoute} from "@angular/router";
declare const $: any;

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  public Rooms: Room[] = [];
  public AllRooms: Room[] = [];
  public maxItems: number = 5;
  public next: number = 0;
  public OpacityNext: boolean = false;
  public OpacityPrevious: Boolean = false;
  public RoomSubscription: Subscription;

  constructor(@Host() public Parent:ScheduleNormalComponent,
              private _Http: HttpService,
              private ActivatedRoute:ActivatedRoute,
              private _Helper: Helper) {
  }

  public Next() {
    var Total = this.AllRooms.length - this.next;
    if (Total > this.maxItems) {
      this.next++;
      this.Rooms = this.AllRooms.slice(this.next, this.maxItems + this.next);
      this.emitChangeRooms();
    }
    this.setNextPreviousOpacity()

  }

  public Previous() {
    if (this.next > 0) {
      this.next--;
      this.Rooms = this.AllRooms.slice(this.next, this.maxItems + this.next);
      this.emitChangeRooms();
    }
    this.setNextPreviousOpacity()
  }

  setNextPreviousOpacity() {
    var Total = this.AllRooms.length - this.next;
    this.OpacityNext = (Total <= this.maxItems)
    this.OpacityPrevious = (this.next === 0);
  }

  reduceRoom(Rooms: Room[]) {
    this.Rooms = Rooms.slice(this.next, this.maxItems + this.next);
  }

  ngOnInit(): void {
    this.RoomSubscription = this.ActivatedRoute.firstChild.params.flatMap((e)=>{
     return this._Http.Rooms(e.day);
    }).subscribe((json: any) => {
      this.AllRooms = json;
      this.reduceRoom(this.AllRooms);
      this.setNextPreviousOpacity();
      this.emitChangeRooms();
      this.responsive(window.innerWidth);
    })
    Observable.fromEvent(window, 'resize').debounceTime(300).subscribe(($event) => {
      var windowWidth = $event['target'].innerWidth;
      this.responsive(windowWidth);
    })
  }

  responsive(windowWidth: number) {
    if (windowWidth <= 600) this.maxItems = 1;
    else if (windowWidth <= 800) this.maxItems = 2;
    else if (windowWidth <= 1000) this.maxItems = 3;
    else if (windowWidth <= 1100) this.maxItems = 4;
    else this.maxItems = 5;
    if (this.maxItems != this.Rooms.length) {
      this.reduceRoom(this.AllRooms);
      this.setNextPreviousOpacity();
      this._Helper.roomChange.next(this.Rooms);
    }
  }

  emitChangeRooms() {
    this._Helper.roomChange.next(this.Rooms);
  }

  ngOnDestroy(): void {
    this.RoomSubscription && this.RoomSubscription.unsubscribe();
  }
}
