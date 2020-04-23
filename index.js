const http = require('http');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const app = express();

const items_router = require('./routes/items');
const api_items_router = require('./routes/api');

// nginx used as reversed proxy
app.set('trust proxy', 'loopback')
app.use(morgan('combined'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', items_router)
app.use('/api', api_items_router)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

app.use((err, req, res, next) => {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render("error")
})

let port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

let server = http.createServer(app)
server.listen(port)
server.on('listening', onListening)
server.on('error', onError)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

/**
 * Event listener for HTTP server "listening" event.
 */

 function onListening() {
    let addr = server.address()
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
    console.log('Listening on ' + bind)
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        case 'ECONNRESET':
            console.error(error)
            break
        default:
            throw error;
    }
}

module.exports = app
