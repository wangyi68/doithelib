/**
 * doithelib — Node.js SDK cho Cardswap Partner API
 * Đổi thẻ cào & Mua thẻ cào (card2k.com)
 */

import { ChargingApi } from './charging';
import { BuyCardApi } from './buycard';
import { TransferApi } from './transfer';
import { WithdrawApi } from './withdraw';
import { sandboxUrl, productionUrl, Telco, ChargeStatus, ChargingCommand, BuyCardCommand } from './constants';
import { verifyCallbackSign, md5 } from './utils';
import type { DoiTheConfig, ApiConfig, VerifyCallbackParams, Credentials } from './types';

export class DoiTheLib {
    /** Đổi thẻ cào */
    public readonly charging: ChargingApi;
    /** Mua thẻ cào */
    public readonly buyCard: BuyCardApi;
    /** Chuyển tiền */
    public readonly transfer: TransferApi;
    /** Rút tiền */
    public readonly withdraw: WithdrawApi;

    private configs: Record<string, Credentials>;

    /**
     * Khởi tạo client DoiTheLib
     *
     * Mỗi module (charging, buyCard, transfer, withdraw) có thể dùng
     * partnerId / partnerKey riêng biệt.
     *
     * @example
     * // Dùng chung 1 cặp credentials
     * const client = new DoiTheLib({
     *   partnerId: 'your_id',
     *   partnerKey: 'your_key',
     * });
     *
     * @example
     * // Mỗi module dùng credentials riêng
     * const client = new DoiTheLib({
     *   baseUrl: 'https://card2k.com',
     *   charging:  { partnerId: '-1396262354', partnerKey: 'key1' },
     *   buyCard:   { partnerId: '-1072787347', partnerKey: 'key2' },
     *   transfer:  { partnerId: '459694254',   partnerKey: 'key3' },
     *   withdraw:  { partnerId: '-19503335',   partnerKey: 'key4' },
     * });
     */
    constructor(config: DoiTheConfig) {
        const baseUrl = config.baseUrl || sandboxUrl;
        const timeout = config.timeout ?? 30000;

        // Resolve credentials cho từng module: module-specific > global fallback
        const globalCreds: Credentials | undefined =
            config.partnerId && config.partnerKey
                ? { partnerId: config.partnerId, partnerKey: config.partnerKey }
                : undefined;

        const resolve = (name: string, moduleCreds?: Credentials): ApiConfig => {
            const creds = moduleCreds || globalCreds;
            if (!creds) {
                throw new Error(`Missing partnerId/partnerKey for "${name}". Cung cấp qua config.${name} hoặc config global.`);
            }
            return { baseUrl, timeout, ...creds };
        };

        this.charging = new ChargingApi(resolve('charging', config.charging));
        this.buyCard = new BuyCardApi(resolve('buyCard', config.buyCard));
        this.transfer = new TransferApi(resolve('transfer', config.transfer));
        this.withdraw = new WithdrawApi(resolve('withdraw', config.withdraw));

        // Lưu configs để verify callback
        this.configs = {
            charging: config.charging || globalCreds || { partnerId: '', partnerKey: '' },
            buyCard: config.buyCard || globalCreds || { partnerId: '', partnerKey: '' },
        };
    }

    /**
     * Xác thực callback sign từ hệ thống (dùng partnerKey của module charging)
     *
     * @param module - Module nào gửi callback (mặc định 'charging')
     */
    verifyCallback(params: VerifyCallbackParams, module: 'charging' | 'buyCard' = 'charging'): boolean {
        const key = this.configs[module]?.partnerKey;
        if (!key) throw new Error(`Không tìm thấy partnerKey cho module "${module}"`);
        return verifyCallbackSign(key, params.code, params.serial, params.callbackSign);
    }
}

// Re-exports
export { ChargingApi } from './charging';
export { BuyCardApi } from './buycard';
export { TransferApi } from './transfer';
export { WithdrawApi } from './withdraw';
export { Telco, ChargeStatus, ChargingCommand, BuyCardCommand, sandboxUrl, productionUrl } from './constants';
export { verifyCallbackSign, md5 } from './utils';
export type {
    DoiTheConfig,
    ApiConfig,
    Credentials,
    SendCardParams,
    CheckCardParams,
    ChargeResponse,
    BuyParams,
    BuyResponse,
    CardItem,
    WithdrawCreateParams,
    VerifyCallbackParams,
    CallbackData,
} from './types';

export default DoiTheLib;
