/**
 * Transfer API — Chuyển tiền
 * Yêu cầu IP whitelist
 */

import { httpRequest } from './utils';
import type { ApiConfig } from './types';

export class TransferApi {
    private baseUrl: string;
    private partnerKey: string;
    private timeout: number;

    constructor(config: ApiConfig) {
        this.baseUrl = config.baseUrl.replace(/\/$/, '');
        this.partnerKey = config.partnerKey;
        this.timeout = config.timeout;
    }

    /** Lịch sử giao dịch chuyển tiền */
    async getHistory(params: { limit?: number } = {}): Promise<unknown> {
        const limit = params.limit ?? 50;
        const url = `${this.baseUrl}/api/v1/partner/transfers?partner_key=${encodeURIComponent(this.partnerKey)}&limit=${limit}`;

        const res = await httpRequest(url, { method: 'GET', timeout: this.timeout });
        return res.data;
    }
}
