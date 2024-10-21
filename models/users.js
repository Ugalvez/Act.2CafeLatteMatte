const fs = require('fs');
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
}


