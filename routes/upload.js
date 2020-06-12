var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();
app.use(fileUpload());


var Producto = require('../models/producto');
var Categoria = require('../models/categoria');
var logger = require('../utils/logger');

// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['productos', 'categorias'];

    if (tiposValidos.indexOf(tipo) < 0) {
        logger.info('Tipo invalida', { route: `/upload/${tipo}/${id}`, method: 'PUT', object: tipo, error: null });
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no valida',
            errors: { message: 'tipo de coleccion no valida' }
        });
    }

    //Validar que viene archivo
    if (!req.files) {
        logger.info('Imagen Vacia', { route: `/upload/${tipo}/${id}`, method: 'PUT', object: req.files, error: null });
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono archivo de imagen',
            errors: { message: 'Debe seleccionar un archivo' }
        });
    }

    //obtener nombre del archivo
    var archivo = req.files.imagen;
    //cortar el archivo por puntos
    var nombreCortado = archivo.name.split('.');
    //obtener extension desde la ulitma posicion
    var extensionArchivo = nombreCortado[nombreCortado.length - 1]

    //Filtrar extensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'svg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        logger.info('Extension invalida', { route: `/upload/${tipo}/${id}`, method: 'PUT', object: archivo.name, error: null });
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extension validas son ' + extensionesValidas.join(', ') }
        });
    }

    //crear nombre archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover Archivo desde temporal o un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    // console.log(path);
    archivo.mv(path, err => {
        if (err) {
            logger.error('Error al mover archivo', { route: `/upload/${tipo}/${id}`, method: 'PUT', object: { nombreArchivo, path }, error: errasfea });
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res, path);
    });

});

function subirPorTipo(tipo, id, nombreArchivo, res, path) {

    if (tipo === 'productos') {
        Producto.findById(id, (err, producto) => {
            if (err) {
                logger.error('Producto.findById', { route: `/upload/${tipo}/${id}`, method: 'PUT', object: { id, nombreArchivo, path }, error: err });
                fs.unlinkSync(path);
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error producto no existe',
                    errors: err
                });
            }
            var pathViejo = './uploads/productos/' + producto.img;
            //si existe una imagen la elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo)
            }

            producto.img = nombreArchivo;
            producto.save((err, productoActualizado) => {
                if (err) {
                    logger.error('Producto.save', { route: `/upload/${tipo}/${id}`, method: 'PUT', object: { id, nombreArchivo, path }, error: err });
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al guardar producto',
                        errors: err
                    });
                }

                productoActualizado.password = ':)'
                logger.info('Imagen actualizada', { route: `/upload/${tipo}/${id}`, method: 'PUT', object: { id, nombreArchivo, path } });
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada correctamente',
                    producto: productoActualizado
                });
            });
        });
    }

    if (tipo === 'categorias') {

        Categoria.findById(id, (err, categoria) => {

            if (err) {
                logger.error('Categoria.findById', { route: `/upload/${tipo}/${id}`, method: 'PUT', object: { id, nombreArchivo, path }, error: err });
                fs.unlinkSync(path);
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error categoria no existe',
                    errors: err
                });
            }
            var pathViejo = './uploads/categorias/' + categoria.img;

            //si existe una imagen la elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo)
            }

            categoria.img = nombreArchivo;
            categoria.save((err, categoriaActualizado) => {
                if (err) {
                    logger.error('Categoria.save', { route: `/upload/${tipo}/${id}`, method: 'PUT', object: { id, nombreArchivo, path }, error: err });
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al guardar categoria',
                        errors: err
                    });
                }

                logger.info('Imagen actualizada', { route: `/upload/${tipo}/${id}`, method: 'PUT', object: { id, nombreArchivo, path } });
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada correctamente',
                    categoria: categoriaActualizado
                })
            })
        });
    }
}

module.exports = app;