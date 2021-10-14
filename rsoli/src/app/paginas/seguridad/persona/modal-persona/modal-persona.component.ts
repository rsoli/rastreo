import { Component, Input, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-persona',
  templateUrl: './modal-persona.component.html',
  styleUrls: ['./modal-persona.component.css']
})
export class ModalPersonaComponent implements OnInit {

  @Input() titulo: string = "";
  value1: string="";
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    console.log("ver ",this.titulo);
  }

}
