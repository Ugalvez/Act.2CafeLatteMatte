

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Estructura de usuario
const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  apellidoPaterno: {
    type: String,
    required: true
  },
  apellidoMaterno: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['administrador', 'cliente'], // Define los roles posibles
    default: 'cliente' // Valor por defecto
  },
  fechaCreacion: {
    type: Date,
    default: Date.now // Fecha de creación automática
  },
  tokenReinicio: String,
  expiracionTokenReinicio: Date,
  carrito: {
    items: [
      {
        idProducto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
        cantidad: { type: Number, required: true }
      }
    ]
  },

  pedidos: [
    {
        productos: [
            {
                idProducto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
                cantidad: { type: Number, required: true }
            }
        ],
        fecha: {
            type: Date,
            default: Date.now
        }
    }
]
  




});

usuarioSchema.methods.agregarAlCarrito = function(producto) {
  if (!this.carrito) {
    this.carrito = {items: []};
  }
  const indiceEnCarrito = this.carrito.items.findIndex(cp => {
    return cp.idProducto.toString() === producto._id.toString();
  });
  let nuevaCantidad = 1;
  const itemsActualizados = [...this.carrito.items];
  if (indiceEnCarrito >= 0) {
    nuevaCantidad = this.carrito.items[indiceEnCarrito].cantidad + 1;
    itemsActualizados[indiceEnCarrito].cantidad = nuevaCantidad;
  } else {
    itemsActualizados.push({
      idProducto: producto._id,
      cantidad: nuevaCantidad
    });
  }
  const carritoActualizado = {
    items: itemsActualizados
  };
  this.carrito = carritoActualizado;
  return this.save();
};


usuarioSchema.methods.deleteItemDelCarrito = function(idProducto) {
  const itemsActualizados = this.carrito.items.filter(item => {
    return item.idProducto.toString() !== idProducto.toString();
  });
  this.carrito.items = itemsActualizados;
  return this.save();
};


usuarioSchema.methods.limpiarCarrito = function() {
  this.carrito = { items: [] };
  return this.save();
};



usuarioSchema.methods.agregarPedido = function (productos) {
  this.pedidos.push({ productos });
  return this.save();
};


module.exports = mongoose.model('Usuario', usuarioSchema);

