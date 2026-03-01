/**
 * Withdraw API — Rút tiền
 * Yêu cầu IP whitelist
 */

import { createWithdrawOrderSign, httpRequest } from './utils';
import type { ApiConfig, WithdrawCreateParams, WithdrawCreateResponse, WithdrawOrderResponse, BankItem } from './types';

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
    async create(params: WithdrawCreateParams): Promise<WithdrawCreateResponse> {
        const body: Record<string, string> = {
            api_key: this.partnerKey,
            bank_code: params.bankCode,
            receive_account_number: params.accountNumber,
            receive_account_owner: params.accountOwner,
            amount: String(params.amount),
        };

        const res = await httpRequest<WithdrawCreateResponse>(`${this.baseUrl}/api/v1/partner/withdraws`, {
            method: 'POST',
            body,
            timeout: this.timeout,
        });

        return res.data;
    }

    /** Danh sách ngân hàng hỗ trợ */
    async getBanks(): Promise<BankItem[]> {
        const url = `${this.baseUrl}/api/v1/partner/withdraws/banks`;
        const res = await httpRequest<BankItem[]>(url, { method: 'GET', timeout: this.timeout });
        return res.data;
    }

    /** Chi tiết đơn rút tiền */
    async getOrder(orderId: string): Promise<WithdrawOrderResponse> {
        const sign = createWithdrawOrderSign(this.partnerId, orderId, this.partnerKey);
        const url = `${this.baseUrl}/api/v1/partner/withdraws/${encodeURIComponent(orderId)}?partner_id=${encodeURIComponent(this.partnerId)}&sign=${sign}`;

        const res = await httpRequest<WithdrawOrderResponse>(url, { method: 'GET', timeout: this.timeout });
        return res.data;
    }

    /** Lịch sử rút tiền */
    async getHistory(): Promise<unknown> {
        const url = `${this.baseUrl}/api/v1/partner/withdraws`;
        const res = await httpRequest(url, { method: 'GET', timeout: this.timeout });
        return res.data;
    }
}
