var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion')

var app = express();
var Categoria = require('../models/categoria');

var limit = 5;

//===================================
// crear nuevo categoria OK
//==================================
app.post('/', (req, res) => {

    var body = req.body;

    var categoria = new Categoria({
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

    categoria.save((err, categoriaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear categoria',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaGuardado,
        });

    });
});

//===================================
// Obtener todos los categoria OK
//==================================
app.get('/', (req, res, next) => {


    var desde = req.query.desde || 0;
    desde = Number(desde);

    Categoria.find({})
        .skip(desde)
        .limit(limit)
        .exec(
            (err, categorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Obteniendo categoria',
                        errors: err
                    });
                }

                Categoria.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        categorias: categorias,
                        total: conteo
                    });
                })

            }
        );
});
//===================================
// Obtener una categoria 
//==================================
app.get('/:id', (req, res, next) => {

    var id = req.params.id;
    // var desde = req.query.desde || 0;
    // desde = Number(desde);
    console.log(id);
    Categoria.findById(id)
        // .populate('categoria', 'nombre')
        .exec(
            (err, categoria) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Obteniendo categoria',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    categoria: categoria,

                });
            }
        );
});
//===================================
// Actualizar categoria OK
//==================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar categoria',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El categoria con el id ' + id + ' no existe',
                errors: { message: 'No existe categoria' }
            });
        }

        categoria.nombre = body.nombre;
        categoria.precio = body.precio;
        categoria.descripcion = body.descripcion;
        categoria.stock = body.stock;
        categoria.categoria = body.categoria;
        categoria.oferta = body.oferta;
        categoria.destacado = body.destacado;
        categoria.nuevo = body.nuevo;
        categoria.descuento = body.descuento;
        categoria.activo = body.activo;

        categoria.save((err, categoriaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoria',
                    errors: err
                });
            }
            categoria.password = ':)'
            res.status(200).json({
                ok: true,
                categoria: categoriaGuardado
            });
        })
    });
});


//===================================
// Eliminar categoria OK
//==================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar categoria',
                errors: err
            });
        }
        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El categoria con el id ' + id + ' no existe',
                errors: { message: 'No existe categoria a eliminar' }
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaBorrado
        });
    })
});

module.exports = app;