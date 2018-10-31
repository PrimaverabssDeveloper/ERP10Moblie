import { AuthenticationService } from './authentication.service';
import { InstancesService } from './instances.service';
import { HttpRequestService } from './http-request.service';
import { InstanceHttpRequestService } from './instance-http-requests.service';
import { CoreStorageService } from './core-storage.service';
import { DomService } from './dom.service';
import { ModulesSummariesService } from './modules-summaries.service';

export * from './authentication.service';
export * from './instances.service';
export * from './http-request.service';
export * from './instance-http-requests.service';
export * from './core-storage.service';
export * from './dom.service';
export * from './modules-summaries.service';

export const SERVICES = [
    AuthenticationService,
    InstancesService,
    HttpRequestService,
    InstanceHttpRequestService,
    CoreStorageService,
    DomService,
    ModulesSummariesService
];
