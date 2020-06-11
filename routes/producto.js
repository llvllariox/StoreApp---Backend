var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion')

var app = express();
var Producto = require('../models/producto');

//===================================
// crear nuevo producto OK
//==================================
app.post('/', (req, res) => {

    var body = req.body;

    var producto = new Producto({
        nombre: body.nombre,
        precio: body.precio,
        descripcion: body.descripcion,
        stock: body.stock,
        categoria: body.categoria,
        oferta: body.oferta,
        destacado: body.destacado,
        nuevo: body.nuevo,
        descuento: body.descuento,
        activo: body.activo,

    });

    producto.save((err, productoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear producto',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoGuardado,
        });

    });
});

//===================================
// Obtener todos los producto OK
//==================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .skip(desde)
        // .limit(5)
        .populate('categoria', 'nombre')
        .exec(
            (err, productos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Obteniendo producto',
                        errors: err
                    });
                }

                Producto.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        productos: productos,
                        total: conteo
                    });
                })

            }
        );
});
//===================================
// Obtener un producto 
//==================================
app.get('/:id', (req, res, next) => {

    var id = req.params.id;
    // var desde = req.query.desde || 0;
    // desde = Number(desde);
    console.log(id);
    Producto.findById(id)
        .populate('categoria', 'nombre')
        .exec(
            (err, producto) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Obteniendo producto',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    producto: producto
                });

            }
        );
});

//===================================
// Actualizar producto OK
//==================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Producto.findById(id, (err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar producto',
                errors: err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto con el id ' + id + ' no existe',
                errors: { message: 'No existe producto' }
            });
        }

        producto.nombre = body.nombre;
        producto.precio = body.precio;
        producto.descripcion = body.descripcion;
        producto.stock = body.stock;
        producto.categoria = body.categoria;
        producto.oferta = body.oferta;
        producto.destacado = body.destacado;
        producto.nuevo = body.nuevo;
        producto.descuento = body.descuento;
        producto.activo = body.activo;

        producto.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar producto',
                    errors: err
                });
            }
            producto.password = ':)'
            res.status(200).json({
                ok: true,
                producto: productoGuardado
            });
        })
    });
});


//===================================
// Eliminar producto OK
//==================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar producto',
                errors: err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto con el id ' + id + ' no existe',
                errors: { message: 'No existe producto a eliminar' }
            });
        }

        res.status(200).json({
            ok: true,
            producto: productoBorrado
        });
    })
});

module.exports = app;