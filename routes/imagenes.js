var express = require('express');
var windston = require('winston');
var app = express();
const path = require('path');
const fs = require('fs');

// Rutas
app.get('/:tipo/:img', (req, res, next) => {



    var tipo = req.params.tipo;
    var img = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    // console.log(pathImagen);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {

        var pathNoimage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoimage);
    }

});

module.exports = app;