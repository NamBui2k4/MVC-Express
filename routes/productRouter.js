const express = require('express');
const router = express.Router();
const multer = require("multer")

const productController = require('../controller/productController');

// 1️⃣ Định nghĩa storage cho Multer
const storage =  multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/products/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// 2️⃣ Tạo middleware upload từ storage
const upload = multer({storage: storage})

// 3️⃣ Định nghĩa các route
router.get('/', productController.getProducts);
router.get('/add', productController.showAddPage)
router.post('/add', upload.single('image'), productController.addProduct);


module.exports = router;