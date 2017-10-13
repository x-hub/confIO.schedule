import {
  Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {HttpService} from '../service/Http.service';
import {SpeakerDetailComponent} from "../speaker-detail/speaker-detail.component";
import {ModalService} from "../service/modal.service";

@Component({
  selector: 'app-schedule-training',
  templateUrl: './schedule-training.component.html',
  styleUrls: ['./schedule-training.component.css'],

})
export class ScheduleTrainingComponent implements OnInit {
  Imgs;
  slots= [];
  @ViewChild('detailModal', {read: ViewContainerRef}) detailModal: ViewContainerRef;
  placeHolder;
  constructor(private HttpService: HttpService
              ,private ComponentResolver: ComponentFactoryResolver
              ,private modalService:ModalService) {
    this.Imgs = window['config'].tracksImg || {};
  }
  toSpeaker(speaker) {
    this.HttpService.Speaker(speaker.link.href).subscribe((e) => {
      if (this.placeHolder) this.placeHolder.destroy();
      let Speaker = e;
      this.detailModal.clear();
      let factory = this.ComponentResolver.resolveComponentFactory(SpeakerDetailComponent);
      this.placeHolder = this.detailModal.createComponent(factory);
      this.placeHolder.instance.Speaker = Speaker;
      this.placeHolder.instance.Parent = this.detailModal;
      this.modalService.open('content');
    })
  }
  ngOnInit() {
    this.HttpService.training().subscribe((e) => {
      this.slots=e;
    });

  }

}
