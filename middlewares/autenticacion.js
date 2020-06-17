var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//===================================
// Varificar Token middleware
//==================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token invalido',
                errors: err
            });
        }
        // req.usuario = decoded.usuario;
        next();
        // res.status(200).json({
        //     ok: false,
        //     decoded: decoded
        // });

    });
}