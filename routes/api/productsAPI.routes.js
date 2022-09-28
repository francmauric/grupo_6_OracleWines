const express = require('express');
const router = express.Router();
const productsAPIController = require('../../controller/api/productsAPIController');

//Rutas
//Listado de pproducts
router.get('/', productsAPIController.list);

module.exports = router;