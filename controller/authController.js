const User = require("../model/User");

const moveToLogin = (req, res) =>{
    res.render('loginView')
}

const handleLogin = (req, res) =>{
    const {email, pass} = req.body;
    console.log({email, pass})
    const user = User.getUser(email, pass)

    if (user){
        console.log("Đăng nhập thành công!!!")
        res.redirect('/products')
    }else{
        console.log("Đăng nhập thất bại!!!")
        res.render("loginView", { error: "Email hoặc mật khẩu không đúng!" })
    }
}


module.exports = {
    moveToLogin,
    handleLogin
}