# Tổng quan mô hình MVC trong Express

```pgsql                    
                                                            ┌─────────────────────────────────────────────────┐
                                                            │                    SERVER                       │
    ┌───────────────────────────────────────┐               │                                                 │         ┌──────────────┐     
    │                                       │   (Req) (1)   │   ┌──────────────┐         ┌──────────────┐     │         │              │
    │                  Browser              │               |   │              │  (2)    │              │     │  (3)    │              │
    │      (Client: HTML / EJS / UI)        │ ───────────────►  │  Controller  │ ──────► │    Model     │  ──────────►  │      DB      │
    │                                       │               │   │              │ ◄────── │              │  ◄──────────  │              │
    └───────────────────────────────────────┘               │   └──────┬───────┘  (5)    └──────────────┘     │  (4)    │              │
                        ▲                                   │          │                                      │         └──────────────┘
                        │                                   │   + data │  (6)                                 │
                        │                                   │          │                                      │
                        │                                   │          ▼                                      │
                        │         (Res)  (7)                │       ┌──────────────┐                          │
                        └─────────────────────────────────────────  │     View     │                          │
                                                            │       └──────────────┘                          │
                                                            └─────────────────────────────────────────────────┘
```


# Giải thích từng bước luồng hoạt động

Browser (Client)

- Gửi Request (Req) → ví dụ: GET /products.

Controller

- Nhận request từ browser qua hệ thống routing của Express.

- Gọi Model để lấy hoặc xử lý dữ liệu (ví dụ truy vấn danh sách sản phẩm).

Model

- Là nơi xử lý dữ liệu, có thể truy cập DB (Database) để đọc/ghi.

- Trả kết quả (data) về lại Controller.

Controller

- Nhận data từ Model → đính kèm vào View bằng lệnh res.render('view', { data }).

View

- Nhận data từ Controller, dùng EJS/HTML để hiển thị ra giao diện.

Browser (Client)

- Nhận Response (Res) là trang HTML đã render sẵn → hiển thị lên màn hình.

# Tóm gọn
```pgsql
Browser ⇆ Controller ⇆ Model ⇆ DB
                ↓
             +data
                ↓
              View
                ↓
              (Res)
```

# 🧩 Vị trí của Router trong MVC

Khi ta cài đặt với nodejs, giữa Browser và Controller còn có Router, vì request từ browser không đi thẳng vào controller mà phải được định tuyến (routed).

Lưu ý: 

- Router là “người gác cổng”, chỉ xác định xem “đi đường nào, gọi ai” trên HTTP method.
- Không xử lý nghiệp vụ.
- Không render giao diện.

```pgsql
  (Req)    (1)                  (3)          cle(4)
Browser ────────►  Controller ─────► Model ─────► DB
            ▲
            │ (2)
          Router 
```

- Thử đặt câu hỏi: Nếu không có router thì sao?
- => Về mặt kĩ thuật, nếu không có router, sau khi định nghĩa logic code trong các function của controller, ta vô tình quên gọi các function này dẫn đến hiện tượng các hành động tương tác với giao diện không trả về cái gì cho phía backend. 

# Cấu trúc project cơ bản (khởi tạo bằng express-generator)

```pgsql
myapp/
  ├───── app.js
  ├───── bin/
  ├───── routes
  │         ├─ index.js 
  │         ├─ product.js
  │         ├─ order.js
  │         └─ users.js
  ├───── controllers/
  │              (tự tạo thêm: productController.js, authController.js)
  ├───── models/
  │         (tự tạo thêm: product.js)
  ├───── views/
  │         (EJS: index.ejs, login.ejs, add.ejs, detail.ejs...)
  └───── public/ 
            (static assets)
```

# Luồng chuẩn
```pgsql
Browser
  ↓
Express App (app.js)
  ↓
Router (/routes/product.js)
  ↓
Controller (/controllers/productController.js)
  ↓
Model → DB
  ↓
View
  ↓
Response to Browser
```

