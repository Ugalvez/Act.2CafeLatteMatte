/*const fs = require('fs');
const path = require('path');


const raizDir = require('../utils/path');

const u = path.join(raizDir, 'data', 'user.json');

const getUsersFromFile = (cb) => {
    fs.readFile(u, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    })
}

module.exports = class Usuarios {
    constructor(id, nombre, email, pass) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.passwird = password;       
    }
    
    static login(email, password, cb) {
        getUsersFromFile((usuarios) => {
            // Busca al usuario con el email y contraseña proporcionados
            const usuario = usuarios.find(user => user.email === email && user.password === password);
            if (usuario) {
                // Usuario encontrado, devuelve true
                cb(true);
            } else {
                // Usuario no encontrado, devuelve false
                cb(false);
            }
        });
    }
}*/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  carrito: {
    items: [
      {
        idProducto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
        cantidad: { type: Number, required: true }
      }
    ]
  }
});

module.exports = mongoose.model('Usuarios', usuarioSchema);

