var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/producto', function(req, res, next) {
  res.render('productDetail', { title: 'Detalle del Producto' });
});

module.exports = router;
