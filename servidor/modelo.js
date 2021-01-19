function Juego(){
	this.partidas={};
	this.crearPartida=function(num,owner){
		let codigo="fallo";
		if (!this.partidas[codigo] && this.numeroValido(num)){
			codigo=this.obtenerCodigo();
			this.partidas[codigo]=new Partida(num,owner.nick,codigo,this);
			owner.partida=this.partidas[codigo];
		}
		else{
			console.log(codigo);
		}
		return codigo;
	}
	this.unirAPartida=function(codigo,nick){
		var res=-1;
		if (this.partidas[codigo]){
			res=this.partidas[codigo].agregarUsuario(nick);
		}
		return res;
	}
	this.numeroValido=function(num){
		return (num>=4 && num<=10)
	}
	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
		let letras=cadena.split('');
		let maxCadena=cadena.length;
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,maxCadena)-1]);
		}
		return codigo.join('');
	}
	this.eliminarPartida=function(codigo){
		delete this.partidas[codigo];
	}
	this.listaPartidasDisponibles=function(){
		var lista=[];
		var huecos=0;
		for(var key in this.partidas){
			var partida=this.partidas[key];
			huecos=partida.obtenerHuecos();
			if(huecos>0 && !(partida.fase.nombre=="jugando")){

		     lista.push({"codigo":key,"huecos":huecos})
			}
		}
		return lista;
	}
	this.listaPArtida=function(){
		var lista=[];
		for(var key in this.partidas){
			var partida=this.partidas[key];
			var owner=partida.nickOwner;
			lista.push({"codigo":key, "owner":owner});
		}
		return lista;
	}
	this.iniciarPartida=function(nick,codigo){(
			var owner=this.partidas[codigo].nickOwner;
			if(nick==owner){
				this.partidas[codigo].iniciarPartida();
		}
	}
}


function Partida(num,owner,codigo,juego){
	this.maximo=num;
	this.nickOwner=owner;
	this.codigo=codigo;
	this.fase=new Inicial();
	this.usuarios={};
	this.juego=juego;
	this.encargos=["jardines","mobiliario","basuras","calles"];
	this.agregarUsuario=function(nick){
		return this.fase.agregarUsuario(nick,this)
	}
	this.puedeAgregarUsuario=function(nick){
		let nuevo=nick;
		let contador=1;
		while(this.usuarios[nuevo]){
			nuevo=nick+contador;
			contador=contador+1;
		}
		this.usuarios[nuevo]=new Usuario(nuevo);
		this.usuarios[nuevo].partida=this;
		//this.comprobarMinimo();
		return 0;
	}
	this.obtenerHuecos=function(){
		return this.maximo-this.numeroJugadores();
	}
	this.numeroJugadores=function(){
		return Object.keys(this.usuarios).length;
	}
	this.comprobarMinimo=function(){
		return this.numeroJugadores()>=4
	}
	this.comprobarMaximo=function(){
		return this.numeroJugadores()<this.maximo;
	}
	this.iniciarPartida=function(){
		this.fase.iniciarPartida(this);
	}
	this.puedeIniciarPartida=function(){
		this.asignarEncargos();
		this.asignarImpostor();
		this.fase=new Jugando();
	}
	this.abandonarPartida=function(nick){
		this.fase.abandonarPartida(nick,this);
	}
	this.puedeAbandonarPartida=function(nick){
		this.eliminarUsuario(nick);
		if (!this.comprobarMinimo()){
			(this.fase=new Inicial();
		}
		if(this.numeroJugadores()<=0){
			this.juego.eliminarPartida(this.codigo);
		}
	}
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}
	this.asignarEncargos=function(){
		let ind=0;
		for (var key in this.usuarios) {
		    this.usuarios[key].encargo=this.encargos[ind];
		    ind=(ind+1)%(this.encargos.length)
		}
	}
	this.asignarImpostor=function(){
		let listaNicks=Object.keys(this.usuarios);
		let ind=randomInt(0,listaNicks.length-1);
		let nick=listaNicks[ind];
		this.usuarios[nick].impostor=true;
	}
	this.atacar=function(inocente){
		this.fase.atacar(inocente,this);
	}
	this.puedeAtacar=function(inocente){
		this.usuarios[inocente].esAtacado();
		this.comprobarFinal();
	}
	this.numeroImpostoresVivos=function(){
		let cont=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].impostor && this.usuarios[key].estado.nombre=="vivo"){
				cont++;
			}
		}
		return cont;
	}
	this.numeroCiudadanosVivos=function(){
		let cont=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].estado.nombre=="vivo" && !this.usuarios[key].impostor){
				cont++;
			}
		}
		return cont;
	}
	this.gananImpostores=function(){
		return (this.numeroImpostoresVivos()>=this.numeroCiudadanosVivos());
	}
	this.gananCiudadanos=function(){
		return (this.numeroImpostoresVivos()==0);
	}
	this.votar=function(sospechoso){
		this.fase.votar(sospechoso)
	}
	this.puedeVotar=function(sospechoso){
		this.usuarios[sospechoso].esVotado();
	}
	this.masVotado=function(){
		let votado=undefined;
		let max=0;
		for (var key in this.usuarios) {
			if (max<this.usuarios[key].votos){
				max=this.usuarios[key].votos;
				votado=this.usuarios[key];
			}
		}
		return votado;
	}
	this.numeroSkips=function(){
		let cont=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].estado.nombre=="vivo" && this.usuarios[key].skip){
				cont++;
			}
		}
		return cont;
	}
	this.comprobarVotacion=function(){
		let elegido=this.masVotado();
		if (elegido && elegido.votos>this.numeroSkips()){
			elegido.esAtacado();
		}
	}
	this.comprobarFinal=function(){
		if (this.gananImpostores()){
			this.finPartida();
		}
		else if (this.gananCiudadanos()){
			this.finPartida();
		}
	}
	this.finPartida=function(){
		this.fase=new Final();
	}
	this.lanzarVotacion=function(){
		this.fase.lanzarVotacion(this);
	}
	this.puedeLanzarVotacion=function(){
		this.fase=new Votacion();
	}
	this.agregarUsuario(owner);
}

