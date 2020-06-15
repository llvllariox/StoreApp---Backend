var express = require('express');
var app = express();
const nodemailer = require("nodemailer");
var logger = require('../utils/logger');


// Rutas
app.post('/', (req, res, next) => {

    var body = req.body;
    var nombre = body.nombre;
    var email = body.email;
    var telefono = body.telefono;
    var mensaje = body.mensaje;

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.mail.us-east-1.awsapps.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'contacto@ausa-store.com', // generated ethereal user
                pass: 'Xiaomi@321102A', // generated ethereal password
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
                from: 'contacto@ausa-store.com', // sender address
                to: "contacto@ausa-store.com", // list of receivers
                subject: "Consulta WEB", // Subject line
                // text: mensaje, // plain text body
                html: `<p><b>Nombre: </b> ${nombre}</p>
                       <p><b>Email: </b> ${email}</p>
                       <p><b>Telefono: </b> ${telefono}</p>
                       <p><b>Mensaje: </b> ${mensaje}</p>`, // html body
            })
            .then(
                resp => {
                    logger.info('Envio Email', { route: `/sendEmail`, method: 'POST', object: { nombre, email, telefono, mensaje } });
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Peticion realizada correctamente',
                        resp: resp
                    });
                }

            ).catch(
                err => {
                    logger.error('Envio Email', { route: `/sendEmail`, method: 'POST', object: { nombre, email, telefono, mensaje }, error: err });
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error el enviar email',
                        errors: err
                    });
                }
            )

    }

    main().catch(console.error);
});


module.exports = app;