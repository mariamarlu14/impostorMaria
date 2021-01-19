var modelo=require("./modelo.js");

describe("El juego del impostor", function() {
  var juego;
 // var usr;
  var nick;
  beforeEach(function() {
  	juego=new Juego();
  //	usr=new Usuario("Pepe",juego);
  //	juego=new modelo.Juego();
  //	usr=new modelo.Usuario("Pepe");
  nick="Pepe";
  });


  it("comprobar valores iniciales del juego", function() {
  	expect(Object.keys(juego.partidas).length).toEqual(0);
  	expect(nick).toEqual("Pepe");
  	//expect(usr.juego).not.toBe(undefined);
  });

  it("comprobar valores de la partida",function(){
  	var codigo=juego.crearPartida(3,nick);
  	expect(codigo).toBe("fallo");
  	codigo=juego.crearPartida(11,nick);
  	expect(codigo).toBe("fallo");
  });

  describe("el usr Pepe crea una partida de 4 jugadores",function(){
	var codigo;
	beforeEach(function() {
	  	codigo=usr.crearPartida(4,nick);
	  });

	it("se comprueba la partida",function(){ 	
	  	expect(codigo).not.toBe(undefined);
	  	expect(juego.partidas[codigo].nickOwner).toEqual(nick);
	  	expect(juego.partidas[codigo].maximo).toEqual(4);
	  	expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
	 	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(1);
	  });
	it("no se puede crear partida si el num no está entre 4 y 10", function(){
		var codigo=juego.crearPArtida(3,nick);
		expect(codigo).toEqual("fallo");
		codigo=juego.crearPartida(11,nick);
		expect(codigo).toEqual("fallo");
	});

	it("varios usuarios se unen a la partida",function(){
		juego.unirAPartida(codigo,"ana");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"isa");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"tomas");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
	  });

	it("Pepe inicia la partida",function(){
		juego.unirAPartida(codigo,"ana");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"isa");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"tomas");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		//usr.iniciarPartida();
		juego.iniciarPartida(nick,codigo);
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
	});
	it("abandonar partida",function(){
		juego.unirAPartida(codigo,"ana");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"isa");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"tomas");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		//usr.iniciarPartida();
		//expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
		var partida=juego.partidas[codigo];
		partida.usuarios["tomas"].abandonarPartida();
		partida.usuarios["isa"].abandonarPartida();
		partida.usuarios["ana"].abandonarPartida();
		partida.usuarios["Pepe"].abandonarPartida();
		expect(partida.numeroJugadores()).toEqual(0);
		//juego.eliminarPartida(codigo);
		expect(juego.partidas[codigo]).toBe(undefined);		



  	})
   });


})
