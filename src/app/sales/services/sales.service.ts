import { SalesSummary, Company, SalesCharts, SalesSettings } from '../entities';
import { InstanceHttpRequestService, DomService } from '../../core/services';
import { TotalSalesTickerComponent, DailySalesTickerComponent } from '../components';
import { SalesStorageService } from './sales-storage.service';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

const SALES_SUMMARY = '/sales';

/**
 * The Sales Service provide all data needed to the Sales Module.
 * It has all data requests to the server
 * and transform the data to be used on presentation component.
 *
 * @export
 * @class SalesService
 */
export class SalesService {

    // #region 'Private Properteis'

    private _useReferenceCurrencySettingChanged: EventEmitter<any>;

    // #endregion

    // #region 'Public Properteis'

    /**
     * Event that notifies when the 'useReferenceCurrency' setting value is changed.
     *
     * @readonly
     * @type {Observable<any>}
     * @memberof SalesService
     */
    get useReferenceCurrencySettingChanged(): Observable<any> {
        return this._useReferenceCurrencySettingChanged.asObservable();
    }

    // #endregion

    // #region 'Constructor'

    /**
     * Creates an instance of SalesService.
     * @param {InstanceHttpRequestService} instanceHttpRequestService
     * @param {DomService} domService
     * @memberof SalesService
     */
    constructor(
        protected instanceHttpRequestService: InstanceHttpRequestService,
        protected domService: DomService,
        protected storage: SalesStorageService
        ) {
            this._useReferenceCurrencySettingChanged = new EventEmitter();
    }

    // #endregion

    // #region 'Public Methods'


    async createSalesSummaryTickers(): Promise<HTMLElement[]> {

        const salesSummary = await this.getSalesSummary();

        const htmlTickers: HTMLElement[] = [];
        for (const company of salesSummary.companies) {

            // total sales ticker
            const totalSalesTickerHtml = this.domService.createComponent(TotalSalesTickerComponent, { companySalesSummary: company });
            htmlTickers.push(totalSalesTickerHtml);

            // daily sales ticker
            const dailySalesProperties = { companyDailySalesSummary: company.dailySales };
            const dailySalesTickerHtml = this.domService.createComponent(DailySalesTickerComponent, dailySalesProperties);
            htmlTickers.push(dailySalesTickerHtml);
        }

        return htmlTickers;
    }

    /**
     * Get the companies.
     *
     * @returns {Promise<Company[]>}
     * @memberof SalesService
     */
    async getCompanies(): Promise<Company[]> {
        const salesSummary = await this.getSalesSummary();
        let companies: Company[];

        if (salesSummary && salesSummary.companies) {
            companies = this.extractCompaniesFromSalesSummary(salesSummary);
        }

        return companies;
    }

    /**
     * Gets the Sales Summaries
     *
     * @returns {Promise<SalesSummary>}
     * @memberof SalesService
     */
    async getSalesSummary(): Promise<SalesSummary> {

        let salesSummary: SalesSummary;

        try {
            salesSummary = await this.instanceHttpRequestService
                                     .get<SalesSummary>(SALES_SUMMARY);
        } catch (error) {
            console.log(error);
            return null;
        }

        return salesSummary;
    }

    async getSalesCharts(): Promise<SalesCharts> {

        // let salesSummary: SalesSummary;

        // try {
        //     salesSummary = await this.instanceHttpRequestService
        //         .get<SalesSummary>(SALES_SUMMARY)
        //         .toPromise();
        // } catch (error) {
        //     console.log(error);
        //     return null;
        // }

        // return salesSummary;
        return null;
    }

    /**
     * Return if the reference currency must be used instead of the default currency.
     * The reference currency is also known as 'reporting currency'.
     *
     * @returns {Promise<boolean>}
     * @memberof SalesService
     */
    async useReferenceCurrencyAsync(): Promise<boolean> {
        const settings = await this.getSettingsAsync();
        return settings.useReferenceCurrency;
    }

    /**
     * Provide the sales setting.
     *
     * @returns {Promise<SalesSettings>}
     * @memberof SalesService
     */
    async getSettingsAsync(): Promise<SalesSettings> {
        let settings: SalesSettings = await this.storage.getData<SalesSettings>('SETTINGS', true);

        // create the default settings state
        if (!settings) {
            settings = {
                useReferenceCurrency: false,
                showAggregateData: true,
                showDailySales: true
            };
        }

        return settings;
    }

    /**
     * Stores the sales settings.
     *
     * @param {SalesSettings} settings
     * @memberof SalesService
     */
    async updateSettingsAsync(settings: SalesSettings) {
        const currentSettings = await this.getSettingsAsync();

        // if the useReferenceCurrency setting changed, emit an event
        if (currentSettings.useReferenceCurrency !== settings.useReferenceCurrency) {
            this._useReferenceCurrencySettingChanged.emit();
        }

        await this.storage.setData('SETTINGS', settings, true);
    }


    // #endregion

    // #region 'Private Methods'

    private extractCompaniesFromSalesSummary(salesSummary: SalesSummary): Company[] {
        if (salesSummary && salesSummary.companies) {
            return salesSummary.companies.map(css => ({ key: css.key, name: css.name }));
        } else {
            return [];
        }
    }

    // #endregion
}
