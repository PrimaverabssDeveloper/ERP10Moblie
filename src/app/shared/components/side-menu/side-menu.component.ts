import { Component, Input, OnInit, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService, ModulesService } from '../../../core/services';
import { ModuleDefinition } from '../../../core/entities';

@Component({
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

    @Input() contentId: string;
    @Input() menuId: string;

    modulesDefsWithSettings: ModuleDefinition[];

    constructor(
        private translateService: TranslateService,
        private zone: NgZone,
        private alertController: AlertController,
        private navController: NavController,
        private authenticationService: AuthenticationService,
        private modulesService: ModulesService
    ) {}

    /**
    * Execute on page initialization.
    *
    * @memberof SideMenuComponent
    */
    async ngOnInit() {
        this.modulesDefsWithSettings = await this.modulesService.getAvailabeModulesDefinitionsWithSettings();
    }


    /**
     * Show's logout confirmation window.
     *
     * @memberof DashboardPage
     */
    async logoutAction() {
        const header = await this.translateService.get('SHARED.SIDE_MENU_COMPONENT.ALERT_LOGOUT_HEADER').toPromise();
        const message = await this.translateService.get('SHARED.SIDE_MENU_COMPONENT.ALERT_LOGOUT_MESSAGE').toPromise();
        const cancelButton = await this.translateService.get('SHARED.ALERTS.CANCEL').toPromise();
        const okButton = await this.translateService.get('SHARED.ALERTS.OK').toPromise();

        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: [
                {
                    text: cancelButton,
                    role: 'cancel'
                },
                {
                    text: okButton,
                    handler: () => this.zone.run(() => this.logout())
                }
            ]
        });

        await alert.present();
    }

    async changeInstancesAction() {
        this.navController.navigateBack('/shell/instances', { replaceUrl: true});
    }

    private async logout() {
        this.navController.navigateBack(
            ['/authentication'],
            {
                replaceUrl: true,
                queryParams: {
                    'logout': true
                }
            }
        );
    }
}
