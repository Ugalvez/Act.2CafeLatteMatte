
const Usuarios = require('../models/users');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');



exports.getLogin = (req, res) => {
    res.render('../views/login', { 
        titulo: 'Iniciar Sesion', 
        path: '/login',
    })
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    Usuarios.login(email, password, (exito) => {
        if(exito) { 
            Producto.fetchAll(productos => {
                res.render('tienda', {
                    prods: productos,
                    titulo: "Pagina principal de la Tienda", 
                    path: "/"
                })}
            )
            
            /*res.render('tienda/index', {
                prods: productos
                titulo: 'bienvenido usuario',
                path: "/login",
            });*/
        }
        else {
            res.send('usuario o contrasena incorrecta',);
        
        }
        }
    )
}



