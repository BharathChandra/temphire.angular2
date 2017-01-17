﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ResourceMgtUnitOfWork, StaffingResourceListItem } from './resource-mgt-unit-of-work';
import { BusyService } from '../core/services/common';

@Component({
    moduleId: module.id,
    templateUrl: './resource-mgt.html'
})
export class ResourceMgtComponent implements OnInit, OnDestroy {

    staffingResources: StaffingResourceListItem[];
    staffingResourceId: string;

    private savedOrRejectedSub: Subscription;

    constructor(private unitOfWork: ResourceMgtUnitOfWork, private busyService: BusyService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        if (this.route.firstChild) {
            this.route.firstChild.params.forEach(params => {
                this.staffingResourceId = params['id'];
            });
        }

        this.savedOrRejectedSub = ResourceMgtUnitOfWork.savedOrRejected.subscribe(args => {
            if (!args.rejected) {
                this.loadList(this.unitOfWork, this.busyService).then((data) => {
                    this.staffingResources = data;
                    if (!this.staffingResourceId && data.length > 0) {
                        this.router.navigate(['/resourcemgt', data[0].id]);
                    }
                });
            }
        });
        this.loadList(this.unitOfWork, this.busyService).then((data) => {
            this.staffingResources = data;
            if (!this.staffingResourceId && data.length > 0) {
                this.router.navigate(['/resourcemgt', data[0].id]);
            }
        });
    }

    ngOnDestroy() {
        this.savedOrRejectedSub.unsubscribe();
    }

    onSelect(staffingResource: StaffingResourceListItem) {
        this.router.navigate(['/resourcemgt', staffingResource.id]);
    }

    private loadList = (unitOfWork: ResourceMgtUnitOfWork, busyService: BusyService): Promise<any> => {
        return busyService.busy(new Promise(function (resolve, reject) {
            unitOfWork.staffingResourceListItems.all()
                .then((data) => {                   
                    resolve(data);
                }).catch(e => {
                    reject(e);
                });
        }));
    }
}