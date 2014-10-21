var screenWidth;
var screenHeight;
var canvas;
var context;

var menu = {};
var roleta = {};
var pergunta = {};
var configuracoes = {};
var ajuda = {};
var creditos = {};

var TELAS = {
	MENU: 0,
	ROLETA: 1,
	PERGUNTA: 2,
	CONFIGURACOES: 3,
	AJUDA: 4,
	CREDITOS: 5,
	SENHA: 6
};

var menuPos = 0;
var tela = 0;

var somAcerto;
var somRoleta;
var somErro;
var somLigado;

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
		
		context.font= "30px Georgia";
		context.fillStyle = '#FF0000';
		context.fillText('Editar perguntas', 10, 590);
		
	}
}

function Configuracoes() {
	this.Desenhar = function() {
		menu.Desenhar();
		context.rect(100, 200, 600 , 50);
		context.fillStyle = '#000000';
		context.fill();
		context.lineWidth = 7;
		context.strokeStyle = '#FF0000';
		context.stroke();
		
		
		context.rect(100, 250, 600 , 175);
		context.fillStyle = '#000000';
		context.fill();
		context.lineWidth = 7;
		context.strokeStyle = '#FF0000';
		context.stroke();
		
		
		var textoSom = somLigado ? "LIGADO" : "DESLIGADO";
		desenharFonteCentro(context, "Configurações", 235, 30, '#FF0000');
		desenharFonteCentro(context, "Som < " + textoSom + " >", 300, 30, '#FF0000');
	}
}

function Ajuda() {
	this.Desenhar = function() {
		menu.Desenhar();
		context.rect(100, 200, 600 , 50);
		context.fillStyle = '#000000';
		context.fill();
		context.lineWidth = 7;
		context.strokeStyle = '#FF0000';
		context.stroke();
		
		
		context.rect(100, 250, 600 , 175);
		context.fillStyle = '#000000';
		context.fill();
		context.lineWidth = 7;
		context.strokeStyle = '#FF0000';
		context.stroke();

		desenharFonteCentro(context, "Ajuda", 235, 30, '#FF0000');
		desenharFonteCentro(context, "Teste", 300, 30, '#FF0000');
	}
}

function Senha() {
	this.Texto = '';
	this.Desenhar = function() {
		menu.Desenhar();
		context.rect(100, 200, 600 , 50);
		context.fillStyle = '#000000';
		context.fill();
		context.lineWidth = 7;
		context.strokeStyle = '#FF0000';
		context.stroke();
		
		
		context.rect(100, 250, 600 , 175);
		context.fillStyle = '#000000';
		context.fill();
		context.lineWidth = 7;
		context.strokeStyle = '#FF0000';
		context.stroke();

		desenharFonteCentro(context, "Editar Perguntas", 235, 30, '#FF0000');
		desenharFonteCentro(context, this.Texto, 300, 30, '#FF0000');
	}
}

function Creditos() {
	this.Desenhar = function() {
		menu.Desenhar();
		context.rect(100, 200, 600 , 50);
		context.fillStyle = '#000000';
		context.fill();
		context.lineWidth = 7;
		context.strokeStyle = '#FF0000';
		context.stroke();
		
		
		context.rect(100, 250, 600 , 175);
		context.fillStyle = '#000000';
		context.fill();
		context.lineWidth = 7;
		context.strokeStyle = '#FF0000';
		context.stroke();

		desenharFonteCentro(context, "Créditos", 235, 30, '#FF0000');
		desenharFonteCentro(context, "Programação: Antonio Ruggiero Arcangelo", 300, 30, '#FF0000');
		desenharFonteCentro(context, "Game Design: Diego Fernandes Resende", 350, 30, '#FF0000');
		desenharFonteCentro(context, "Arte: Stephen Cralcev", 400, 30, '#FF0000');
		
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
		if (somLigado) somRoleta.play();
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
		pergunta = new Pergunta(perguntas[Math.floor(Math.random() * perguntas.length)]);
		setInterval(function() { tela = TELAS.PERGUNTA}, 500);
	    this.materiaSelecionada = this.materias[index];
		if (somLigado) { 
			somRoleta.pause();
			somRoleta.currentTime = 0.0;
		}
	}
  
	this.Transicao = function(t, b, c, d) {
		var ts = (t/=d)*t;
		var tc = ts*t;
		return b+c*(tc + -3*ts + 3*t);
	}
}

