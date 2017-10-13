import {Component, OnInit, Input, ComponentFactoryResolver} from "@angular/core";
import {HttpService} from "../service/Http.service";
import {SpeakerDetailComponent} from "../speaker-detail/speaker-detail.component";
import {ModalService} from "../service/modal.service";

@Component({
  selector: 'app-talk-detail',
  templateUrl: './talk-detail.component.html',
  styleUrls: ['./talk-detail.component.css']
})
export class TalkDetailComponent implements OnInit {
  @Input('Detail') Detail;
  @Input('Parent') Parent;
  placeHolderItem;
  Imgs = window["config"].tracksImg || {};

  constructor(public ComponentResolver: ComponentFactoryResolver,
              private Http: HttpService) {
  }
  toSpeaker(speaker) {
    this.Http.Speaker(speaker.link.href).subscribe((e) => {
      if (this.placeHolderItem) this.placeHolderItem.destroy();
      let Speaker = e;
      this.Parent.clear();
      let factory = this.ComponentResolver.resolveComponentFactory(SpeakerDetailComponent);
      this.placeHolderItem = this.Parent.createComponent(factory);
      this.placeHolderItem.instance.Speaker = Speaker;
      this.placeHolderItem.instance.Parent = this.Parent;
    })
  }

  ngOnInit() {
  }

}