function Inicial(){
	this.nombre="inicial";
	this.agregarUsuario=function(nick,partida){
		partida.puedeAgregarUsuario(nick);
		if (partida.comprobarMinimo()){
			partida.fase=new Completado();
		}		
	}
	this.iniciarPartida=function(partida){
		console.log("Faltan jugadores");
	}
	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
		//partida.eliminarUsuario(nick);
		//comprobar si no quedan usr
	}
	this.atacar=function(inocente){}
	this.lanzarVotacion=function(){}
}

function Completado(){
	this.nombre="completado";
	this.iniciarPartida=function(partida){
		partida.puedeIniciarPartida();
		//partida.fase=new Jugando();
		//asignar encargos: secuencialmente a todos los usr
		//asignar impostor: dado el array usuario (Object.keys)
	}
	this.agregarUsuario=function(nick,partida){
		if (partida.comprobarMaximo()){
			partida.puedeAgregarUsuario(nick);
		}
		else{
			console.log("Lo siento, numero máximo")
		}
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (!partida.comprobarMinimo()){
			partida.fase=new Inicial();
		}
	}
	this.atacar=function(inocente){}
	this.lanzarVotacion=function(){}
}

function Jugando(){
	this.nombre="jugando";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ya ha comenzado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		//comprobar si termina la partida
	}
	this.atacar=function(inocente,partida){
		partida.puedeAtacar(inocente);
	}
	this.lanzarVotacion=function(partida){
		partida.puedeLanzarVotacion();
	}
}

function Votacion(){
	this.final="votacion";
	this.agregarUsuario=function(nick,partida){}
	this.iniciarPartida=function(partida){}
	this.abandonarPartida=function(nick,partida){}
	this.atacar=function(inocente){}
	this.lanzarVotacion=function(){}
}

function Final(){
	this.final="final";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ha terminado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		//esto es absurdo (salvo para Javier)
	}
	this.atacar=function(inocente){}
	this.lanzarVotacion=function(){}
}

function Usuario(nick){
	this.nick=nick;
	//this.juego=juego;
	this.partida;
	this.impostor=false;
	this.encargo="ninguno";
	this.estado=new Vivo();
	this.votos=0;
	this.skip=false;
	this.haVotado=false;
	this.iniciarPartida=function(){
		this.partida.iniciarPartida();
	}
	this.abandonarPartida=function(){
		this.partida.abandonarPartida(this.nick);
		if (this.partida.numeroJugadores()<=0){
			console.log(this.nick," era el último jugador");
		}
	}
	this.atacar=function(inocente){
		if (this.impostor){
			this.partida.atacar(inocente);
		}
	}
	this.esAtacado=function(){
		this.estado.esAtacado(this);
	}
	this.saltarVoto=function(){
		this.skip=true;
	}
	this.lanzarVotacion=function(){
		this.estado.lanzarVotacion(this);
	}
	this.puedeLanzarVotacion=function(){
		this.partida.lanzarVotacion();
	}
	this.votar=function(sospechoso){
		this.haVotado=true;
		this.partida.votar(sospechoso);
	}
	this.esVotado=function(){
		this.votos++;
	}

}

function Vivo(){
	this.nombre="vivo";
	this.esAtacado=function(usr){
		usr.estado=new Muerto();
	}
	this.lanzarVotacion=function(usr){
		usr.puedeLanzarVotacion();
	}
}

function Muerto(){
	this.nombre="muerto";
	this.esAtacado=function(usr){}
	this.lanzarVotacion=function(usr){}
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

// function inicio(){
// 	juego=new Juego();
// 	var usr=new Usuario("pepe");
// 	var codigo=juego.crearPartida(4,usr);
// 	if (codigo!="fallo"){
// 		juego.unirAPartida(codigo,"luis");
// 		juego.unirAPartida(codigo,"luisa");
// 		juego.unirAPartida(codigo,"luisito");
// 		//juego.unirAPartida(codigo,"pepe2");

// 		usr.iniciarPartida();
// 	}
// }

module.exports.Juego=Juego;
module.exports.Usuario=Usuario; 