/**
 * Type definitions for doithelib
 */

/** Thông tin xác thực cho một module */
export interface Credentials {
    partnerId: string;
    partnerKey: string;
}

/** Cấu hình khởi tạo SDK — hỗ trợ cấu hình riêng cho từng module */
export interface DoiTheConfig {
    /** Base URL — mặc định là sandbox */
    baseUrl?: string;
    /** Timeout (ms) — mặc định 30000 */
    timeout?: number;
    /** Cấu hình chung (fallback nếu module không chỉ định riêng) */
    partnerId?: string;
    partnerKey?: string;
    /** Cấu hình riêng cho từng module */
    charging?: Credentials;
    buyCard?: Credentials;
    transfer?: Credentials;
    withdraw?: Credentials;
}

/** Cấu hình nội bộ cho mỗi API module */
export interface ApiConfig {
    baseUrl: string;
    partnerId: string;
    partnerKey: string;
    timeout: number;
}

// ─── Charging ────────────────────────────────

export interface SendCardParams {
    /** Loại thẻ (Telco enum hoặc string) */
    telco: string;
    /** Mã PIN thẻ */
    code: string;
    /** Số serial thẻ */
    serial: string;
    /** Mệnh giá khai báo */
    amount: number;
    /** ID giao dịch duy nhất của bạn */
    requestId: string;
}

export interface CheckCardParams {
    telco: string;
    code: string;
    serial: string;
    amount: number;
    requestId: string;
}

export interface ChargeResponse {
    status: number;
    message: string;
    trans_id?: string;
    [key: string]: unknown;
}

// ─── Buy Card ────────────────────────────────

export interface BuyParams {
    /** Tên nhà mạng (ví dụ: 'Viettel') */
    serviceCode: string;
    /** Mệnh giá */
    value: number;
    /** Số lượng */
    qty: number;
    /** ID giao dịch duy nhất */
    requestId: string;
}

export interface CardItem {
    name: string;
    serial: string;
    code: string;
}

export interface BuyResponse {
    status: number;
    message?: string;
    data?: CardItem[];
    [key: string]: unknown;
}

// ─── Withdraw ────────────────────────────────

export interface WithdrawCreateParams {
    /** Mã ngân hàng (từ getBanks()) */
    bankCode: string;
    /** Số tài khoản người nhận */
    accountNumber: string;
    /** Tên chủ tài khoản */
    accountOwner: string;
    /** Số tiền (VND) */
    amount: number;
}

// ─── Callback ────────────────────────────────

export interface VerifyCallbackParams {
    code: string;
    serial: string;
    callbackSign: string;
}

export interface CallbackData {
    status: string;
    message: string;
    request_id: string;
    declared_value: string;
    value: string;
    amount: string;
    code: string;
    serial: string;
    telco: string;
    trans_id: string;
    callback_sign: string;
}

// ─── HTTP ────────────────────────────────────

export interface HttpRequestOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: Record<string, string> | string;
    timeout?: number;
}

export interface HttpResponse<T = unknown> {
    status: number;
    headers: Record<string, string>;
    data: T;
}
