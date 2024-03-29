const fs = require('fs');
const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const { validationResult } = require("express-validator");

//Aqui tienen otra forma de llamar a cada uno de los modelos
const Products = db.Product;
const Categories = db.Category;
const Users = db.User;

const productsController = { 
    'list': (req, res) => { 
        db.Product.findAll()
            .then(products => {
                res.render(path.resolve(__dirname, "../views/products/catalogo.ejs"), { products })
            })
    },
    'detail': (req, res) => {
        db.Product.findByPk(req.params.id,
            {
                include : ['category']
            })
            .then(productEncontrado => {
				res.render(path.resolve(__dirname, "../views/products/productDetail.ejs"), {productEncontrado});
            });
    },
    add: function (req, res) {
        db.Category.findAll()
        .then(categories => {
            res.render(path.resolve(__dirname, "../views/products/create-product.ejs"), { categories })
        })
    },
    create: function (req,res) {
		let resultValidation = validationResult(req)
		let promCategories = db.Category.findAll()
		
		Promise
			.all([promCategories])
			.then(([categories]) => {

			if (resultValidation.errors.length > 0) {
						
				res.render("products/create-product", {
					errors: resultValidation.mapped(),
					oldData: req.body,
					categories

				})
			} else {
		
			Products
			.create(
				{
					name: req.body.name,
					price: req.body.price,
					stock: req.body.stock,
					discount: req.body.discount,
					category_id: req.body.category,
					awards: req.body.awards,
					description: req.body.description,
					extra_description: req.body.extra_description,
					rate: req.body.rate,
					image: req.file.filename
				}
			)
			.then(()=> {
				return res.redirect('/products')})
			}})      
			.catch(error => res.send(error))
		
    },

    edit: function(req,res) {
        let productId = req.params.id;
        let promProducts = Products.findByPk(productId,{include: ['category']});
        let promCategories = Categories.findAll();
        Promise
        .all([promProducts, promCategories])
        .then(([productToEdit, categories]) => {
           return res.render(path.resolve(__dirname, "../views/products/edit-product.ejs"), {productToEdit,categories})})
        .catch(error => res.send(error))
    },
    update: function (req,res) {
        let productId = req.params.id;
		let promProducts = Products.findByPk(productId,{include: ['category']});
		let promCategories = db.Category.findAll()
		let resultValidation = validationResult(req)
		
		Promise
			.all([promCategories, promProducts])
			.then(([categories, productToEdit]) => {

			if (resultValidation.errors.length > 0) {
						
				res.render("products/edit-product", {
					errors: resultValidation.mapped(),
					oldData: req.body,
					productToEdit,
					categories

				})
			} else {
		
        Products
        .update(
            {
                name: req.body.name,
                price: req.body.price,
                stock: req.body.stock,
                discount: req.body.discout,
                category_id: req.body.category,
                awards: req.body.awards,
                description: req.body.description,
				extra_description: req.body.extra_description,
				rate: req.body.rate,
				image: req.file.filename
            },
            {
                where: {product_id: productId}
            })
        .then(()=> {
            return res.redirect('/products')})
		}})            
        .catch(error => res.send(error))
    },
    destroy: function (req,res) {
        let productId = req.params.id;
        Products
        .destroy({where: {product_id: productId}, force: true})
        .then(()=>{
            return res.redirect('/products')})
        .catch(error => res.send(error)) 
    },
    	//vista del Carrito de compras
	carrito: (req,res)=> {
		res.render('products/carrito')
	},
	buscar: async(req,res) =>{
		
		const keyword = req.body.keyword
		console.log(keyword)
		const Products = await db.Product.findAll({
			where: {
				name: { [Op.like]: "%" + keyword + "%"}
			}
		})
		.then(([products]) =>{
			console.log(products)
			if(products != null){
				res.render(path.resolve(__dirname, "../views/products/productDetail.ejs"), {productEncontrado:products});
			}else res.render(path.resolve(__dirname, "../views/products/no-encontrado.ejs"));
			
		}) 
	},
	andinos: (req, res) => {
        db.Product.findAll({
            include: ['category'],
            where: {
                category_id: 1
            }
        })
            .then(products => {
                res.render(path.resolve(__dirname, "../views/products/andinos"), {products});
            });
    },
	patagonicos: (req, res) => {
        db.Product.findAll({
            include: ['category'],
            where: {
                category_id: 2
            }
        })
            .then(products => {
                res.render(path.resolve(__dirname, "../views/products/patagonicos"), {products});
            });
    },
	importados: (req, res) => {
        db.Product.findAll({
            include: ['category'],
            where: {
                category_id: 3
            }
        })
            .then(products => {
                res.render(path.resolve(__dirname, "../views/products/importados"), {products});
            });
    },
	premiados: (req, res) => {
        db.Product.findAll({
            include: ['category'],
            where: {
                awards: {[db.Sequelize.Op.gt] : 0}
            },
            order: [
                ['awards', 'DESC']
            ]
        })
            .then(products => {
                res.render(path.resolve(__dirname, "../views/products/premiados"), {products});
            });
    },
	recomendados: (req, res) => {
        db.Product.findAll({
            include: ['category'],
            where: {
                rate: 5
            }
        })
            .then(products => {
                res.render(path.resolve(__dirname, "../views/products/recomendados"), {products});
            });
    },
	ofertas: (req, res) => {
        db.Product.findAll({
            include: ['category'],
            where: {
                discount: {[db.Sequelize.Op.gte] : 15}
            },
            order: [
                ['discount', 'DESC']
            ]
        })
            .then(products => {
                res.render(path.resolve(__dirname, "../views/products/ofertas"), {products});
            });
    },
}


