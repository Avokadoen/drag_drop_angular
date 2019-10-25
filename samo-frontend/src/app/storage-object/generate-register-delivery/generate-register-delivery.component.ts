import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StorageObjectData} from '../../shared/models/storage-object-data';
import {ContractType} from '../../shared/models/contract-type.enum';
import {MaterialCondition} from '../../shared/models/material-condition.enum';
import {MaterialType} from '../../shared/models/material-type.enum';

@Component({
  selector: 'app-generate-register-delivery',
  templateUrl: './generate-register-delivery.component.html',
  styleUrls: ['./generate-register-delivery.component.css']
})
export class GenerateRegisterDeliveryComponent implements OnInit {

  formGroup: FormGroup;
  // TODO: ContractType iter pipe for html selection
  allContractType = [ContractType.RETURN, ContractType.KEEP];

  constructor() { }

  ngOnInit() {
    // TODO: id rangeS, custom validator on fields
    const commonValidators = [Validators.required];
    this.formGroup =  new FormGroup({
      idPrefixForm:    new FormControl('sss', commonValidators),
      idRangeForm:     new FormControl('100', commonValidators),
      collectionTitleForm: new FormControl('test', commonValidators),
      contractTypeForm: new FormControl(ContractType.UNSET, commonValidators),
    });
  }

  // TODO: backend logic
  // request generation with form -> response with ok and a delivery id or error on invalid form or auth
  // when response is received, route to delivery list with id
  generateDelivery(): StorageObjectData[] {

    if (this.formGroup.invalid || this.formGroup.errors) {
      return null;
    }

    const objectCount = Number(this.formGroup.get('idRangeForm').value);
    let current = 0;
    const idPrefix = this.formGroup.get('idPrefixForm').value;
    const objectArray = new Array<StorageObjectData>(objectCount);
    for (let i = 0; i < objectCount; i++) {
      objectArray[i] = {
          nbId: idPrefix + current++,
          collectionTitle: this.formGroup.get('collectionTitleForm').value,
          containerId: '',
          contractType: this.formGroup.get('contractTypeForm').value,
          externalId: '',
          materialCondition: MaterialCondition.UNSET,
          materialType: MaterialType.UNSET,
          notice: '',
          organisationId: ''
        };
    }

    console.log(objectArray);
    return objectArray;
  }
}