function Pergunta(perguntaSelecionada) {
	
	this.DesenharHUD = function() {
		if (perguntaSelecionada !== undefined) {
			LimparCanvas();
			context.fillStyle = "#000000";
			context.fillRect(0, 0, screenWidth, screenHeight);
			this.DesenharCabecalho(roleta.materiaSelecionada, perguntaSelecionada.questao);
			this.DesenharPergunta(this.LETRAPERGUNTA.A, perguntaSelecionada.respostas[0]);
			this.DesenharPergunta(this.LETRAPERGUNTA.B, perguntaSelecionada.respostas[1]);
			this.DesenharPergunta(this.LETRAPERGUNTA.C, perguntaSelecionada.respostas[2]);
			this.DesenharPergunta(this.LETRAPERGUNTA.D, perguntaSelecionada.respostas[3]);
			this.DesenharPergunta(this.LETRAPERGUNTA.E, perguntaSelecionada.respostas[4]);
		}
	}
	
	this.DesenharCabecalho = function(materia, enunciado) {
		context.fillStyle = "#FF0000";
		context.fillRect(50, 50, screenWidth - 100, 150);
		context.fillStyle = "#FFFFFF";
		context.font="30px Georgia";
		context.fillText(materia + ' - ' + enunciado, 60, 90);
	}
	
	this.quadradoInicioX = 50;
	this.quadradoAltura = 50;
	this.quadradoLargura = screenWidth - 100;
	this.distanciaFonteQuadrado = -30
	
	this.LETRAPERGUNTA = {
		A: { texto: 'A', altura: 255 },
		B: { texto: 'B', altura: 330 },
		C: { texto: 'C', altura: 405 },
		D: { texto: 'D', altura: 480 },
		E: { texto: 'E', altura: 560 },
	}
	
	if (perguntaSelecionada !== undefined) {
		this.respostaCerta = perguntaSelecionada.respostaCerta;
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
	if (document.location.hash === "#editor") {
			$('#telaDeFundo').hide();
			$('#editarPerguntas').show();
			Editor.Iniciar();
	}
	else {
		CarregarJogo();
	}
}

function CarregarJogo() {
	somLigado = true;
	
	canvas = document.getElementById('telaDeFundo');
	
	document.addEventListener("keydown", KeyPress);
	canvas.addEventListener("touchstart", Tocou, false);
	canvas.addEventListener("click", Tocou, false);
	context = canvas.getContext('2d');

	
	somAcerto = new Audio("Acerto.mp3");
	somRoleta = new Audio("Roleta.mp3");
	somErro = new Audio("Erro.mp3");
	
	
	screenWidth = canvas.width;
	screenHeight = canvas.height;
	
	menu = new Menu();
	roleta = new Roleta();
	pergunta = new Pergunta();
	configuracoes = new Configuracoes();
	ajuda = new Ajuda();
	creditos = new Creditos();
	senha = new Senha();
	
	tela = TELAS.MENU;
	setInterval(AtualizarDesenhar, 1000/60);
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
		case TELAS.CONFIGURACOES:
			configuracoes.Desenhar();
			break;
		case TELAS.CREDITOS:
			creditos.Desenhar();
			break;
		case TELAS.AJUDA:
			ajuda.Desenhar();
			break;
		case TELAS.SENHA:
			senha.Desenhar();
	}
}

function KeyPress(evento) {
	if (tela == TELAS.SENHA) {
		if (evento.keyCode == 8) {
			evento.preventDefault();
			senha.Texto = senha.Texto.substring(0, senha.Texto.length-1);
		}
		else if (evento.keyCode == 13) {
			//mudatela
		}
		else {
			var digitado = String.fromCharCode(event.which);
			digitado = evento.shiftKey ? digitado.toUpperCase() : digitado.toLowerCase();
			senha.Texto += digitado;
		}
	}
	else {
		switch (evento.keyCode) {
			case 13: //enter
				switch (tela) {
					case TELAS.MENU:
						if (menuPos == 0) {
							tela = TELAS.ROLETA;
						}
						else if (menuPos == 1) {
							tela = TELAS.CONFIGURACOES;
						}
						else if (menuPos == 2) {
							tela = TELAS.AJUDA;
							
						}
						else if (menuPos == 3) {
							tela = TELAS.CREDITOS;
						}
						break;
					case TELAS.ROLETA:
						GirarRoleta();
						break;
					case TELAS.CONFIGURACOES:
						menuPos = 1;
						tela = TELAS.MENU;
						break;
					case TELAS.AJUDA:
						menuPos = 2;
						tela = TELAS.MENU;
						break;
					case TELAS.CREDITOS:
						menuPos = 3;
						tela = TELAS.MENU;
						break;
				}
			break;
			case 27:
				switch (tela) {
					case TELAS.CONFIGURACOES:
						menuPos = 1;
						tela = TELAS.MENU;
					break;
					case TELAS.AJUDA:
						menuPos = 2;
						tela = TELAS.MENU;
						break;
					case TELAS.CREDITOS:
						menuPos = 3;
						tela = TELAS.MENU;
						break;
				}
			break;
			case 37: //<
				switch (tela) {
					case TELAS.CONFIGURACOES:
						somLigado = !somLigado;
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
			break;
			case 39: //>
				switch (tela) {
					case TELAS.CONFIGURACOES:
						somLigado = !somLigado;
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
		}
	}
}

function Tocou(evento) {
	switch (tela) {
		case TELAS.MENU:
			TrataToqueMenu(evento.clientX, evento.clientY);
			//tela = TELAS.ROLETA;
			break;
		case TELAS.ROLETA:
			GirarRoleta();
			break;
		case TELAS.PERGUNTA:
			VerificaResposta(evento.clientX, evento.clientY);
			break;
	}
}

function TrataToqueMenu(x, y) {
	var rect = canvas.getBoundingClientRect();
	if (x >= 10 && x <= 545 && y >= 480) {
		console.log('oi');
		tela = TELAS.SENHA;
	}
}

function VerificaResposta(x, y) {	
	var rect = canvas.getBoundingClientRect();
	for (var p in pergunta.LETRAPERGUNTA) {
		var perguntaDaVez = pergunta.LETRAPERGUNTA[p];
		if (x >= pergunta.quadradoInicioX && x <= pergunta.quadradoLargura+pergunta.quadradoInicioX && y >= perguntaDaVez.altura+pergunta.distanciaFonteQuadrado && y <= pergunta.quadradoAltura+perguntaDaVez.altura+pergunta.distanciaFonteQuadrado) {
			if (p === pergunta.respostaCerta && somLigado) {
				somAcerto.play();
				menu = new Menu();
				roleta = new Roleta();
				pergunta = new Pergunta();
				tela = TELAS.ROLETA;
			}
			else {
				somErro.play();
				menu = new Menu();
				roleta = new Roleta();
				pergunta = new Pergunta();
				tela = TELAS.MENU;
			}
		}
	}
}

function GirarRoleta() {
	roleta.Girar(); //TODO VERIFICAR SE A ROLETA JA ESTA GIRANDO
}