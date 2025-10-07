
const Product = require("../model/Product")

const getProducts = (req, res) =>{
  const products = Product.getAllProducts()  
  console.log('Dữ liệu products gửi sang view:', products);
  res.render('productsView', {products})
}

const getProductById = (req,res) =>{
  const product = Product.getProductById()
  res.render('productsView', {product})
}

const addProduct = (req, res) => {
  const {product_name, price, description } = req.body;
  const image = req.file ? req.file.filename : null;
  // console.log({product_name, price, description });
  Product.addProduct(product_name, price, description, image);
  res.redirect('/products')
}

const showAddPage = (req, res) => {
  res.render('addView') // views/addView.ejs
}


module.exports = {
    getProducts,
    addProduct,
    getProductById,
    showAddPage
}