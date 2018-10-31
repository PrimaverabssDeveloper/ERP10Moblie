import { Injectable } from '@angular/core';

import Auth0Cordova from '@auth0/cordova';
import { HttpClient } from '@angular/common/http';

const authenticationSettings = require('../../../authentication-settings.json');

/**
 * Handle authentication.
 *
 * @export
 * @class AuthenticationService
 */
@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {

    constructor(private http: HttpClient) {
    }

    authenticate() {

        return;

        // Redirect back to app after authenticating
        (window as any).handleOpenURL = (url: string) => {
            // replace the spaces on url with the space code '%20';
            const finalUrl = url.split(' ').join('%20');

            Auth0Cordova.onRedirectUri(finalUrl);
        };

        // https://github.com/auth0/auth0-cordova

        const auth0 = new Auth0Cordova({
            domain: 'stg-identity.primaverabss.com/connect',
            clientId: authenticationSettings.clientId,
            packageIdentifier: 'com.primavera.v10',
        });

        const options = {
            scope: 'openid profile email lithium-mobile offline_access',
            responseType: 'code token',
            redirectUri: 'com.primavera.v10://'
        };

        auth0.authorize(options, function (err, result) {
            if (err) {
                console.log('Error authenticating');
            } else {
                console.log('Authentication with success');
            }
        });
    }
}
