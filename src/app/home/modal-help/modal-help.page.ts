import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-modal-help',
  templateUrl: './modal-help.page.html',
  styleUrls: ['./modal-help.page.scss'],
})
export class ModalHelpPage {

  constructor(private modalCtrl: ModalController) { }

    dismissModal() {
      this.modalCtrl.dismiss({
        'dismissed': true
      });
    }
}
