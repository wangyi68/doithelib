# doithelib

> Node.js / TypeScript SDK cho **Cardswap Partner API** — Đổi thẻ cào & Mua thẻ cào

**Zero runtime dependencies** — chỉ dùng module có sẵn của Node.js.

## 📦 Cài đặt

```bash
npm install doithelib
```

## 🚀 Khởi tạo

### Cách 1: Dùng chung credentials

```typescript
import { DoiTheLib } from 'doithelib';

const client = new DoiTheLib({
  partnerId: 'your_partner_id',
  partnerKey: 'your_partner_key',
  // baseUrl mặc định: https://sandbox.card2k.com (sandbox)
});
```

### Cách 2: Mỗi module dùng credentials riêng

Hệ thống cấp **partnerId / partnerKey riêng** cho từng chức năng (Đổi thẻ, Mua thẻ, Chuyển tiền, Rút tiền). Khai báo như sau:

```typescript
import { DoiTheLib, productionUrl } from 'doithelib';

const client = new DoiTheLib({
  baseUrl: productionUrl,  // https://card2k.com
  charging:  { partnerId: '-1396262354', partnerKey: 'key_1' },
  buyCard:   { partnerId: '-1072787347', partnerKey: 'key_2' },
  transfer:  { partnerId: '459694254',   partnerKey: 'key_3' },
  withdraw:  { partnerId: '-19503335',   partnerKey: 'key_4' },
});
```

## 🌐 Môi trường

| Môi trường | URL | Constant |
|------------|-----|----------|
| **Sandbox** | `https://sandbox.card2k.com` | `sandboxUrl` (mặc định) |
| **Production** | `https://card2k.com` | `productionUrl` |

## 📖 API

### 1. Đổi thẻ cào (`client.charging`)

```typescript
import { Telco, ChargeStatus } from 'doithelib';

// Gửi thẻ
const result = await client.charging.sendCard({
  telco: Telco.Viettel,
  code: '123456789012',
  serial: '10000123456789',
  amount: 50000,
  requestId: 'txn_001',
});

// Kiểm tra trạng thái
const status = await client.charging.checkCard({ /* same params */ });

// Bảng chiết khấu
const fees = await client.charging.getFees();

// Kiểm tra API
const apiOk = await client.charging.checkApi();
```

**Trạng thái response:**

| Status | Ý nghĩa |
|--------|---------|
| `ChargeStatus.Success` (1) | Thẻ đúng / đang xử lý |
| `ChargeStatus.WrongValue` (2) | Đúng thẻ, sai mệnh giá |
| `ChargeStatus.CardError` (3) | Thẻ lỗi |
| `ChargeStatus.Maintenance` (4) | Hệ thống bảo trì |
| `ChargeStatus.Pending` (99) | Đang chờ xử lý |
| `ChargeStatus.Duplicate` (100) | Trùng request_id |

### 2. Mua thẻ cào (`client.buyCard`)

```typescript
// Mua thẻ
const cards = await client.buyCard.buy({
  serviceCode: 'Viettel',
  value: 50000,
  qty: 2,
  requestId: 'buy_001',
});

// Số dư
const balance = await client.buyCard.getBalance();

// Danh sách sản phẩm
const products = await client.buyCard.getProducts();
```

### 3. Chuyển tiền (`client.transfer`)

> ⚠️ Yêu cầu IP whitelist

```typescript
const history = await client.transfer.getHistory({ limit: 20 });
```

### 4. Rút tiền (`client.withdraw`)

> ⚠️ Yêu cầu IP whitelist

```typescript
// Rút tiền
const result = await client.withdraw.create({
  bankCode: 'VCB',
  accountNumber: '1234567890',
  accountOwner: 'NGUYEN VAN A',
  amount: 100000,
});

// Ngân hàng
const banks = await client.withdraw.getBanks();

// Chi tiết đơn
const order = await client.withdraw.getOrder('order_123');

// Lịch sử
const history = await client.withdraw.getHistory();
```

### 5. Xác thực Callback

```typescript
// Express.js example
app.get('/callback', (req, res) => {
  // Mặc định dùng partnerKey của module charging
  const isValid = client.verifyCallback({
    code: req.query.code,
    serial: req.query.serial,
    callbackSign: req.query.callback_sign,
  });

  // Hoặc chỉ rõ module
  // const isValid = client.verifyCallback({ ... }, 'buyCard');

  if (isValid) {
    // Xử lý giao dịch...
  }
  res.send('OK');
});
```

## 📋 Enums

```typescript
import { Telco, ChargeStatus } from 'doithelib';

// Loại thẻ
Telco.Viettel       // 'VIETTEL'
Telco.Mobifone      // 'MOBIFONE'
Telco.Vinaphone     // 'VINAPHONE'
Telco.Vietnamobile  // 'VIETNAMOBILE'
Telco.Zing          // 'ZING'
Telco.Garena        // 'GARENA'
Telco.Gate          // 'GATE'
Telco.Vcoin         // 'VCOIN'
```

## 🔐 Signatures

SDK tự động tạo tất cả chữ ký. Bạn **không cần** tự xử lý.

| API | Công thức |
|-----|-----------|
| Đổi thẻ | `md5(partnerKey + code + serial)` |
| Mua thẻ | `md5(partnerKey + partnerId + command + requestId)` |
| Số dư | `md5(partnerKey + partnerId + command)` |
| Đơn rút tiền | `md5(partnerId + orderId + partnerKey)` |
| Callback | `md5(partnerKey + code + serial)` |

## 📄 License

MIT
