/**
 * doithelib — Ví dụ sử dụng
 * Run: npx ts-node examples/basic.ts
 */

import { DoiTheLib, Telco, ChargeStatus, productionUrl } from '../src/index';

// ── 1. Cách 1: Dùng chung credentials ───────
const client = new DoiTheLib({
    partnerId: 'your_partner_id',
    partnerKey: 'your_partner_key',
    // baseUrl: productionUrl,  // mặc định là sandbox
});

// ── 2. Cách 2: Mỗi module riêng credentials ─
const clientMulti = new DoiTheLib({
    baseUrl: productionUrl,  // https://card2k.com
    charging: { partnerId: '-1396262354', partnerKey: 'key_charging' },
    buyCard: { partnerId: '-1072787347', partnerKey: 'key_buycard' },
    transfer: { partnerId: '459694254', partnerKey: 'key_transfer' },
    withdraw: { partnerId: '-19503335', partnerKey: 'key_withdraw' },
});

// ── 3. Đổi thẻ cào ──────────────────────────

async function chargingExample() {
    try {
        console.log('--- Kiểm tra API ---');
        const apiStatus = await client.charging.checkApi();
        console.log('API Status:', apiStatus);

        console.log('\n--- Bảng phí ---');
        const fees = await client.charging.getFees();
        console.log('Fees:', JSON.stringify(fees, null, 2));

        console.log('\n--- Gửi thẻ cào ---');
        const result = await client.charging.sendCard({
            telco: Telco.Viettel,
            code: '123456789012345',
            serial: '10000123456789',
            amount: 50000,
            requestId: `txn_${Date.now()}`,
        });
        console.log('Send Card:', result);

        if (result.status === ChargeStatus.Success || result.status === ChargeStatus.Pending) {
            console.log('\n--- Kiểm tra trạng thái ---');
            const check = await client.charging.checkCard({
                telco: Telco.Viettel,
                code: '123456789012345',
                serial: '10000123456789',
                amount: 50000,
                requestId: `txn_${Date.now()}`,
            });
            console.log('Check:', check);
        }
    } catch (err) {
        console.error('Charging Error:', (err as Error).message);
    }
}

// ── 4. Mua thẻ cào ──────────────────────────

async function buyCardExample() {
    try {
        console.log('\n--- Sản phẩm ---');
        const products = await client.buyCard.getProducts();
        console.log('Products:', JSON.stringify(products, null, 2));

        console.log('\n--- Số dư ---');
        const balance = await client.buyCard.getBalance();
        console.log('Balance:', balance);

        console.log('\n--- Mua thẻ ---');
        const result = await client.buyCard.buy({
            serviceCode: 'Viettel',
            value: 10000,
            qty: 1,
            requestId: `buy_${Date.now()}`,
        });
        console.log('Buy:', result);
    } catch (err) {
        console.error('BuyCard Error:', (err as Error).message);
    }
}

// ── 5. Rút tiền ─────────────────────────────

async function withdrawExample() {
    try {
        console.log('\n--- Ngân hàng ---');
        const banks = await client.withdraw.getBanks();
        console.log('Banks:', JSON.stringify(banks, null, 2));

        console.log('\n--- Rút tiền ---');
        const result = await client.withdraw.create({
            bankCode: 'VCB',
            accountNumber: '1234567890',
            accountOwner: 'NGUYEN VAN A',
            amount: 100000,
        });
        console.log('Withdraw:', result);
    } catch (err) {
        console.error('Withdraw Error:', (err as Error).message);
    }
}

// ── 6. Xác thực callback ────────────────────

function callbackExample() {
    // Verify bằng module charging (mặc định)
    const isValid = client.verifyCallback({
        code: '123456789012345',
        serial: '10000123456789',
        callbackSign: 'abc123...',
    });

    // Hoặc chỉ rõ module
    // const isValid = clientMulti.verifyCallback({ ... }, 'buyCard');

    console.log('\n--- Verify Callback ---');
    console.log('Valid:', isValid);
}

// Run
(async () => {
    console.log('=== DoiTheLib Examples ===\n');
    await chargingExample();
    await buyCardExample();
    await withdrawExample();
    callbackExample();
})();
