/**
 * Cardswap Partner API Constants
 */

/** Loại thẻ cào hỗ trợ */
export enum Telco {
    Viettel = 'VIETTEL',
    Mobifone = 'MOBIFONE',
    Vinaphone = 'VINAPHONE',
    Vietnamobile = 'VIETNAMOBILE',
    Zing = 'ZING',
    Garena = 'GARENA',
    Gate = 'GATE',
    Vcoin = 'VCOIN',
}

/** Trạng thái đổi thẻ */
export enum ChargeStatus {
    Success = 1,
    WrongValue = 2,
    CardError = 3,
    Maintenance = 4,
    Pending = 99,
    Duplicate = 100,
}

/** Lệnh charging */
export enum ChargingCommand {
    Charging = 'charging',
    Check = 'check',
}

/** Lệnh mua thẻ */
export enum BuyCardCommand {
    BuyCard = 'buycard',
    GetBalance = 'getbalance',
    CheckAvailable = 'checkavailable',
}

/** URL môi trường */
export const sandboxUrl = 'https://sandbox.card2k.com';
export const productionUrl = 'https://card2k.com';
