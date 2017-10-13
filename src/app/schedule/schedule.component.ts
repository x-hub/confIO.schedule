import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {HttpService} from '../service/Http.service';
import {Observable, Subscription} from 'rxjs';
import {Helper} from '../service/Helper.service';
import {Room} from '../models/Room';
import {ActivatedRoute} from '@angular/router';
import {ModalService} from '../service/modal.service';
import {TalkDetailComponent} from '../talk-detail/talk-detail.component';

declare let $: any;
declare let _: any;
declare let encodeURIComponent: any;


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit, OnDestroy {
  public Imgs;
  public BreakImgs;
  public Houres = [];
  public Schedule = [];
  public rooms: Room[]=[];
  public tracksId: any[] = [];
  public talks: any[] = [];
  public Keynotes: any = [];
  public Breaks: any = [];
  public ScheduleSubscription: Subscription;
  public FiltreSubscription: Subscription;
  public dayChangeSubscription: Subscription;
  public Speaker: any;
  public Detail: any;
  @Input() public day = 'tuesday';
  @ViewChild('detailModal', {read: ViewContainerRef}) detailModal: ViewContainerRef;
  public placeHolderItem;

  constructor(public Http: HttpService, public _Helper: Helper, private ComponenetResolver: ComponentFactoryResolver,
              public ActivatedRoute: ActivatedRoute, public modalService: ModalService) {
    this.Imgs = window['config'].tracksImg || {};
    this.BreakImgs = window['config'].breaksImg || {};
  }

  getSchedule(): Observable<any> {
    let Request = [];
    this.rooms.forEach((room, index) => {
      Request.push(this.Http.ScheduleByRoomDay(room["roomId"], this.day));
    });
    return Observable.forkJoin(Request);
  }

  caluleHoursHeight(timeObject: any) {
    if (timeObject.break) {
      let Houre = _.find(this.Houres, function (user) {
        return timeObject.fromTimeMillis >= user.fromTimeMillis && timeObject.toTimeMillis <= user.toTimeMillis;
      });
      if (Houre) {
        return Houre.height;
      }
    }

    return 230;
  }

  calculeTop(timeObject: any): number {
    let array = _.filter(this.Houres, (e) => {
      return (e.fromTimeMillis < timeObject.fromTimeMillis && e.toTimeMillis < timeObject.toTimeMillis );
    });
    array = _.map(array, 'height');
    let top = _.sum(array);
    return top + (15 * array.length);
  }

  jQueryResize() {
    let $totalWidth = $('schedule').width();
    let $width = $('.salles .title').eq(0).width();
    $('.schedule .event .event-item').each(function (a, elt) {
      let coef = $(elt).data('col');
      let type = $(elt).data('type');
      if (type == 'Keynote' || type == 'break') {
        $(elt).css({left: 0, right: '10px'});
      } else
        $(elt).css('left', coef * ($width + 10)).width($width);
    });
  }

  ngOnInit() {

    this.Schedule = [];
    this.Schedule.push([]);
    this.FiltreSubscription = this._Helper.trackChange.subscribe((e) => {
      this.tracksId = e;
      this.filter(e, this.talks);
    });
    this._Helper.talksChange.subscribe((e) => {
      this.talks = e;
      this.filter(this.tracksId, e);
    });

    this.ActivatedRoute.params.switchMap((e) => {
      this.day = e['day'];
      this.Houres = []
      return this._Helper.roomChange;
    }).switchMap((e) => {
      this.rooms = e;
      return (this.rooms.length === 0 ? [[]] : this.getSchedule());
    }).switchMap((data) => {
      this.Schedule = data.slice();
      return Observable.forkJoin([this.Http.Schedule(this.day, 'key'), this.Http.Schedule(this.day)]);
    }).subscribe((e) => {
      this.Keynotes = e[0];
      this.Breaks = e[1].filter((item) => item.break);
      this.filter(this.tracksId, this.talks);
    });
  }

  sortData(schedule) {
    let array = _.union(...schedule); //[[]] ArrayRooms[[ArraySlots]]
    array = _.filter(array, (e) => e.talk);
    if (array.length) {
      let Houres = _(array).uniqBy('fromTimeMillis').map((e) => {
        return {
          fromTimeMillis: e.fromTimeMillis,
          toTimeMillis: e.toTimeMillis
        };
      }).sortBy('fromTimeMillis').value();
      this.Houres = [];
      let HouresKeynotes = _(this.Keynotes).uniqBy('fromTimeMillis').map((e) => {
        return {
          fromTimeMillis: e.fromTimeMillis,
          toTimeMillis: e.toTimeMillis
        };
      }).sortBy('fromTimeMillis').value();
      let HouresBreaks = _(this.Breaks).uniqBy('fromTimeMillis').map((e) => {
        return {
          fromTimeMillis: e.fromTimeMillis,
          toTimeMillis: e.toTimeMillis
        };
      }).sortBy('fromTimeMillis').value();
      ;
      Houres = _.unionBy(Houres, HouresKeynotes, HouresBreaks, 'fromTimeMillis');
      Houres = _.uniqBy(Houres, 'fromTimeMillis');
      Houres = _.sortBy(Houres, 'fromTimeMillis');
      Houres.forEach((e, i) => {
        if (!this.Houres.length) {
          e.height = this.caluleHoursHeight(e);
          this.Houres.push(e);
        } else {
          let obj = this.Houres[this.Houres.length - 1];
          if (obj.toTimeMillis > e.fromTimeMillis) {
            obj.toTimeMillis = Math.max(e.toTimeMillis, obj.toTimeMillis);
            obj.fromTimeMillis = Math.min(e.fromTimeMillis, obj.fromTimeMillis);
            obj.inLunch = true;
            obj.height = this.caluleHoursHeight(obj) + 200;
            //this.Houres.push(e);
          } else {
            e.height = this.caluleHoursHeight(e);
            this.Houres.push(e);
          }
        }
      });


    }
    let items = [];
    schedule.forEach((item) => {
      items.push(item.filter(i => {
          return !((i.break !=null) || (i.talk && (i.talk.talkType === 'Keynote' || i.talk.talkType === 'Training')));

      }));
    });
    items.push(this.Keynotes);
    items.push(this.Breaks);
    let talksTracks = _.union(...items);
    this.setTalks(talksTracks);
    this.setTracks(talksTracks);
    return items;
  }

  setTalks(items) {
    let talks = _(items).map('talk').filter(i => i).uniqBy('talkType').map(e => {
      return {
        label: e.talkType
      };
    }).value();

    this._Helper.talks.next(talks);

  }

  setTracks(items) {
    let tracks = _(items).map('talk').filter(i => i).uniqBy('trackId').map(e => {
      return {
        id: e.trackId,
        title: e.track
      };
    }).value();
    this._Helper.tracks.next(tracks);
  }

  filter(tracksId: any[], talks: any[]) {
    this.Schedule.map((items) => {
      items.forEach(function (item) {
        let foundTrack = tracksId.find((elt) => {
          return item.talk && elt == item.talk.trackId;
        });
        let foundTalk = talks.find((elt) => {
          return item && item.talk && elt.toLocaleLowerCase() == item.talk.talkType.toLocaleLowerCase();
        });
        if (foundTrack || foundTalk) item.opacity = 0.4;
        else item.opacity = 1;
      });
    });
    this.Schedule = this.sortData(this.Schedule.slice());
  }


  detail(talk: any) {
    if (talk.opacity && talk.opacity != 1) return;
    if (this.placeHolderItem) this.placeHolderItem.destroy();
    this.detailModal.clear();
    let factoryDetail = this.ComponenetResolver.resolveComponentFactory(TalkDetailComponent);
    this.placeHolderItem = this.detailModal.createComponent(factoryDetail);
    this.placeHolderItem.instance.Detail = talk;
    this.placeHolderItem.instance.Parent = this.detailModal;
    this.modalService.open('content');


  }

  shareOnTwitter(talkId: string,title:string,speakers:any[]) {
    let joinedSpeakers = speakers.map((e)=>e.name).join(",");
    let bodyText=`#DevoxxMA Checkout this talk  ${title} by ${joinedSpeakers}`;
    let currentYear = new Date().getFullYear();
    let link = `${window['talkLink'] || "https://cfp.devoxx.ma/2017/talk"}/${talkId}`;
    let url = `http://twitter.com/share?url=${encodeURIComponent(link)}&text=${encodeURIComponent(bodyText)}`;
    this._Helper.openPopup(url,'',520,270);
  }

  ngOnDestroy() {
    this.ScheduleSubscription &&this.ScheduleSubscription.unsubscribe();
    this.dayChangeSubscription && this.dayChangeSubscription.unsubscribe();
    this.FiltreSubscription && this.FiltreSubscription.unsubscribe();
  }
}
