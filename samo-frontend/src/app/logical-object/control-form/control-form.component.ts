import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {StorageObjectData} from '../../models/storage-object-data';
import {MaterialType} from '../../models/material-type.enum';
import {ContractType} from '../../models/contract-type.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

// TODO: formcontrol for each field

@Component({
  selector: 'app-control-form',
  templateUrl: './control-form.component.html',
  styleUrls: ['./control-form.component.css']
})
export class ControlFormComponent implements OnInit {

  objectFormGroup: FormGroup;
  validForm = false; // todo: enum with error handling

  // TODO: inserted or fetched through service
  allOrganisationId = ['Burde', 'lastes', 'inn', 'fra', 'f.eks', 'brønnøysundregistrene?'];
  // TODO: MaterialType iter pipe for html selection
  allMaterialType = [MaterialType.FILM, MaterialType.AUDIO];
  // TODO: ContractType iter pipe for html selection
  allContractType = [ContractType.RETURN, ContractType.KEEP];

  filteredOptions: Observable<string[]>;

  constructor(
    public dialogRef: MatDialogRef<ControlFormComponent>,
    @Inject(MAT_DIALOG_DATA) public objectData: StorageObjectData) {}

  ngOnInit() {
    // init form control group
    const commonValidators = [Validators.required, Validators.min(4)];

    this.objectFormGroup =  new FormGroup({
      nbId:               new FormControl(this.objectData.nbId, commonValidators),
     // organisationId:     new FormControl(this.objectData.organisationId, commonValidators),
      externalId:         new FormControl(this.objectData.externalId, commonValidators),
      materialType:       new FormControl(this.objectData.materialType, commonValidators),
      materialCondition:  new FormControl(this.objectData.materialCondition, commonValidators),
      contractType:       new FormControl(this.objectData.contractType, commonValidators),
      collectionTitle:    new FormControl(this.objectData.collectionTitle, commonValidators),
      notice:             new FormControl(this.objectData.notice),
      containerId:        new FormControl(this.objectData.containerId, commonValidators),
    });

    /*this.filteredOptions = this.objectFormGroup.get('organisationId').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );*/

    this.validForm = !this.objectFormGroup.errors;
    this.objectFormGroup.valueChanges.subscribe(() => {
      this.validForm = !this.objectFormGroup.errors && !this.objectFormGroup.invalid;
    });

    // TODO: load OrganisationNrOptions
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allOrganisationId.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  // TODO: we should resolve this with routing as each object dialog should be routing based
  openNextDialog(): void {
    this.dialogRef.close();
  }
  openPreviousDialog(): void {
    this.dialogRef.close();
  }
  closeSaveDialog(): void {
    // TODO: error if input errors, disable button
    const newObjectData: StorageObjectData = this.objectFormGroup.value;
    console.log(newObjectData.nbId);
    this.dialogRef.close(newObjectData);
  }
}
