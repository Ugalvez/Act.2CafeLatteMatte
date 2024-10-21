const fs = require('fs');
const path = require('path');

const raizDir = require('../utils/path');

const p = path.join(raizDir, 'data', 'carrito.json');


module.exports = class Carrito {
    /*static agregarProducto(id, precio, nombre) {

        fs.readFile(p, (err, fileContent) => {
            let carrito = {productos: [], precioTotal: 0};
            if (!err) {
                carrito = JSON.parse(fileContent);
            }

            const indiceProductoExistente = carrito.productos.findIndex(prod => prod.id === id);

            const productoExistente = carrito.productos[indiceProductoExistente];
            let productoActualizado;
            // Si el producto SI existe en el carrito
            if(productoExistente) {
                // Incrementar la cantidad en 1 unidad
                productoActualizado = {...productoExistente};
                productoActualizado.cantidad = productoActualizado.cantidad + 1;
                carrito.productos = [...carrito.productos];
                carrito.productos[indiceProductoExistente] = productoActualizado;
            // Si el producto NO existe en el carrito
            } else {
                // Empezar la cantidad con 1 unidad
                productoActualizado = {id: id, nombre: nombre, precio: precio, cantidad: 1};
                carrito.productos = [...carrito.productos, productoActualizado];
            }
            carrito.precioTotal = carrito.precioTotal + +precio;
            fs.writeFile(p, JSON.stringify(carrito), err => {
                console.log(err);
            })

        })

    }*/

        static agregarProducto(id, precio, nombre) {
            fs.readFile(p, (err, fileContent) => {
                let carrito = { productos: [], precioTotal: 0 };
                if (!err) {
                    carrito = JSON.parse(fileContent);
                }
        
                const indiceProductoExistente = carrito.productos.findIndex(prod => prod.id === id);
                const productoExistente = carrito.productos[indiceProductoExistente];
                let productoActualizado;
        
                if (productoExistente) {
                    productoActualizado = { ...productoExistente };
                    // Aumentar cantidad
                    productoActualizado.cantidad += 1;
                    carrito.productos[indiceProductoExistente] = productoActualizado;
                } else {
                    // Añadir nuevo producto
                    productoActualizado = { id: id, nombre: nombre, precio: precio, cantidad: 1 };
                    carrito.productos.push(productoActualizado);
                }
        
                // Actualizar el precio total
                carrito.precioTotal = carrito.productos.reduce((total, prod) => total + (prod.precio * prod.cantidad), 0);
                
                fs.writeFile(p, JSON.stringify(carrito), err => {
                    console.log(err);
                });
            });
        }
        

    static eliminarProducto(id, precio) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const carritoActualizado = { ...JSON.parse(fileContent) };
            const producto = carritoActualizado.productos.find(prod => prod.id === id);
            if (!producto) {
                return;
            } 
            const cantidadProducto = producto.cantidad;
            carritoActualizado.productos = carritoActualizado.productos.filter(
                prod => prod.id !== id
            );
            carritoActualizado.precioTotal =
                carritoActualizado.precioTotal - precio * cantidadProducto;

            fs.writeFile(p, JSON.stringify(carritoActualizado), err => {
                console.log(err);
            });
        });
    }

   /* static modificarCantidad(id, nuevaCantidad, precio) {
        fs.readFile(p, (err, fileContent) => {
            let carrito = { productos: [], precioTotal: 0 };
            if (!err) {
                carrito = JSON.parse(fileContent);
            }
    
            const producto = carrito.productos.find(prod => prod.id === id);
            if (!producto) {
                return;
            }
    
            const diferenciaCantidad = nuevaCantidad - producto.cantidad;
            producto.cantidad = nuevaCantidad;
            carrito.precioTotal += diferenciaCantidad * precio;
    
            fs.writeFile(p, JSON.stringify(carrito), err => {
                console.log(err);
            });
        });
    }*/
        static modificarCantidad(id, nuevaCantidad, precio) {
            fs.readFile(p, (err, fileContent) => {
                if (err) return;
        
                const carrito = JSON.parse(fileContent);
                const producto = carrito.productos.find(prod => prod.id === id);
                
                if (producto) {
                    producto.cantidad = nuevaCantidad;
                    // Actualizar el precio total
                    carrito.precioTotal = carrito.productos.reduce((total, prod) => total + (prod.precio * prod.cantidad), 0);
                    fs.writeFile(p, JSON.stringify(carrito), err => {
                        console.log(err);
                    });
                }
            });
        }
        

    static eliminarProducto(id, precio) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const carritoActualizado = { ...JSON.parse(fileContent) };
            const producto = carritoActualizado.productos.find(prod => prod.id === id);
            if (!producto) {
                return;
            }
            const cantidadProducto = producto.cantidad;
            carritoActualizado.productos = carritoActualizado.productos.filter(
                prod => prod.id !== id
            );
            carritoActualizado.precioTotal =
                carritoActualizado.precioTotal - precio * cantidadProducto;
    
            fs.writeFile(p, JSON.stringify(carritoActualizado), err => {
                console.log(err);
            });
        });
    }
    
}
    