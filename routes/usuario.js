var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion')

var app = express();
var Usuario = require('../models/usuario');
var logger = require('../utils/logger');


//===================================
// crear nuevo usuario
//==================================
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        estado: body.estado,
        // img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            // usuarioToken: req.usuario
        });

    });
});



// //===================================
// // Obtener todos los usuario
// //==================================
// app.get('/', (req, res, next) => {


//     var desde = req.query.desde || 0;
//     desde = Number(desde);

//     Usuario.find({}, 'nombre email img role')
//         .skip(desde)
//         .limit(5)
//         .exec(
//             (err, usuarios) => {
//                 if (err) {
//                     return res.status(500).json({
//                         ok: false,
//                         mensaje: 'Error Obteniendo Usuario',
//                         errors: err
//                     });
//                 }

//                 Usuario.count({}, (err, conteo) => {
//                     res.status(200).json({
//                         ok: true,
//                         usuarios: usuarios,
//                         total: conteo
//                     });
//                 })

//             }
//         );
// });

// //===================================
// // Actualizar usuario
// //==================================
// app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

//     var id = req.params.id;
//     var body = req.body;

//     Usuario.findById(id, (err, usuario) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al buscar Usuario',
//                 errors: err
//             });
//         }

//         if (!usuario) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'El usuario con el id ' + id + ' no existe',
//                 errors: { mensaje: 'No existe usuario' }
//             });
//         }

//         usuario.nombre = body.nombre;
//         usuario.email = body.email;
//         usuario.role = body.role;

//         usuario.save((err, usuarioGuardado) => {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'Error al actualizar Usuario',
//                     errors: err
//                 });
//             }
//             usuario.password = ':)'
//             res.status(200).json({
//                 ok: true,
//                 body: usuarioGuardado
//             });
//         })
//     });
// });
//===================================
// Activar usuario
//==================================
app.put('/activar/:id', (req, res) => {

    var id = req.params.id;
    // var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { mensaje: 'No existe usuario' }
            });
        }

        if (usuario.estado == 'registrado') {
            return res.status(400).json({
                ok: false,
                mensaje: 'tu cuenta ya se encuenta activa',
                // errors: { mensaje: 'No existe usuario' }
            });
        }
        // usuario.nombre = body.nombre;
        // usuario.email = body.email;
        // usuario.role = body.role;
        usuario.estado = 'registrado'

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Usuario',
                    errors: err
                });
            }
            usuario.password = ':)'
            res.status(200).json({
                ok: true,
                body: usuarioGuardado
            });
        })
    });
});


// //===================================
// // Eliminar usuario
// //==================================
// app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

//     var id = req.params.id;
//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al borrar Usuario',
//                 errors: err
//             });
//         }
//         if (!usuarioBorrado) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'No existe usuario',
//                 errors: { message: 'No existe usuario' }
//             });
//         }

//         res.status(200).json({
//             ok: true,
//             usuario: usuarioBorrado
//         });
//     })
// });

module.exports = app;