/**
 * Buy Card API — Mua thẻ cào
 */

import { BuyCardCommand } from './constants';
import { createBuyCardSign, createBalanceSign, httpRequest } from './utils';
import type { ApiConfig, BuyParams, BuyResponse } from './types';

export class BuyCardApi {
    private baseUrl: string;
    private partnerId: string;
    private partnerKey: string;
    private timeout: number;

    constructor(config: ApiConfig) {
        this.baseUrl = config.baseUrl.replace(/\/$/, '');
        this.partnerId = config.partnerId;
        this.partnerKey = config.partnerKey;
        this.timeout = config.timeout;
    }

    /** Mua thẻ cào */
    async buy(params: BuyParams): Promise<BuyResponse> {
        const command = BuyCardCommand.BuyCard;
        const sign = createBuyCardSign(this.partnerKey, this.partnerId, command, params.requestId);

        const body: Record<string, string> = {
            partner_id: this.partnerId,
            request_id: params.requestId,
            service_code: params.serviceCode,
            value: String(params.value),
            qty: String(params.qty),
            command,
            sign,
        };

        const res = await httpRequest<BuyResponse>(`${this.baseUrl}/api/cardws`, {
            method: 'POST',
            body,
            timeout: this.timeout,
        });

        return res.data;
    }

    /** Lấy số dư tài khoản */
    async getBalance(): Promise<unknown> {
        const command = BuyCardCommand.GetBalance;
        const sign = createBalanceSign(this.partnerKey, this.partnerId, command);
        const url = `${this.baseUrl}/api/cardws?partner_id=${encodeURIComponent(this.partnerId)}&command=${command}&sign=${sign}`;

        const res = await httpRequest(url, { method: 'GET', timeout: this.timeout });
        return res.data;
    }

    /** Lấy danh sách sản phẩm thẻ */
    async getProducts(): Promise<unknown> {
        const url = `${this.baseUrl}/api/cardws/products`;
        const res = await httpRequest(url, { method: 'GET', timeout: this.timeout });
        return res.data;
    }
}
