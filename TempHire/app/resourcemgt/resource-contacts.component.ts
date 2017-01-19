import { Component, Input, OnInit } from '@angular/core';
import { StaffingResource, State, PhoneNumber, Address, AddressType, PhoneNumberType } from '../core/entities/entity-model';
import { ResourceMgtUnitOfWork } from './resource-mgt-unit-of-work';

@Component({
    selector: 'resource-contacts',
    moduleId: module.id,
    templateUrl: './resource-contacts.html'
})
export class ResourceContactsComponent implements OnInit {

    @Input() model: StaffingResource;

    states: State[];
    addressTypes: AddressType[];
    phoneNumberTypes: PhoneNumberType[];

    constructor(private unitOfWork: ResourceMgtUnitOfWork) {
        this.states = [];
        this.addressTypes = [];
        this.phoneNumberTypes = [];
    }

    ngOnInit() {
        let that = this;
        this.unitOfWork.states.all().then(data => {
            that.states = data.sort((a, b) => {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;

                return 0;
            });
            //that.states = _.sortBy(data, x => x.name);
        });

        this.unitOfWork.addressTypes.all().then(data => {
            that.addressTypes = data.sort((a, b) => {
                var nameA = a.displayName.toUpperCase();
                var nameB = b.displayName.toUpperCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;

                return 0;
            });
            //that.addressTypes = _.sortBy(data, x => x.displayName);
        });

        this.unitOfWork.phoneNumberTypes.all().then(data => {
            that.phoneNumberTypes = data.sort((a, b) => {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;

                return 0;
            });
            //that.phoneNumberTypes = _.sortBy(data, x => x.name);
        });
    }

    addPhoneNumber(type: PhoneNumberType) {
        this.model.addPhoneNumber(type.id);
    }

    deletePhoneNumber(phoneNumber: PhoneNumber) {
        if (phoneNumber.primary || this.model.phoneNumbers.length === 1) return;

        this.model.deletePhoneNumber(phoneNumber);
    }

    setPrimaryPhoneNumber(phoneNumber: PhoneNumber) {
        if (phoneNumber.primary) return;

        this.model.setPrimaryPhoneNumber(phoneNumber);
    }

    addAddress(type: AddressType) {
        this.model.addAddress(type.id);
    }

    deleteAddress(address: Address) {
        if (address.primary || this.model.addresses.length === 1) return;

        this.model.deleteAddress(address);
    }

    setPrimaryAddress(address: Address) {
        if (address.primary) return;

        this.model.setPrimaryAddress(address);
    }
}