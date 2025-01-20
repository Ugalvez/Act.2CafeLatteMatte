const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Estructura de producto
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
    required: false
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
  },
  categoria: {
    type: String,
    required: true
  },
  favorito: { 
    type: Boolean,
    default: false // Este valor solo se asignará si 'favorito' no se envía.
  }
});

module.exports = mongoose.model('Producto', productoSchema);