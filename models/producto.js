/*const fs = require('fs');
const path = require('path');

const raizDir = require ('..//utils/path')

const p = path.join(raizDir,'data','productos.json')

const getProductosFromFile = (cb) =>{
    fs.readFile(p, (err,fileContent)=>{
        if(err){
            cb([])
        } else {
        cb(JSON.parse(fileContent));
        
        }


    })


}

module.exports = class Producto{
    constructor(id, nom, urlImagen,descripcion,precio,precioPromo,disponibilidad,categoria){
        this.id = id; //Math.random().toString();
        this.nombre = nom;
        this.urlImagen = urlImagen;
        this.descripcion = descripcion;
        this.precio = precio;
        this.precioPromo = precioPromo;
        this.disponibilidad = disponibilidad;
       

    }

    save(){
       

            getProductosFromFile(productos => {
                if (this.id) {
                    const indiceProductoExistente = productos.findIndex(
                        prod => prod.id === this.id
                    );
                    const productoActualizacios = [...productos];
                    productoActualizacios[indiceProductoExistente] = this;
                    fs.writeFile(p, JSON.stringify(productoActualizacios), err => {
                        console.log(err);
                    });
                } else {
                    this.id = Math.random().toString();
                    productos.push(this);
                    fs.writeFile(p, JSON.stringify(productos), err => {
                        console.log(err);
                    });
                }
            });        
    }

    static fetchAll(cb){
        return getProductosFromFile(cb);

    }




    static findById(id, cb) {
        getProductosFromFile(productos => {
            const producto = productos.find(prod => prod.id === id);
            cb(producto);
        })
    }

    static deleteById(id) {
        getProductosFromFile(productos => {
            const producto = productos.find(prod => prod.id === id);
            const productosActualizados = productos.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(productosActualizados), err => {
                if (!err) {
                    Carrito.eliminarProducto(id, producto.precio);
                }
            });
        });
    }

}*/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productoSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  precioPromo: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  urlImagen: {
    type: String,
    required: true
  },
  idUsuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
});

module.exports = mongoose.model('Producto', productoSchema);