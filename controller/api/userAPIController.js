const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Users = db.User;
const Interests = db.Interest;
const Invoice = db.Invoice;
const UserCategories = db.UserCategory;

//---------------------------
//Dentro del actorsAPIController uso las dos forma de poder llamar a nuestros modelo
//----------------------------------
const userAPIController = {
    'list': (req, res) => {
        db.User.findAll()
        .then(users => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: users.length,
                    url: 'api/users'
                },
                data: users
            }
                res.json(respuesta);
            })
    },
    'detail': (req, res) => {
        
        db.User.findByPk(req.params.id)
       
            .then(users => {
                let respuesta = {
                    meta: {
                        status: 200,
                        url: '/api/users/:id'
                    },
                    data: {
                        "user_id": users.user_id,
                        "name": users.name,
                        "userName": users.userName,
                        "email": users.email,
                        "bday": users.bday,
                        "invoice_id": users.invoice_id,
                        "interest_id": users.interest_id,
                        "picture": "https://oraclewines.onrender.com//images/users/"+ users.picture

                    }
                    
                }
                res.json(respuesta);
                
        });
    }
}   

module.exports = userAPIController;