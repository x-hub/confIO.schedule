import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {HttpService} from "./service/Http.service";
import {RoomsComponent} from "./rooms/rooms.component";
import {ScheduleComponent} from "./schedule/schedule.component";
import {Helper} from "./service/Helper.service";
import {GrowDirective} from "./directives/grow.directive";
import {LazyImgDirective} from "./directives/lazy-img.directive";
import {Route, RouterModule} from "@angular/router";
import {ExtractDaysPipe} from "./pipe/extract-days.pipe";
import {TranslatePipe} from "./pipe/translate.pipe";
import {ModalService} from "./service/modal.service";
import {ModalComponent} from "./directives/modal.component";
import {TalkDetailComponent} from "./talk-detail/talk-detail.component";
import {SpeakerDetailComponent} from "./speaker-detail/speaker-detail.component";
import { ScheduleTrainingComponent } from './schedule-training/schedule-training.component';
import { ServiceWorkerModule }  from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ScheduleNormalComponent } from './schedule-normal/schedule-normal.component';
import {ComponentRoot} from "./app.component";

var routes: Route[] = [
  {path :"day",component:ScheduleNormalComponent,
    children:[{path: ":day", component: ScheduleComponent},
      {path: "**", pathMatch: 'full',redirectTo: "/day/tuesday"}]},
  {path:"training",component:ScheduleTrainingComponent},
  {path: "**", pathMatch: 'full',redirectTo: "/day/tuesday"}

]
@NgModule({
  declarations: [
    ComponentRoot,
    RoomsComponent,
    ScheduleComponent,
    GrowDirective,
    LazyImgDirective,
    ExtractDaysPipe,
    TranslatePipe,
    ModalComponent,
    TalkDetailComponent,
    SpeakerDetailComponent,
    ScheduleTrainingComponent,
    ScheduleNormalComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    environment.production ? ServiceWorkerModule.register('/service-worker.js') : [],
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : [],
    RouterModule.forRoot(routes)
  ],
  exports: [
    ComponentRoot
  ],
  entryComponents: [TalkDetailComponent, SpeakerDetailComponent],
  providers: [HttpService, Helper, ModalService],
  bootstrap: [ComponentRoot]
})
export class AppModule {
}
