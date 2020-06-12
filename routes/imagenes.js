var express = require('express');
var windston = require('winston');
var app = express();
const path = require('path');
const fs = require('fs');
// var winston = require('winston');

//Winston logger
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     defaultMeta: { service: 'user-service' },
//     transports: [
//         //
//         // - Write to all logs with level `info` and below to `combined.log` 
//         // - Write all logs error (and below) to `error.log`.
//         //
//         new winston.transports.File({ filename: 'error.log', level: 'error' }),
//         new winston.transports.File({ filename: 'combined.log' })
//     ]
// });
// Rutas
app.get('/:tipo/:img', (req, res, next) => {



    var tipo = req.params.tipo;
    var img = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    console.log(pathImagen);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {

        var pathNoimage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoimage);
    }

});

module.exports = app;