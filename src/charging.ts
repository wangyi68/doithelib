/**
 * Charging API — Đổi thẻ cào
 */

import { ChargingCommand } from './constants';
import { createChargingSign, httpRequest } from './utils';
import type { ApiConfig, SendCardParams, CheckCardParams, ChargeResponse, FeeItem, CheckApiResponse } from './types';

export class ChargingApi {
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

    /** Gửi thẻ cào để đổi */
    async sendCard(params: SendCardParams): Promise<ChargeResponse> {
        const sign = createChargingSign(this.partnerKey, params.code, params.serial);

        const body: Record<string, string> = {
            telco: params.telco,
            code: params.code,
            serial: params.serial,
            amount: String(params.amount),
            request_id: params.requestId,
            partner_id: this.partnerId,
            command: ChargingCommand.Charging,
            sign,
        };

        const res = await httpRequest<ChargeResponse>(`${this.baseUrl}/chargingws/v2`, {
            method: 'POST',
            body,
            timeout: this.timeout,
        });

        return res.data;
    }

    /** Kiểm tra trạng thái thẻ */
    async checkCard(params: CheckCardParams): Promise<ChargeResponse> {
        const sign = createChargingSign(this.partnerKey, params.code, params.serial);

        const body: Record<string, string> = {
            request_id: params.requestId,
            partner_id: this.partnerId,
            command: ChargingCommand.Check,
            sign,
        };

        const res = await httpRequest<ChargeResponse>(`${this.baseUrl}/chargingws/v2`, {
            method: 'POST',
            body,
            timeout: this.timeout,
        });

        return res.data;
    }

    /** Lấy bảng chiết khấu */
    async getFees(): Promise<FeeItem[]> {
        const url = `${this.baseUrl}/chargingws/v2/getfee?partner_id=${encodeURIComponent(this.partnerId)}`;
        const res = await httpRequest<FeeItem[]>(url, { method: 'GET', timeout: this.timeout });
        return res.data;
    }

    /** Kiểm tra trạng thái API */
    async checkApi(): Promise<CheckApiResponse> {
        const url = `${this.baseUrl}/chargingws/v2/check-api?partner_id=${encodeURIComponent(this.partnerId)}&partner_key=${encodeURIComponent(this.partnerKey)}`;
        const res = await httpRequest<CheckApiResponse>(url, { method: 'GET', timeout: this.timeout });
        return res.data;
    }
}
