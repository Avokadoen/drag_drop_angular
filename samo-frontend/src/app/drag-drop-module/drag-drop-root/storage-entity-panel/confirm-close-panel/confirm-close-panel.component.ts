import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ConfirmClosePanelConfig} from "../../../model/entity-panel-dialog-models";

@Component({
  selector: 'app-confirm-close-panel',
  templateUrl: './confirm-close-panel.component.html',
  styleUrls: ['./confirm-close-panel.component.css']
})
export class ConfirmClosePanelComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public config: ConfirmClosePanelConfig) {}

  ngOnInit() {
  }

}
