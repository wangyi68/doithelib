/**
 * Type definitions for doithelib
 * Dựa theo Example Response từ API docs Cardswap Partner
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
    /** Mã PIN thẻ (dùng để tạo sign) */
    code: string;
    /** Số serial thẻ (dùng để tạo sign) */
    serial: string;
    /** ID giao dịch duy nhất của bạn */
    requestId: string;
}

/**
 * Response khi gửi thẻ hoặc check trạng thái
 * Example:
 * {
 *   "trans_id": 103,
 *   "request_id": "32323333",
 *   "status": 99,
 *   "message": "Gửi thẻ thành công, chờ xử lý",
 *   "telco": "MOBIFONE",
 *   "code": "664196324427",
 *   "serial": "089801001443088",
 *   "declared_value": "50000",
 *   "value": "50000",
 *   "amount": null
 * }
 */
export interface ChargeResponse {
    trans_id: number;
    request_id: string;
    status: number;
    message: string;
    telco: string;
    code: string;
    serial: string;
    declared_value: string | null;
    value: string;
    amount: string | null;
    [key: string]: unknown;
}

/**
 * Item trong bảng chiết khấu (getfee)
 * Example: { "telco": "VIETTEL", "value": "10000", "fees": 9.8, "penalty": 50 }
 */
export interface FeeItem {
    telco: string;
    value: string;
    fees: number;
    penalty: number;
}

/**
 * Response check API
 * Example:
 * {
 *   "status": "success",
 *   "message": "API khả dụng",
 *   "data": { "partner_id": "...", "status": "inactive", ... }
 * }
 */
export interface CheckApiResponse {
    status: string;
    message: string;
    data: {
        partner_id: string;
        partner_key: string;
        partner_callback: string | null;
        status: string;
        type: string;
        last_called_at: string | null;
    };
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

export interface CheckStockParams {
    /** Tên nhà mạng (ví dụ: 'Viettel') */
    serviceCode: string;
    /** Mệnh giá */
    value: number;
    /** Số lượng */
    qty: number;
}

/** Thông tin 1 thẻ mua được */
export interface CardItem {
    name: string;
    serial: string;
    code: string;
    expired: string | null;
}

/**
 * Response mua thẻ cào
 * Example:
 * {
 *   "status": 1,
 *   "message": "Mua thẻ thành công",
 *   "data": {
 *     "cards": [{ "name": "...", "serial": "...", "code": "...", "expired": null }],
 *     "time": "2025-10-29 23:54:57",
 *     "request_id": "1234",
 *     "order_code": 783
 *   }
 * }
 */
export interface BuyResponse {
    status: number;
    message: string;
    data: {
        cards: CardItem[];
        time: string;
        request_id: string;
        order_code: number;
    };
    [key: string]: unknown;
}

/**
 * Response lấy số dư
 * Example: { "balance": "62464", "currency_code": "VND" }
 * hoặc: { "balance": 18121283, "status": 1 }
 */
export interface BalanceResponse {
    balance: string | number;
    currency_code?: string;
    status?: number;
    [key: string]: unknown;
}

/**
 * Response kiểm tra tồn kho
 * Example: { "stock_available": true, "message": "Còn hàng" }
 */
export interface CheckStockResponse {
    stock_available: boolean;
    message: string;
}

/**
 * Item sản phẩm thẻ (products)
 */
export interface ProductItem {
    service_code: string;
    service_name: string;
    cardvalue: number[];
    [key: string]: unknown;
}

// ─── Transfer ────────────────────────────────

/**
 * Item lịch sử chuyển tiền
 * Example:
 * {
 *   "transaction_id": 76,
 *   "from_user": "...",
 *   "to_user": "...",
 *   "fee": 380125,
 *   "amount": 201294,
 *   "date_time": "2025-06-14T07:47:05.000000Z",
 *   "status": "waiting",
 *   "description": "...",
 *   "type": "OUT"
 * }
 */
export interface TransferHistoryItem {
    transaction_id: number;
    from_user: string;
    to_user: string;
    fee: number;
    amount: number;
    date_time: string;
    status: string;
    description: string;
    type: string;
    [key: string]: unknown;
}

/**
 * Response lịch sử chuyển tiền
 * Example: { "status": "success", "message": "...", "data": [...] }
 */
export interface TransferHistoryResponse {
    status: string;
    message: string;
    data: TransferHistoryItem[];
}

// ─── Withdraw ────────────────────────────────

export interface WithdrawCreateParams {
    /** Mã ngân hàng / BIN (từ getBanks(), ví dụ: '970415') */
    bankCode: string;
    /** Số tài khoản người nhận */
    accountNumber: string;
    /** Tên chủ tài khoản */
    accountOwner: string;
    /** Số tiền (VND) */
    amount: number;
}

/**
 * Response tạo lệnh rút tiền
 * Example:
 * {
 *   "status": "success",
 *   "message": "Tạo đơn rút tiền thành công, vui lòng chờ xử lý",
 *   "data": {
 *     "bank_bin": "970415",
 *     "bank_code": "ICB",
 *     "account_owner": "NGUYEN VAN A",
 *     "account_number": "0123456789",
 *     "amount": 5000,
 *     "id": 1
 *   }
 * }
 */
export interface WithdrawCreateResponse {
    status: string;
    message: string;
    data: {
        id: number;
        bank_bin: string;
        bank_code: string;
        account_owner: string;
        account_number: string;
        amount: number;
        [key: string]: unknown;
    };
}

/**
 * Response kiểm tra trạng thái đơn rút tiền
 * Example:
 * {
 *   "status": "success",
 *   "message": "Lấy đơn rút tiền thành công",
 *   "data": { "id": 1, "status": "waiting", "request_id": "...", ... }
 * }
 */
export interface WithdrawOrderResponse {
    status: string;
    message: string;
    data: {
        id: number;
        status: string;
        request_id: string;
        [key: string]: unknown;
    };
}

/**
 * Item ngân hàng
 */
export interface BankItem {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    [key: string]: unknown;
}

// ─── Callback ────────────────────────────────

export interface VerifyCallbackParams {
    code: string;
    serial: string;
    callbackSign: string;
}

/**
 * Dữ liệu callback từ hệ thống
 * Example: ?status=1&message=Thành công&request_id=989876&declared_value=50000
 *          &card_value=50000&value=50000&amount=25000&code=314688440422676
 *          &serial=10003395125761&telco=VIETTEL&trans_id=343424
 *          &callback_sign=17b118fe86852c52ea126c9537617f6d
 */
export interface CallbackData {
    status: string;
    message: string;
    request_id: string;
    declared_value: string;
    card_value: string;
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
