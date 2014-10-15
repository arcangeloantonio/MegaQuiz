var screenWidth;
var screenHeight;
var canvas;
var context;

var menu = {};
var roleta = {};
var pergunta = {};

var TELAS = {
	MENU: 0,
	ROLETA: 1,
	PERGUNTA: 2
};

var menuPos = 0;
var tela = 0;

function desenharFonteCentro(contexto, texto, y, tamanhoFonte, cor) {					
	context.font= tamanhoFonte + "px Georgia";
	context.fillStyle = cor;
	context.fillText(texto, screenWidth/2 - context.measureText(texto).width/2, y);	
}

function Menu() {
	this.frames = 0;
	this.Desenhar = function() {
		this.frames++;
		LimparCanvas();
		context.fillStyle = "#000000";
		context.fillRect(0, 0, screenWidth, screenHeight);

		var corTitulo = '';
		if (this.frames > 0 && this.frames < 60) {
			corTitulo = "#FFFFFF";
		}
		else {
			corTitulo = "#FF0000";
			if (this.frames > 120) this.frames = 0;
		}
		
		desenharFonteCentro(context, "MegaQuiz!", 100, 100, corTitulo);
		desenharFonteCentro(context, "Jogar", 220, 50, menuPos == 0 ? "#FF0000" : "#FFFFFF");
		desenharFonteCentro(context, "Configurações", 320, 50, menuPos == 1 ? "#FF0000" : "#FFFFFF");
		desenharFonteCentro(context, "Ajuda", 420, 50, menuPos == 2 ? "#FF0000" : "#FFFFFF");
		desenharFonteCentro(context, "Créditos", 520, 50, menuPos == 3 ? "#FF0000" : "#FFFFFF");
	}
}

function Roleta() {
	this.cores = ["#B8D430", "#3AB745", "#029990", "#3501CB", "#2E2C75", "#673A7E", "#CC0071"];
	this.materias = ["Geografia", "Historia", "Matematica", "Portugues", "Biologia", "Fisica", "Química"];
	this.materiaSelecionada = "";
	this.anguloInicio = 0;
	this.anguloGiroInicio = 0;
	this.arco = Math.PI / 3.5;
	this.acabarTempoGiro = null;
	
	this.girando = false;
	
	this.giroArcoComeco = 10;
	this.tempoGiro = 0;
	this.tempoGiroTotal = 0;
	
	this.raioFora = 280;
	this.raioTexto = 250;
	this.raioDentro = 0;
	
	this.Desenhar = function() {      
		LimparCanvas();
      
		context.strokeStyle = "#000000";
		context.lineWidth = 2;
		context.font = 'bold 12px sans-serif';
      
		for(var i = 0; i < 7; i++) {
			var angulo = this.anguloInicio + i * this.arco;
			context.fillStyle = this.cores[i];
        
			context.beginPath();
			context.arc(400, 300, this.raioFora, angulo, angulo + this.arco, false);
			context.arc(400, 300, this.raioDentro, angulo + this.arco, angulo, true);
			context.stroke();
			context.fill();
        
			context.save();
			context.fillStyle = "#FFFFFF";
			context.font = '20px sans-serif';
			context.translate(400 + Math.cos(angulo + this.arco / 2) * this.raioTexto, 300 + Math.sin(angulo + this.arco / 2) * this.raioTexto);
			context.rotate(angulo + this.arco / 2 + Math.PI / 2);
			var text = this.materias[i];
			context.fillText(text, -context.measureText(text).width / 2, 0);
			context.restore();
		} 
		this.DesenharSeta();
	}
	
	this.DesenharSeta = function() {
		context.fillStyle = "#FF0000";
		context.beginPath();
		context.moveTo(400 - 14, 300 - (this.raioFora + 15));
		context.lineTo(400 + 14, 300 - (this.raioFora + 15));
		context.lineTo(400 + 14, 300 - (this.raioFora - 15));
		context.lineTo(400 + 19, 300 - (this.raioFora - 15));
		context.lineTo(400 - 0, 300 - (this.raioFora - 33));
		context.lineTo(400 - 19, 300 - (this.raioFora - 15));
		context.lineTo(400 - 14, 300 - (this.raioFora - 15));
		context.lineTo(400 - 14, 300 - (this.raioFora + 25));
		context.fill();
	}
	
	this.Girar = function()  {
		this.anguloGiroInicio = Math.random() * 10 + 10;
		this.tempoGiroTotal = Math.random() * 3 + 4 * 1000;
		this.GirarRoleta();
	}
  
	this.GirarRoleta = function() {
		this.tempoGiro += 10;
		if(this.tempoGiro >= this.tempoGiroTotal) {
			this.PararDeGirarRoleta();
			return;
		}
		var anguloGiro = this.anguloGiroInicio - this.Transicao(this.tempoGiro, 0, this.anguloGiroInicio, this.tempoGiroTotal);
		this.anguloInicio += (anguloGiro * Math.PI / 180);
		this.Desenhar();
		spinTimeout = setTimeout('roleta.GirarRoleta()', 5);
	}
  
	this.PararDeGirarRoleta = function() {
		var graus = this.anguloInicio * 180 / Math.PI + 90;
		var arcd = this.arco * 180 / Math.PI;
		var index = Math.floor((360 - graus % 360) / arcd);
		setInterval(function() { tela = TELAS.PERGUNTA}, 500);
	    this.materiaSelecionada = this.materias[index];
	}
  
	this.Transicao = function(t, b, c, d) {
		var ts = (t/=d)*t;
		var tc = ts*t;
		return b+c*(tc + -3*ts + 3*t);
	}
}

