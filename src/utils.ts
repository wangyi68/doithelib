/**
 * Utility functions for Cardswap Partner SDK
 */

import { createHash } from 'crypto';
import { request as httpsRequest } from 'https';
import { request as httpRequest_, type RequestOptions, type IncomingMessage } from 'http';
import type { HttpRequestOptions, HttpResponse } from './types';

/** Tạo MD5 hash */
export function md5(data: string): string {
    return createHash('md5').update(data).digest('hex');
}

/** Sign đổi thẻ: md5(partnerKey + code + serial) */
export function createChargingSign(partnerKey: string, code: string, serial: string): string {
    return md5(partnerKey + code + serial);
}

/** Sign mua thẻ: md5(partnerKey + partnerId + command + requestId) */
export function createBuyCardSign(
    partnerKey: string,
    partnerId: string,
    command: string,
    requestId: string,
): string {
    return md5(partnerKey + partnerId + command + requestId);
}

/** Sign lấy số dư: md5(partnerKey + partnerId + command) */
export function createBalanceSign(partnerKey: string, partnerId: string, command: string): string {
    return md5(partnerKey + partnerId + command);
}

/** Sign đơn rút tiền: md5(partnerId + orderId + partnerKey) */
export function createWithdrawOrderSign(partnerId: string, orderId: string, partnerKey: string): string {
    return md5(partnerId + orderId + partnerKey);
}

/** Xác thực callback sign: md5(partnerKey + code + serial) */
export function verifyCallbackSign(
    partnerKey: string,
    code: string,
    serial: string,
    callbackSign: string,
): boolean {
    return md5(partnerKey + code + serial) === callbackSign;
}

/** HTTP request với native Node.js modules */
export function httpRequest<T = unknown>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const isHttps = parsedUrl.protocol === 'https:';
        const requestFn = isHttps ? httpsRequest : httpRequest_;

        const method = (options.method || 'GET').toUpperCase();
        let bodyData: string | null = null;

        const reqHeaders: Record<string, string> = {
            Accept: 'application/json',
            ...(options.headers || {}),
        };

        if (options.body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            if (typeof options.body === 'object') {
                bodyData = new URLSearchParams(options.body as Record<string, string>).toString();
                reqHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
                reqHeaders['Content-Length'] = String(Buffer.byteLength(bodyData));
            } else {
                bodyData = options.body;
                reqHeaders['Content-Length'] = String(Buffer.byteLength(bodyData));
            }
        }

        const reqOptions: RequestOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method,
            headers: reqHeaders,
            timeout: options.timeout || 30000,
        };

        const req = requestFn(reqOptions, (res: IncomingMessage) => {
            let data = '';
            res.on('data', (chunk: Buffer) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data) as T;
                    resolve({ status: res.statusCode!, headers: res.headers as Record<string, string>, data: json });
                } catch {
                    resolve({ status: res.statusCode!, headers: res.headers as Record<string, string>, data: data as unknown as T });
                }
            });
        });

        req.on('error', (err: Error) => reject(err));
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timed out'));
        });

        if (bodyData) req.write(bodyData);
        req.end();
    });
}
