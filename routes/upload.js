var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();
app.use(fileUpload());


var Producto = require('../models/producto');
var Categoria = require('../models/categoria');

// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['productos', 'categorias'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no valida',
            errors: { message: 'tipo de coleccion no valida' }
        });
    }

    //Validar que viene archivo
    if (!req.files) {
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
    console.log(path);
    archivo.mv(path, err => {
        if (err) {
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
                productoActualizado.password = ':)'
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada correctamente',
                    producto: productoActualizado
                })
            })
        });
    }

    if (tipo === 'categorias') {

        Categoria.findById(id, (err, categoria) => {

            if (err) {
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