var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Pedido = require('../models/pedido');
var logger = require('../utils/logger');

//===================================
// crear nuevo pedidos
//==================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var pedido = new Pedido({
        email: body.email,
        nombre: body.nombre,
        apellido: body.apellido,
        direccion1: body.direccion1,
        direccion2: body.direccion2,
        region: body.region,
        comuna: body.comuna,
        telefono: body.telefono,
        adicional: body.adicional,
        articulos: body.articulos
    });

    pedido.save((err, pedidoGuardado) => {
        console.log('pedido');
        console.log(err);
        if (err) {
            logger.error('Pedido.save', { route: `/pedido`, method: 'POST', object: pedido, error: errAny });
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear pedido',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            pedido: pedidoGuardado,
        });
        logger.info('Pedido Guardado', { route: `/pedido`, method: 'POST', object: pedido });

    });
});

//=====================================
// Obtener todos los pedidos de un email
//=====================================
app.get('/:email', (req, res, next) => {

    var email = req.params.email;
    console.log(email);
    Pedido.findOne({ email })
        .exec(
            (err, pedidos) => {
                if (err) {
                    logger.error('Pedido.find', { route: `/pedido`, method: 'GET', object: desde, error: err });
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Obteniendo pedido',
                        errors: err
                    });
                }

                Pedido.count({ email }, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        pedidos: pedidos,
                        total: conteo
                    });
                });
                logger.info('Obtiene todos los pedidos', { route: `/pedidos`, method: 'GET', object: desde });
            }
        );
});
// //===================================
// // Obtener un producto 
// //==================================
// app.get('/:id', (req, res, next) => {

//     var id = req.params.id;
//     // var desde = req.query.desde || 0;
//     // desde = Number(desde);
//     // console.log(id);
//     Producto.findById(id)
//         .populate('categoria', 'nombre')
//         .exec(
//             (err, producto) => {

//                 if (err) {
//                     logger.error('Producto.findById', { route: `/producto/${id}`, method: 'GET', object: id, error: err });
//                     return res.status(500).json({
//                         ok: false,
//                         mensaje: 'Error Obteniendo producto',
//                         errors: err
//                     });
//                 }

//                 res.status(200).json({
//                     ok: true,
//                     producto: producto
//                 });
//                 logger.info('Obtiene un producto', { route: `/producto/${id}`, method: 'GET', object: producto });
//             }
//         );
// });

// //===================================
// // Actualizar producto OK
// //==================================
// app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

//     var id = req.params.id;
//     var body = req.body;

//     Producto.findById(id, (err, producto) => {

//         if (err) {
//             logger.error('Producto.findById', { route: `/producto/${id}`, method: 'PUT', object: body, error: err });
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al buscar producto',
//                 errors: err
//             });
//         }

//         if (!producto) {
//             logger.error('Producto no existe', { route: `/producto/${id}`, method: 'PUT', object: body, error: err });
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'El producto con el id ' + id + ' no existe',
//                 errors: { message: 'No existe producto' }
//             });
//         }

//         producto.nombre = body.nombre;
//         producto.precio = body.precio;
//         producto.descripcion = body.descripcion;
//         producto.stock = body.stock;
//         producto.categoria = body.categoria;
//         producto.oferta = body.oferta;
//         producto.destacado = body.destacado;
//         producto.nuevo = body.nuevo;
//         producto.descuento = body.descuento;
//         producto.activo = body.activo;

//         producto.save((err, productoGuardado) => {
//             if (err) {
//                 logger.error('Producto.save', { route: `/producto/${id}`, method: 'PUT', object: body, error: err });
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'Error al actualizar producto',
//                     errors: err
//                 });
//             }
//             producto.password = ':)'
//             res.status(200).json({
//                 ok: true,
//                 producto: productoGuardado
//             });
//             logger.info('Producto Actualizado', { route: `/producto/${id}`, method: 'PUT', object: productoGuardado });
//         });

//     });
// });


// //===================================
// // Eliminar producto OK
// //==================================
// app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

//     var id = req.params.id;
//     Producto.findByIdAndRemove(id, (err, productoBorrado) => {
//         if (err) {
//             logger.error('Producto.findByIdAndRemove', { route: `/producto/${id}`, method: 'DELETE', object: id, error: err });
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al borrar producto',
//                 errors: err
//             });
//         }
//         if (!productoBorrado) {
//             logger.error('Producto no existe', { route: `/producto/${id}`, method: 'DELETE', object: id, error: err })
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'El producto con el id ' + id + ' no existe',
//                 errors: { message: 'No existe producto a eliminar' }
//             });
//         }

//         res.status(200).json({
//             ok: true,
//             producto: productoBorrado
//         });
//         logger.info('Producto Eliminado', { route: `/producto/${id}`, method: 'DELETE', object: productoBorrado });
//     })
// });

module.exports = app;