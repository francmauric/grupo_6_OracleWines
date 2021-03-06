var express = require('express');
var router = express.Router();
let productsController = require("../controller/productsController");
let multer = require('multer');
let path = require('path');

//Configuración de Multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({ storage: storage })

//vista de productos
router.get("/", productsController.catalogo)
// vista detalle del producto
router.get("/detail/:id", productsController.detail)
//vista del creado de producto
router.get("/create", productsController.create)
router.post("/create", upload.single("image"), productsController.createProcess)
//vista del editado de producto
router.get("/edit/:id", productsController.edit)
router.put("/edit/:id", upload.single("thisimage"), productsController.editProcess)
//vista del eliminado de producto
router.delete("/delete/:id", productsController.destroy)
// vista del carrito de compras
router.get("/cart", productsController.carrito)

module.exports = router;
