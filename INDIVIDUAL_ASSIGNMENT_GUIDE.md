# งานเดี่ยว: Inventory REST API

## สิ่งที่ส่ง

งานเดี่ยวนี้เก็บเฉพาะส่วนของเรา: ฐานข้อมูลสินค้า MySQL และ REST API ที่ส่งข้อมูลสินค้าเป็น JSON

ไม่ต้องทำส่วนของงานกลุ่มต่อไปนี้:

- Central / Group Aggregation API
- การเรียก API ของเพื่อนคนอื่น
- Data preparation ที่รวมข้อมูลทุกคน

โปรเจกต์นี้เพิ่ม K-Means สำหรับสินค้าในสต็อกของเราเองแล้ว เพื่อแสดงผลให้ชัดเจนบน Expo app แต่ไม่ต้องทำ Elbow Method หากอาจารย์ไม่ได้กำหนดเพิ่ม

## โครงสร้างที่ใช้ส่ง

```text
MyProfileAppBantita/
├─ backend/
│  ├─ server.js                 # Express API ของเรา
│  ├─ analytics/clustering.py   # K-Means จาก price และ stock
│  ├─ analytics/requirements.txt
│  ├─ package.json              # dependencies และคำสั่ง start
│  ├─ .env                      # ค่าฐานข้อมูลจริง (ห้ามส่งขึ้น Git)
│  └─ .env.example              # ตัวอย่างตัวแปรที่ต้องตั้ง
└─ src/                         # Expo app สำหรับแสดงและใช้งานสินค้า
```

## Endpoint สำหรับตรวจงาน

`GET /api/assignment/products`

ตัวอย่างเมื่อรันบนเครื่องตัวเอง:

```text
http://localhost:3026/api/assignment/products
```

ผลลัพธ์ต้องเป็น JSON array เช่น:

```json
[
  {
    "id": 1,
    "name": "VANTA Denim Dress",
    "category": "Dresses",
    "price": 1290,
    "stock": 8,
    "location": "Warehouse A",
    "status": "Available",
    "brand": "Vanta",
    "sizes": "S,M,L",
    "productCode": "VANTA-001",
    "lastUpdate": "2026-09-10T00:00:00.000Z"
  }
]
```

เหตุผลที่ใช้ endpoint นี้คือเป็นข้อมูลอ่านอย่างเดียวและเปิดให้ผู้ตรวจเรียกได้ทันที ส่วน `/api/products` เดิมยังต้อง login เพื่อให้แอปปลอดภัย และการเพิ่ม/แก้ไข/ลบสินค้ายังจำกัดเฉพาะ admin เหมือนเดิม

## ทำตามทีละขั้น

1. เปิด MySQL แล้วตรวจว่ามีฐานข้อมูลและตาราง `Inventory` ของเรา
2. คัดลอก `backend/.env.example` เป็น `backend/.env` แล้วใส่ `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` และ `JWT_SECRET` จริง
3. เปิด terminal ในโฟลเดอร์ `backend` แล้วรัน:

   ```powershell
   npm install
   npm start
   ```

4. เมื่อเห็น `VANTA API listening on port 3026` ให้เปิด URL ของ endpoint ด้านบนใน browser หรือ Postman
5. ต้องเห็น status `200 OK` และข้อมูลเป็น JSON ไม่ใช่ HTML หรือข้อความ error
6. ถ้าจะโชว์แอป ให้เปิดอีก terminal ที่ root project แล้วรัน:

   ```powershell
   npm start
   ```

   จากนั้นเปิด Expo Go หรือ web ตามที่ Expo แสดง และ login เพื่อดูรายการสินค้า

## เปิดใช้ K-Means

K-Means ทำงานใน Node.js backend โดยตรง จึงไม่ต้องติดตั้ง Python หรือ package เพิ่มบน server

1. Restart backend ด้วย `node server.js`
2. Login เข้า Expo app เปิดเมนู แล้วเลือก **Stock clusters (K-Means)** จากนั้นกด **Analyze inventory**

ระบบจะอ่านสินค้าอย่างเดียวและจัดกลุ่มจาก `price` กับ `stock`; ไม่เขียนผล cluster ลง MySQL และไม่เปลี่ยนสินค้าเดิม

## จุดที่อธิบายอาจารย์ได้

- ฐานข้อมูลของฉันคือ MySQL ตาราง `Inventory`
- Backend ใช้ Node.js + Express และเชื่อม MySQL ด้วย `mysql2`
- `GET /api/assignment/products` ดึงเฉพาะฟิลด์ที่ต้องใช้ แล้วคืนค่าเป็น JSON
- แอป Expo เรียก API ผ่าน `src/app/_api.ts` เพื่อแสดงสินค้าบนมือถือ
- งานเดี่ยวจบที่ API ของฐานข้อมูลตัวเอง จึงไม่มีการรวมข้อมูลของสมาชิกอื่นหรือ K-Means

## เช็กลิสต์ก่อนส่ง

- [ ] `backend/.env` ไม่ถูกส่งขึ้น Git และไม่มีรหัสผ่านในภาพหน้าจอ
- [ ] `GET /api/assignment/products` ตอบ `200 OK`
- [ ] JSON มีอย่างน้อย `id`, `name`, `category`, `price`, `stock`
- [ ] มีข้อมูลสินค้าอย่างน้อย 3 รายการเพื่อให้ผู้ตรวจเห็นผลจริง
- [ ] ถ่ายภาพหน้าจอ: terminal ที่ server รัน, browser/Postman ที่เห็น JSON, และหน้าแอปสินค้า
