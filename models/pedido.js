var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pedidoSchema = new Schema({
    nombre: { type: String, required: [true, 'Nombre es Obligatorio'] },
    apellido: { type: String, required: [true, 'Apellido es Obligatorio'] },
    direccion1: { type: String, required: [true, 'Dirección es Obligatorio'] },
    direccion2: { type: String },
    region: { type: String, required: [true, 'Región es Obligatorio'] },
    comuna: { type: String, required: [true, 'Comuna es Obligatorio'] },
    telefono: { type: String, required: [true, 'Telefono es Obligatorio'] },
    adicional: { type: String },
    articulos: { type: Array, required: [true, 'Debe seleccionar un articulo para comprar'] },

    // precio: { type: Number, required: [true, 'Precio es Obligatorio'] },
    // descripcion: { type: String, required: [true, 'Descripcion es Obligatorio'] },
    // stock: { type: Number, required: [true, 'Stock es Obligatorio'] },
    // // categoria: { type: String, required: [true, 'Categoria es Obligatorio'] },
    // categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: [true, 'Categoria obligatorio'] },
    // oferta: { type: Boolean, required: [true, 'Oferta es Obligatorio'] },
    // destacado: { type: Boolean, required: [true, 'Destacado es Obligatorio'] },
    // nuevo: { type: Boolean, required: [true, 'Nuevo es Obligatorio'] },
    // descuento: { type: Number },
    // activo: { type: Boolean, required: [true, 'Activo es Obligatorio'] },
    // img: { type: String },

});

module.exports = mongoose.model('Pedido', pedidoSchema);