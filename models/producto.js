const fs = require('fs');
const path = require('path');

const raizDir = require ('..//utils/path')

const p = path.join(raizDir,'data','productos.json')

const getProductosFormFile = (cb) =>{
    fs.readFile(p, (err,fileContent)=>{
        if(err){
            cb([])
        } else {
        cb(JSON.parse(fileContent));
        
        }


    })


}

module.exports = class Producto{
    constructor(nom, urlImagen,descripcion,precio,precioPromo,disponibilidad,categoria){
        this.nombre = nom;
        this.urlImagen = urlImagen.split(':')[1];
        this.descripcion = descripcion;
        this.precio = precio;
        this.precioPromo = precioPromo;
        this.disponibilidad = disponibilidad;
       // this.categoria = categoria;

    }

    save(){
        getProductosFormFile(productos=>{
            console.log(productos);
            productos.push(this);
            fs.writeFile(p, JSON.stringify(productos), err => {

                console.log(err);

            })

         })
    }

    static fetchAll(cb){
        return getProductosFormFile(cb);
    }

}