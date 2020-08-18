const express = require('express'); //MODULOS HTPP
const morgan = require('morgan');
const exphbs = require('express-handlebars'); //Plantila para render vistas
const path = require('path');
const socketIo = require("socket.io"); //Llamando desde la biblioteca websockets
const http = require("http"); //modulos de http
const passport = require('passport');
const flash = require("connect-flash"); //Modulos para los mensajes
const session = require("express-session");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');


//Inicializando
const app = express();
require('./database');
require('./config/passport');
const server = http.createServer(app); //Se llaman los modulos del servidor requerido
const io = socketIo.listen(server); //Usamos el objeto websockets para que se inicie en el server
//require('./lib/passport');

//Password y correo


//Arduino
//Websockets actualizando

//ARDUINO SERIAL PORT
// io.on('connection', function (socket) {
//     console.log('Nuevo socket conectado');
// });

// const Serialport = require('serialport');
// const {
//     text
// } = require('express');
// const Readline = Serialport.parsers.Readline;

// const port = new Serialport('COM3', {
//     baudRate: 9600
// });

// port.on('open', function () {
//     console.log('Puerto serial conectado');
// });

// port.on('data', function (data) {
//     //console.log(data.toString());
//     io.emit('arduino:data', {
//         value: data.toString()
//     });
// });

// port.on('err', function (err) {
//     console.log(err.message);
// });

//SENSOR
// const parser = port.pipe(new Readline({
//     delimeter: '\r\n'
// }));

// parser.on('open', function () {
//     console.log('connection is opened');
// });

// parser.on('data', function (data) {
//     console.log(data);
//     io.emit('Alcohol', data);
// });

// parser.on('error', function (err) {
//     console.log(err);
// });

//Config
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    //helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Peticiones Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json()); //Recivir datos de tipo json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
    //store: new MongoStore({
    //mongooseConnection: mongoose.connection
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// app.use(express.urlencoded({ extended: false }));

//Variables Globales Autenticar
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});



//Routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/crud'));
//app.use('/Cruds', require('./routes/crud'));
//app.use(require('./routes/crud'));
//app.use(require('./views'))


//Public files
app.use(express.static(path.join(__dirname, 'public')));

//Iniciando Servidor
//  app.listen(app.get('port'), () => {
//      console.log('Servidor Conectado', app.get('port'));
//  });

server.listen(4000, () => {
    console.log("Conexion en el puerto", 4000); //server ejecutando.
});