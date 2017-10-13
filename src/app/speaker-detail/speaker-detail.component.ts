import {Component, OnInit, Input, ComponentFactoryResolver} from "@angular/core";
import {Http} from "@angular/http";
import {TalkDetailComponent} from "../talk-detail/talk-detail.component";
import {HttpService} from "../service/Http.service";

@Component({
  selector: 'app-speaker-detail',
  templateUrl: './speaker-detail.component.html',
  styleUrls: ['./speaker-detail.component.css']
})
export class SpeakerDetailComponent implements OnInit {
  @Input('Speaker') Speaker;
  @Input('Parent') Parent;
  placeHolderItem;
  constructor(private Http: Http, private ComponentResolver: ComponentFactoryResolver) {}

  talkDetail(talk) {
    this.Http.get(HttpService.replaceProtocol(talk.links[0].href + "/slot")).map(res => res.json()).subscribe((e) => {
      if(this.placeHolderItem) this.placeHolderItem.destroy();
      const talk = e;
      this.Parent.clear();
      this.Parent.clear();
      let factory = this.ComponentResolver.resolveComponentFactory(TalkDetailComponent);
      this.placeHolderItem = this.Parent.createComponent(factory);
      this.placeHolderItem.instance.Detail = talk;
      this.placeHolderItem.instance.Parent = this.Parent;
    })
  }

  ngOnInit() {
  }

}
