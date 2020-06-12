var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');
var logger = require('../utils/logger');


//---------------------------------------------------
//Login normal
//---------------------------------------------------

app.post('/', (req, res) => {
    var body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            logger.error('Error Usuario.findOne', { route: `/login`, method: 'POST', object: body.email, error: err });
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!usuarioBD) {
            logger.info('Credenciales incorrectas - email', { route: `/login`, method: 'POST', object: body.email });
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            logger.info('Credenciales incorrectas - Password', { route: `/login`, method: 'POST', object: body.email });
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        //Crear Token por que el usuario es valido.
        usuarioBD.password = ':)'
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 })
        logger.info('Login', { route: `/login`, method: 'POST', object: body.email });
        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            id: usuarioBD._id,
            token: token
        });
    })

});

module.exports = app;