function Pergunta() {
	this.DesenharHUD = function() {
		LimparCanvas();
		context.fillStyle = "#000000";
		context.fillRect(0, 0, screenWidth, screenHeight);
		this.DesenharCabecalho(roleta.materiaSelecionada);
		this.DesenharPergunta(this.LETRAPERGUNTA.A, 'Resposta A');
		this.DesenharPergunta(this.LETRAPERGUNTA.B, 'Resposta B');
		this.DesenharPergunta(this.LETRAPERGUNTA.C, 'Resposta C');
		this.DesenharPergunta(this.LETRAPERGUNTA.D, 'Resposta D');
	}
	
	this.DesenharCabecalho = function(materia) {
		context.fillStyle = "#FF0000";
		context.fillRect(50, 50, screenWidth - 100, 200);
		context.fillStyle = "#FFFFFF";
		context.font="30px Georgia";
		context.fillText(materia, 60, 90);
	}
	
	this.quadradoInicioX = 50;
	this.quadradoAltura = 50;
	this.quadradoLargura = screenWidth - 100;
	this.distanciaFonteQuadrado = -30
	
	this.LETRAPERGUNTA = {
		A: { texto: 'A', altura: 305 },
		B: { texto: 'B', altura: 380 },
		C: { texto: 'C', altura: 455 },
		D: { texto: 'D', altura: 530 },
	}
	
	this.DesenharPergunta = function(letraPergunta, texto) {
		context.fillStyle = "#FF0000";
		context.fillRect(this.quadradoInicioX, letraPergunta.altura+this.distanciaFonteQuadrado, this.quadradoLargura, this.quadradoAltura);
		
		context.fillStyle = "#FFFFFF";
		context.font="20px Georgia";
		context.fillText(texto, 60, letraPergunta.altura);
	}
}

function LimparCanvas() {
	context.clearRect(0, 0, screenWidth, screenHeight);
}

function AoCarregar() {
	if (document.location.hash === "#editarPerguntas") {
			$('#telaDeFundo').hide();
			$('#editarPerguntas').show();
			CarregarFormularioPerguntas();
	}
	else {
		CarregarJogo();
	}
}

