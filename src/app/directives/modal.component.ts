import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
declare const $: any;
declare const _: any;
import {ModalService} from "../service/modal.service";
import {Observable} from "rxjs";

@Component({
    moduleId: module.id.toString(),
    selector: 'modal',
    template: '<ng-content></ng-content>'
})

export class ModalComponent implements OnInit, OnDestroy {
    @Input() id: string;
    private element:any;
    private closeSubscription;

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = $(el.nativeElement);
    }

    ngOnInit(): void {
        let modal = this;

        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        this.element.appendTo('body');

        this.element.on('click', function (e: any) {
            var target = $(e.target);
            if (!target.closest('.modal-body').length) {
                modal.close();
            }
        });

        this.modalService.add(this);
        this.closeSubscription=Observable.fromEvent(window.document,'keyup').skipWhile((e:any) => !(e.keyCode == 27)).subscribe((e)=>{
          this.close();
        })
    }


    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
      this.closeSubscription.unsubscribe();
    }


    open(): void {
        this.element.show();
        $('body').addClass('modal-open');

    }

    close(): void {
        this.element.hide();
        $('body').removeClass('modal-open');

    }
}
