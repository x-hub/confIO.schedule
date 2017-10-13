
import {Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild} from "@angular/core";

import {ActivatedRoute, Router} from "@angular/router";
import {ScheduleComponent} from "../schedule/schedule.component";
import {RoomsComponent} from "../rooms/rooms.component";
import {Helper} from "../service/Helper.service";
import {HttpService} from "../service/Http.service";
declare const $: any;
declare const _: any;
@Component({
  selector: 'schedule-normale',
  templateUrl: './schedule-normal.component.html',
  styleUrls:  ['./schedule-normal.component.css'],
  animations: []
})
export class ScheduleNormalComponent implements OnInit,OnDestroy {
  @ViewChild("schedule") schedule: ScheduleComponent;
  @ViewChild("room") room: RoomsComponent;
  public tracks = [];
  public talks = [];
  public days;
  public listTracks: any[] = [];
  public listTalks: any[] = [];
  public Imgs;
  public loading=false;
  public showNotif=false;

  constructor(private _Helper: Helper, private _Http: HttpService, private Route: ActivatedRoute) {
    this.Imgs = window["config"].tracksImg || {};
  }

  toggleTracks(id: string, checked: string) {
    this.loading=true
    if (checked) {
      let index = this.listTracks.indexOf(id);
      if (index >= 0) this.listTracks.splice(index, 1);
    } else {
      this.listTracks.push(id);
    }
    this._Helper.trackChange.next(this.listTracks);
    this.closeLoading()
  }

  toggleTalks(talk: string, checked: string) {
    this.loading =true
    if (checked) {
      let index = this.listTalks.indexOf(talk);
      if (index >= 0) this.listTalks.splice(index, 1);
    } else {
      this.listTalks.push(talk);
    }
    this._Helper.talksChange.next(this.listTalks);
    this.closeLoading();
  }

  ngOnDestroy(): void {

  }
  showMessage(notif){
    $(notif).toggleClass("toggle");
  }
  closeLoading(time?){
    this.loading=true
    setTimeout(()=>this.loading=false,time || 600)
  }
  ngOnInit(): void {
    this.loading = true;
    this._Helper.tracks.subscribe((e) => {
      this.tracks = e;
      this.tracks.map(e => {
        var found = _.find(this.listTracks, (item) => item == e.id)
        if (found) e.selected = true;
        else e.selected = false;
      })

    })
    this._Helper.talks.subscribe((e) => {
      this.talks = e;
      this.talks.map((e) => {
        var found = _.find(this.listTalks, (item) => item == e.label)
        if (found) e.selected = true;
        else e.selected = false;
      })
      this.closeLoading()
    })
    this.days = window["config"].days;
    this.Route.children[0].params.subscribe((e) => {
      this.showNotif = (e['day'] === this.days[0]) ;
    })
  }
}