//CRUD ANTERIOR CON JSON

/*
let productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
// console.log(products)
const controller = {
	//vista de todos los productos
	catalogo: (req, res) => {
		res.render(path.resolve(__dirname, "../views/products/catalogo.ejs"), { products })
	},

	// vista del detalle de cada producto
	detail: (req, res) => {

		let variableid = parseInt(req.params.id)
		let productEncontrado = products.find(element => element.id === variableid)
		//console.log(productEncontrado)


		res.render(path.resolve(__dirname, "../views/products/productDetail.ejs"), { productEncontrado })

	},

	// vista para crear producto por metodo GET
	create: (req, res) => {
		res.render("products/create-product")
	},

	// vista para creado de producto por metodo POST

	createProcess: (req, res) => {

		//Agregar el producto nuevo al array
		
		let productNew = {
			id: Math.max(...products.map(e => e.id)) + 1,
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			descripcionExtra: req.body.descripcionExtra,
			rate: req.body.rate,
			image: req.file.filename,
		}

		products.push(productNew);
		console.log(products)
		//Transformar en JSON

		productsDataBaseJSON = JSON.stringify(products, null, 4);

		//Sobreescribir el archivo

		fs.writeFileSync(path.resolve(__dirname, "../data/productsDataBase.json"), productsDataBaseJSON);

		//Redirección a la URL de Productos
		res.redirect("/products");
	},

	// Vista para el Edit del producto por metodo GET
	edit: (req, res) => {
		let variableid = parseInt(req.params.id)
		let productToEdit = products.find(element => element.id === variableid)
		//console.log(productToEdit)
		res.render(path.resolve(__dirname, "../views/products/edit-product.ejs"), { productToEdit })

	},

	// Vista para el proceso del Edit de producto por metodo PUT
		editProcess: (req, res) => {
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		let id = req.params.id;  
		products.forEach(product => {
			if (product.id == id) {
				product.name = req.body.name,
					product.price = req.body.price,
					product.discount = req.body.discount,
					product.category = req.body.category,
					product.image = req.file == undefined ? product.image : req.file.filename,
					product.description = req.body.description
			}
		})

		let productJson = JSON.stringify(products, null, 2);
		fs.writeFileSync(productsFilePath, productJson, "utf-8")
		//console.log(productJson) 
		res.redirect(`/products/detail/${id}`)
		
	},
	
	  // Vista para eliminar un producto por metodo DELETE
	  destroy : (req, res) => {
	  	
		const productId = parseInt(req.params.id, 10);

        for (let i = 0; i < products.length; i++) {
            if ( products[i].id === productId ) {
                products.splice(i, 1)
            }
        }

		productsDataBaseJSON = JSON.stringify(products, null, 4);

		//Sobreescribir el archivo

		fs.writeFileSync(path.resolve(__dirname, "../data/productsDataBase.json"), productsDataBaseJSON);

        res.redirect("/products");
    },
	//vista del Carrito de compras
	carrito: (req,res)=> {
		res.render('products/carrito')
	}  
};
*/

module.exports = productsController;