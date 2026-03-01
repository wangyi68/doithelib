/**
 * Withdraw API — Rút tiền
 * Yêu cầu IP whitelist
 */

import { createWithdrawOrderSign, httpRequest } from './utils';
import type { ApiConfig, WithdrawCreateParams } from './types';

export class WithdrawApi {
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

    /** Lập đơn rút tiền */
    async create(params: WithdrawCreateParams): Promise<unknown> {
        const body: Record<string, string> = {
            api_key: this.partnerKey,
            bank_code: params.bankCode,
            receive_account_number: params.accountNumber,
            receive_account_owner: params.accountOwner,
            amount: String(params.amount),
        };

        const res = await httpRequest(`${this.baseUrl}/api/v1/partner/withdraws`, {
            method: 'POST',
            body,
            timeout: this.timeout,
        });

        return res.data;
    }

    /** Danh sách ngân hàng hỗ trợ */
    async getBanks(): Promise<unknown> {
        const url = `${this.baseUrl}/api/v1/partner/withdraws/banks`;
        const res = await httpRequest(url, { method: 'GET', timeout: this.timeout });
        return res.data;
    }

    /** Chi tiết đơn rút tiền */
    async getOrder(orderId: string): Promise<unknown> {
        const sign = createWithdrawOrderSign(this.partnerId, orderId, this.partnerKey);
        const url = `${this.baseUrl}/api/v1/partner/withdraws/order?partner_id=${encodeURIComponent(this.partnerId)}&order_id=${encodeURIComponent(orderId)}&sign=${sign}`;

        const res = await httpRequest(url, { method: 'GET', timeout: this.timeout });
        return res.data;
    }

    /** Lịch sử rút tiền */
    async getHistory(): Promise<unknown> {
        const url = `${this.baseUrl}/api/v1/partner/withdraws`;
        const res = await httpRequest(url, { method: 'GET', timeout: this.timeout });
        return res.data;
    }
}