1. Router đọc URL và HTTP method, sau đó chuyển yêu cầu đến đúng hàm trong Controller:

```js
// routes/product.js
const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

router.get('/', productController.getProducts);
router.post('/add', productController.addProduct);

module.exports = router;
```
2. Controller thực hiện logic
```js
exports.getProducts = (req, res) => {
  const products = [ ... ];
  res.render('product', { products });
};

```
# Sơ đồ Endpoint trong Express MVC

Một trong những sai lầm lớn nhất khi làm quen với Express MVC đó là: 

    Không biết đường đi của endpoint (route → controller → view), dẫn đến lỗi “render sai file / không đổ được dữ liệu”

Ta lấy ví dụ sơ đồ dưới đây:

```pgsql

📍 Người dùng: http://localhost:3000/products
              │
              ▼
┌───────────────────────────────────────────────────┐
│ app.js (Entry point)                              │
│---------------------------------------------      │
│ const productRouter = require('./routes/product') │
│ app.use('/products', productRouter)               │
└───────────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────┐
│ routes/product.js                            │
│----------------------------------------------│
│ const productController =                    │
│  require('../controller/productController'); │
│                                              │       
│ router.get('/', productController.getAll);   │
│ router.post('/add', productController.add);  │
└──────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────┐
│ controllers/productController.js             │
│----------------------------------------------│
│ const Product = require('../models/product') │
│                                              │
│ getAll(req, res):                            │
│   const products = Product.getAll();         │
│   res.render('product', { products });       │
│                                              │
│ add(req, res):                               │
│   Product.add(req.body);                     │
│   res.redirect('/products');                 │
└──────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────┐
│ models/product.js                            │
│----------------------------------------------│
│                                              │
│   getAll() { return data; }                  │
│   add(newProduct) { data.push(newProduct); } │
│                                              │
└──────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────┐
│ views/product.ejs                            │
│----------------------------------------------│
│ Hiển thị dữ liệu qua EJS (table, buttons...) │
└──────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────┐
│ Browser                                      │
│----------------------------------------------│
│ Người dùng thấy HTML được render             │
└──────────────────────────────────────────────┘
```

- Nhìn vào `app.js` và `routes/product.js`, ta đặt ra câu hỏi:
  - Tại sao một bên là app gọi tới `productRouter` để điều hướng tới route '/products', trong khi bên `productRouter` thì 
  các http method lại được gọi ở những vị trí khác như '/' hay '/add' ?

👉 Trước hết: Express có 2 cấp định tuyến (routing levels):

  1. app-level: Xác định prefix (tiền tố) cho nhóm router
  2. router-level: Xác định endpoint cho các http methods bên trong router

Khi đó, Express sẽ ghép nối prefix + endpoint: ```/products + /add = /products/add```

Đây mới chính là đường dẫn thực sự, điều đó có nghĩa rằng trên search bar thì người dùng phải nhập đầy đủ `http://localhost:3000/products/add`

- Vậy còn controller thì sao, tại sao lại có một số fn lại có endpoint  (ví dụ `'product'` hoặc `'/product'`) ?
  - Thực ra thì không phải fn nào cũng có endpoint.
    
    Và cái chuỗi truyền vào fn đó cũng chưa chăc là endpoint đâu, Ví dụ:
      - `'product'` truyền vào `res.render()` là đường dẫn với file .ejs trong view (ví dụ: views/product.ejs) chứ không phải endpoint
      - `'/product'` truyền vào `res.redirect()` mới là endpoint vì nó là logic xử lý điều hướng sang một route khác.
    
    Một số fn khác trong controller chỉ có chức năng trả về JSON hoặc API response nên sẽ không có chuỗi này.

# Kết quả demo

1. Trang login

![alt text](image.png)

2. login thất bại

![alt text](image-1.png)

3. Danh sách sản phẩm

![alt text](image-2.png)

4. Thêm sản phẩm

![alt text](image-3.png)

5. Kết quả sau khi thêm

![alt text](image-4.png)