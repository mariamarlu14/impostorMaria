var fs = require("fs");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require("body-parser");
var io = require('socket.io').listen(server);
var modelo=require("./servidor/modelo.js");
var wss=require("./servidor/servidorWS.js");
app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var servidorWS=new wss.ServidorWS();

var juego=new modelo.Juego();

app.get('/', function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html"); 
    
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
    
});

app.get('/nuevoUsuario/:nick', function(request,response){
	var nick=request.params.nick;
	var usr=new modelo.Usuario(nick);

});

app.get('/crearPartida/:nick/:numero', function(request,response){
	var nick=request.params.nick;
	var usr=new modelo.Usuario(nick);
	var num=parseInt(request.params.numero);
	var codigo=juego.crearPartida(num,nick);

	response.send({"codigo":codigo});

});

app.get('/unirAPartida/:nick/:codigo', function(request,response){
	var nick=request.params.nick;
	var codigo=request.params.codigo;
	var res=juego.unirAPartida(codigo,nick);
	response.send({"res":res});
});

app.get("/listaPartidas",function(request,response){
	var lista= juego.listaPartidas();
	response.send(lista);
});

app.get('/iniciarPartida/:nick/:codigo', function(request,response){
	var nick=request.params.nick;
	var codigo=request.params.codigo;
	var res=juego.iniciarPartida(codigo,nick);
	response.send({"res":res});
});

server.listen(app.get('port'), function () {
    console.log('Node esta escuchando en el puerto', app.get('port'));
});

// app.listen(app.get('port'), function () {
//      console.log('Node app is running on port', app.get('port'));
// });

servidorWS.lanzarSocketSrv(io,juego);

