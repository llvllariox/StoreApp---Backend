const winston = require('winston')
const { format, transports } = winston
const path = require('path')

const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)

module.exports = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.splat(),
        // Format the metadata object
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                logFormat
            )
        }),
        new transports.File({
            filename: 'logs/combined.log',
            format: format.combine(
                // Render in one line in your log file.
                // If you use prettyPrint() here it will be really
                // difficult to exploit your logs files afterwards.
                format.json()
            )
        })
    ],
    exitOnError: false
})



// const { createLogger, format, transports } = require('winston');
// module.exports = createLogger({
//     format: format.combine(
//         format.simple(),
//         format.timestamp(),
//         // format.colorize(true),
//         format.printf(info => [`[${info.timestamp}] - ${info.level} - ${info.message}`])
//     ),
//     transports: [
//         new transports.File({
//             maxsize: 5120000,
//             maxFiles: 5,
//             filename: `${__dirname}/../logs/log-api.log`,
//         }),
//         new transports.Console({
//             level: 'debug',
//             format: format.combine(
//                 format.simple(),
//                 format.timestamp(),
//                 format.colorize(true),
//                 format.printf(info => [`[${info.timestamp}] - ${info.level} - ${info.message}`])
//             ),
//         })
//     ],



// });