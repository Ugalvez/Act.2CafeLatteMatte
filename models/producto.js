const fs = require('fs');
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
       // this.categoria = categoria;

    }

    save(){
       
       /* getProductosFromFile(productos=>{
            console.log(productos);
            productos.push(this);
            fs.writeFile(p, JSON.stringify(productos), err => {

                console.log(err);

            })

         })*/

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

}