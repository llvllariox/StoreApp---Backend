var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'Nombre es Obligatorio'] },
    email: { type: String, unique: true, required: [true, 'Email es Obligatorio'] },
    password: { type: String, required: [true, 'Contraseña es Obligatoria'] },
    estado: { type: String, required: [true, 'Estado contraseña es Obligatoria'] },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);