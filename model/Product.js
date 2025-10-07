 let products = [
    {   
      "id": 1023,
      "name": "Vợt Cầu Lông Victor Ryuga Metalic",
      "price": 3500000,
      "discount": 0.15,
      "number": 25
    },
    {   
      "id": 1023,
      "name": "Giày Cầu Lông Lining AYAR001",
      "price": 1850000,
      "discount": 0.10,
      "number": 40
    },
    {
      "id": 113,
      "name": "Quả Cầu Lông Victor Master 3",
      "price": 450000,
      "discount": 0.05,
      "number": 150
    },
    {
      "id": 101,
      "name": "Túi Đựng Vợt Cầu Lông 3 Ngăn",
      "price": 780000,
      "discount": 0.20,
      "number": 30
    },
    {   
      "id": 999,
      "name": "Cuốn Cán Vợt Cầu Lông VS Overgrip",
      "price": 35000,
      "discount": 0.0,
      "number": 200
    }
  ]


const getAllProducts = () =>  products;

const createID = () => Math.random() * 11  % 7
const addProduct = (name, price, desc, image) =>{

  const newProduct = {
      "id":90,
      "name":name,
      "price": price,
      "desc": desc,
      "image": image
   }
  products.push(newProduct);
  console.log("Đã thêm sản phẩm:", newProduct)
}

const getProductById = (id) => products[id]

module.exports = {
    getAllProducts,
    getProductById,
    addProduct
}