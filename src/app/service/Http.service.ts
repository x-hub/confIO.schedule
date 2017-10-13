import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {Room} from "../models/Room";
import {Schedule} from "../models/Schedule";

/**
 * Created by Hassan on 6/16/2017.
 */

@Injectable()
export class HttpService {
  private static protocol: string = window.location.protocol.slice(0, -1);
  private ScheduleUrl
  private RoomUrl;
  private Occupiedrooms
  private Tracks;
  private Talks;
  private Training;

  constructor(private Http: Http) {
    var config = window["config"];
    this.ScheduleUrl = config["apiLink"].ScheduleUrl;
    this.RoomUrl = config["apiLink"].RoomUrl;
    this.Tracks = config["apiLink"].Tracks;
    this.Talks = config["apiLink"].Talks;
    this.Training = config["apiLink"].Training;
    this.Occupiedrooms=config["apiLink"].Occupiedrooms;
  }

  public static replaceProtocol(url: string) {
    return url.replace(/^[^:]+/, HttpService.protocol);
  }

  public Schedule(day: string, code?: string): Observable<Schedule[]> {
    if (code)
      return this.Http.get(this.ScheduleUrl + day + "/" + code).map((response: Response) => response.json().slots);
    return this.Http.get(this.ScheduleUrl + day).map((response: Response) => response.json().slots);
  }

  public Schedules(): Observable<Schedule[]> {
    return this.Http.get(this.ScheduleUrl).map((response: Response) => response.json().links);
  }

  public Rooms(day?:string): Observable<Room[]> {
    if (day)
      return this.Http.get(this.Occupiedrooms+ "/" + day).map((response: Response) => response.json().rooms);
    return this.Http.get(this.RoomUrl).map((response: Response) => response.json().rooms);
  }

  public ScheduleByRoomDay(roomId: string, day: string): Observable<any> {
    return this.Http.get(this.RoomUrl + roomId + "/" + day).map((response: Response) => response.json().slots);
  }

  public tracks(): Observable<any> {
    return this.Http.get(this.Tracks).map((response: Response) => response.json().tracks);
  }

  public talks(): Observable<any> {
    return this.Http.get(this.Talks).map(response => response.json().proposalTypes);
  }

  public SpeakerByUrl(url: string): Observable<any> {
    return this.Http.get(HttpService.replaceProtocol(url)).timeout(1500).map((response: Response) => response.json().avatarURL)
  }

  public Speaker(url: string): Observable<any> {
    return this.Http.get(HttpService.replaceProtocol(url)).map(response => response.json());
  }

  public training() {
    return this.Http.get(this.Training).map(response => response.json().slots);
  }


}