function CarregarFormularioPerguntas() {
	//$('#ddlCategorias').append
	//console.log(categorias);
	var html = '<option value="0">Selecione...</option>';
	$.each(categorias, function( key, obj) {
		
		html += '<option value="' + obj.id + '">' + obj.categoria + '</option>';
	});
	$('#ddlCategorias').append(html);
	
	$('.lnPergunta').on('live', function() {	
		$('.lnPergunta.selecionado').removeClass('selecionado');
		$(this).addClass('selecionado');
	});
	
	
	$('#ddlCategorias').on('change', function() {
		var categoriaId = $(this).val();
		var listaPerguntas = '';
		$('#groupPerguntas').empty();
		$.each(perguntas, function( key, obj) {
			if (obj.categoria.id == categoriaId) {
				listaPerguntas += '<li  class="lnPergunta" data-categoriaId="obj.id">' + obj.questao + '</li>';
			}
		});
		$('#groupPerguntas').append(listaPerguntas);
	});
	
}

function CarregarJogo() {	
	window.addEventListener('load', function() {document.body.requestFullscreen();}, false);
	window.addEventListener('resize', redimensionar, false);
	window.addEventListener('orientationchange', redimensionar, false);
	
	
	canvas = document.getElementById('telaDeFundo');
	redimensionar();
	document.addEventListener("keydown", KeyPress);
	canvas.addEventListener("touchstart", Tocou, false);
	//canvas.addEventListener("click", Tocou, false);
	context = canvas.getContext('2d');

	screenWidth = canvas.width;
	screenHeight = canvas.height;
	
	menu = new Menu();
	roleta = new Roleta();
	pergunta = new Pergunta();
	
	tela = TELAS.MENU;
	setInterval(AtualizarDesenhar, 1000/60);
}

function redimensionar() {
	var alturaNavegador = window.innerHeight;
	var razao = canvas.width/canvas.height;
	var larguraNavegador = alturaNavegador * razao;
	canvas.style.width = larguraNavegador+'px';
	canvas.style.height = alturaNavegador+'px';
}

function AtualizarDesenhar() {
	switch (tela) {
		case TELAS.MENU: 
			menu.Desenhar();
			break;
		case TELAS.ROLETA:
			roleta.Desenhar();
			break;
		case TELAS.PERGUNTA:
			pergunta.DesenharHUD();
			break;
	}
}

function KeyPress(evento) {
	switch (evento.keyCode) {
		case 13: //enter
			switch (tela) {
				case TELAS.MENU:
					tela = TELAS.ROLETA;
					break;
				case TELAS.ROLETA:
					GirarRoleta();
					break;
			}
		break;
		case 40: //baixo
		switch (tela) {
				case TELAS.MENU:
					menuPos++;
					if (menuPos > 3) menuPos = 0;
				break;
		}
		break;
		case 38:
		switch (tela) {
				case TELAS.MENU:
					menuPos--;
					if (menuPos < 0) menuPos = 3;
				break;
		}
	}
}

function Tocou(evento) {
	// if (evento.type == 'click') {
	
	
	
	
		switch (tela) {
			case TELAS.MENU:
				tela = TELAS.ROLETA;
				break;
			case TELAS.ROLETA:
				GirarRoleta();
				break;
			case TELAS.PERGUNTA:
				VerificaResposta(evento.clientX, evento.clientY);
				break;
		}
		
		
		
		
	// }
	// else if (evento.type == 'touch' && evento.targetTouches.length == 1) {
		
		// GirarRoleta();
	// }
}

function VerificaResposta(x, y) {	
	var rect = canvas.getBoundingClientRect();
	x = (x - rect.left) * (canvas.width/parseInt(canvas.style.width));
	y = (y - rect.top) * (canvas.height/parseInt(canvas.style.height));
	for (var p in pergunta.LETRAPERGUNTA) {
		var perguntaDaVez = pergunta.LETRAPERGUNTA[p];
		if (x >= pergunta.quadradoInicioX && x <= pergunta.quadradoLargura+pergunta.quadradoInicioX && y >= perguntaDaVez.altura+pergunta.distanciaFonteQuadrado && y <= pergunta.quadradoAltura+perguntaDaVez.altura+pergunta.distanciaFonteQuadrado) {
			alert(p);
		}
	}
}

function GirarRoleta() {
	roleta.Girar(); //TODO VERIFICAR SE A ROLETA JA ESTA GIRANDO
}