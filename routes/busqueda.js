var express = require('express');
var app = express();
var Producto = require('../models/producto');
var Categoria = require('../models/categoria');
var logger = require('../utils/logger');



//-----------------------------------------------
//busqueda en tabla especifica
//-----------------------------------------------
app.get('/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    //Expresion regular para buscar en tabla, ademas la i es para case sentitive
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'productos':
            promesa = buscarProductos(busqueda, regex)
            break;
        case 'categorias':
            promesa = buscarCategorias(busqueda, regex)
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'tabla incorrecta',
                error: { message: 'tabla no valida' }
            });
    }

    //
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data //[] las llaves para que variable de objeto conmutada , para que tome el valor no la palabra
        });
    }).catch(err => {
        res.status(400).json({
            ok: false,
            mensaje: 'Error al buscar',
            error: err
        });
        logger.error('Error al buscar', { route: `/busqueda/${tabla}/${busqueda}`, method: 'GET', object: null, error: err });
    });
});


function buscarProductos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Producto.find({})
            .populate('categoria', 'nombre')
            .or([
                { nombre: regex },
                { descripcion: regex },
                // { categoria: regex },
            ])
            .exec((err, productos) => {
                if (err) {
                    logger.error('buscarProductos', { route: `/busqueda/${tabla}/${busqueda}`, method: 'GET', object: null, error: err });
                    reject('Error al buscar en productos' + err, err);
                } else {
                    resolve(productos);
                }
            });
    });
}

function buscarCategorias(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Categoria.find({})
            .or([
                { nombre: regex }
            ])
            .exec((err, categorias) => {
                if (err) {
                    logger.error('buscarCategorias', { route: `/busqueda/${tabla}/${busqueda}`, method: 'GET', object: null, error: err });
                    reject('Error al buscar en categorias', err);
                } else {
                    resolve(categorias);
                }
            });
    });
}


module.exports = app;