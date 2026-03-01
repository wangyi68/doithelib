/**
 * Test suite cho doithelib
 * Run: npm test
 */

import {
    DoiTheLib, Telco, ChargeStatus, ChargingCommand, BuyCardCommand,
    sandboxUrl, productionUrl, md5, verifyCallbackSign,
    ChargingApi, BuyCardApi, TransferApi, WithdrawApi,
} from '../src/index';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
    if (condition) {
        console.log(`  ✅ ${message}`);
        passed++;
    } else {
        console.log(`  ❌ ${message}`);
        failed++;
    }
}

function assertThrows(fn: () => void, message: string): void {
    try {
        fn();
        console.log(`  ❌ ${message} (did not throw)`);
        failed++;
    } catch {
        console.log(`  ✅ ${message}`);
        passed++;
    }
}

// ── Constructor ──────────────────────────────
console.log('\n📦 Constructor Tests');

assert(typeof DoiTheLib === 'function', 'DoiTheLib is a class');

// Global credentials
const client = new DoiTheLib({ partnerId: 'test_id', partnerKey: 'test_key' });
assert(client.charging instanceof ChargingApi, 'Has charging api');
assert(client.buyCard instanceof BuyCardApi, 'Has buyCard api');
assert(client.transfer instanceof TransferApi, 'Has transfer api');
assert(client.withdraw instanceof WithdrawApi, 'Has withdraw api');
assert(typeof client.verifyCallback === 'function', 'Has verifyCallback');

// Per-module credentials
const clientMulti = new DoiTheLib({
    charging: { partnerId: '-1396262354', partnerKey: 'key_charging' },
    buyCard: { partnerId: '-1072787347', partnerKey: 'key_buycard' },
    transfer: { partnerId: '459694254', partnerKey: 'key_transfer' },
    withdraw: { partnerId: '-19503335', partnerKey: 'key_withdraw' },
});
assert(clientMulti.charging instanceof ChargingApi, 'Multi-cred: has charging');
assert(clientMulti.buyCard instanceof BuyCardApi, 'Multi-cred: has buyCard');

// Should throw when no credentials provided at all
assertThrows(
    () => new DoiTheLib({}),
    'Throws when no credentials at all'
);

// Partial: only some modules — should throw for missing ones
assertThrows(
    () => new DoiTheLib({ charging: { partnerId: 'x', partnerKey: 'y' } }),
    'Throws when buyCard module has no credentials'
);

// ── Enums ────────────────────────────────────
console.log('\n📋 Enum Tests');

assert(Telco.Viettel === 'VIETTEL', 'Telco.Viettel');
assert(Telco.Mobifone === 'MOBIFONE', 'Telco.Mobifone');
assert(Telco.Vinaphone === 'VINAPHONE', 'Telco.Vinaphone');
assert(Telco.Zing === 'ZING', 'Telco.Zing');
assert(Telco.Garena === 'GARENA', 'Telco.Garena');
assert(Telco.Gate === 'GATE', 'Telco.Gate');
assert(Telco.Vcoin === 'VCOIN', 'Telco.Vcoin');

assert(ChargeStatus.Success === 1, 'ChargeStatus.Success');
assert(ChargeStatus.WrongValue === 2, 'ChargeStatus.WrongValue');
assert(ChargeStatus.CardError === 3, 'ChargeStatus.CardError');
assert(ChargeStatus.Maintenance === 4, 'ChargeStatus.Maintenance');
assert(ChargeStatus.Pending === 99, 'ChargeStatus.Pending');
assert(ChargeStatus.Duplicate === 100, 'ChargeStatus.Duplicate');

assert(ChargingCommand.Charging === 'charging', 'ChargingCommand.Charging');
assert(ChargingCommand.Check === 'check', 'ChargingCommand.Check');
assert(BuyCardCommand.BuyCard === 'buycard', 'BuyCardCommand.BuyCard');
assert(BuyCardCommand.GetBalance === 'getbalance', 'BuyCardCommand.GetBalance');

// ── URLs ─────────────────────────────────────
console.log('\n🌐 URL Tests');

assert(sandboxUrl === 'https://sandbox.card2k.com', 'sandboxUrl correct');
assert(productionUrl === 'https://card2k.com', 'productionUrl correct');

const defaultClient = new DoiTheLib({ partnerId: 't', partnerKey: 't' });
assert((defaultClient.charging as any).baseUrl === 'https://sandbox.card2k.com', 'Default = sandbox');

const prodClient = new DoiTheLib({ partnerId: 't', partnerKey: 't', baseUrl: productionUrl });
assert((prodClient.charging as any).baseUrl === 'https://card2k.com', 'Production baseUrl');

const trailingClient = new DoiTheLib({ partnerId: 't', partnerKey: 't', baseUrl: 'https://card2k.com/' });
assert((trailingClient.charging as any).baseUrl === 'https://card2k.com', 'Trailing slash removed');

// ── MD5 / Signatures ─────────────────────────
console.log('\n🔐 MD5 / Signature Tests');

assert(md5('hello') === '5d41402abc4b2a76b9719d911017c592', 'md5("hello")');
assert(md5('') === 'd41d8cd98f00b204e9800998ecf8427e', 'md5("")');

const testKey = 'secret_key';
const testCode = '123456';
const testSerial = '789012';
const expectedSign = md5(testKey + testCode + testSerial);

assert(verifyCallbackSign(testKey, testCode, testSerial, expectedSign), 'Correct sign = true');
assert(!verifyCallbackSign(testKey, testCode, testSerial, 'wrong'), 'Wrong sign = false');

// ── Client verifyCallback ────────────────────
console.log('\n🔍 Verify Callback Tests');

// Global creds
const client2 = new DoiTheLib({ partnerId: 'p', partnerKey: 'my_secret' });
const code = 'card_code_123';
const serial = 'serial_456';
const validSign = md5('my_secret' + code + serial);

assert(client2.verifyCallback({ code, serial, callbackSign: validSign }), 'Global cred: valid sign');
assert(!client2.verifyCallback({ code, serial, callbackSign: 'bad' }), 'Global cred: invalid sign');

// Per-module creds
const client3 = new DoiTheLib({
    charging: { partnerId: 'c1', partnerKey: 'charging_key' },
    buyCard: { partnerId: 'c2', partnerKey: 'buycard_key' },
    transfer: { partnerId: 'c3', partnerKey: 'transfer_key' },
    withdraw: { partnerId: 'c4', partnerKey: 'withdraw_key' },
});
const signCharging = md5('charging_key' + code + serial);
const signBuycard = md5('buycard_key' + code + serial);

assert(client3.verifyCallback({ code, serial, callbackSign: signCharging }, 'charging'), 'Per-module: charging sign');
assert(client3.verifyCallback({ code, serial, callbackSign: signBuycard }, 'buyCard'), 'Per-module: buyCard sign');
assert(!client3.verifyCallback({ code, serial, callbackSign: signCharging }, 'buyCard'), 'Per-module: cross check fails');

// ── Summary ──────────────────────────────────
console.log('\n' + '='.repeat(40));
console.log(`\n📊 Tests: ${passed + failed} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
if (failed > 0) {
    console.log('\n⚠️  Some tests failed!\n');
    process.exit(1);
} else {
    console.log('\n🎉 All tests passed!\n');
}
