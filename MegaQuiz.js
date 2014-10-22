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
	ROLETA: 0,
	CONFIGURACOES: 1,
	AJUDA: 2,
	CREDITOS: 3,
	MENU: 4,
	PERGUNTA: 5,
	SENHA: 6
};

var tela = 0;

var somAcerto;
var somRoleta;
var somErro;
var somLigado;

var tecla = {
	DEL: 8,
	ENTER:13,
	ESC: 27,
	ESQUERDA: 37,
	CIMA: 38,
	DIREITA: 39,
	BAIXO: 40
}

function desenharFonteCentro(texto, y, tamanhoFonte, cor) {					
	context.font= tamanhoFonte + "px Georgia";
	context.fillStyle = cor;
	context.fillText(texto, screenWidth/2 - context.measureText(texto).width/2, y);	
}

function desenharJanelaTela() {
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
}

function Menu() {
	this.frames = 0;
	this.posicao = 0;
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
		
		desenharFonteCentro("MegaQuiz!", 100, 100, corTitulo);
		desenharFonteCentro("Jogar", 220, 50, this.posicao == 0 ? "#FF0000" : "#FFFFFF");
		desenharFonteCentro("Configurações", 320, 50, this.posicao == 1 ? "#FF0000" : "#FFFFFF");
		desenharFonteCentro("Ajuda", 420, 50, this.posicao == 2 ? "#FF0000" : "#FFFFFF");
		desenharFonteCentro("Créditos", 520, 50, this.posicao == 3 ? "#FF0000" : "#FFFFFF");
	};
	this.Controles = function(evento) {
		switch (evento.keyCode) {
			case tecla.CIMA:
				this.posicao--;
				if (this.posicao < 0) this.posicao = 3;
			break;
			case tecla.BAIXO:
				this.posicao++;
				if (this.posicao > 3) this.posicao = 0;
			break;
			case tecla.ENTER:
				tela = this.posicao;
			break;
		}
	}
}

function Configuracoes() {
	this.posicao = 1;
	this.Desenhar = function() {
		menu.Desenhar();
		desenharJanelaTela();		
		var textoSom = somLigado ? "LIGADO" : "DESLIGADO";
		desenharFonteCentro("Configurações", 235, 30, '#FF0000');
		desenharFonteCentro("Som < " + textoSom + " >", 300, 30, this.posicao == 1 ? '#FFFFFF' : '#FF0000');
		desenharFonteCentro("Editor de Perguntas", 350, 30, this.posicao == 2 ? '#FFFFFF' : '#FF0000');
	};
	this.Controles = function(evento) {
		switch (evento.keyCode) {
			case tecla.ENTER: 
				if (this.posicao == 2) tela = TELAS.SENHA;
				break;
			case tecla.ESC:
				menu.posicao = TELAS.CONFIGURACOES;
				tela = TELAS.MENU;
				break;
			case tecla.DIREITA:
				if (this.posicao == 1) somLigado = !somLigado;
				break;
			case tecla.ESQUERDA:
				if (this.posicao == 1) somLigado = !somLigado;
				break;
			break;
			case tecla.BAIXO:
				if (this.posicao < 2) this.posicao++;
				break;
			break;
			case tecla.CIMA:
				if (this.posicao > 1) this.posicao--;
				break;
		}
	};
}

function Ajuda() {
	this.Desenhar = function() {
		menu.Desenhar();
		desenharJanelaTela();
		desenharFonteCentro("Ajuda", 235, 30, '#FF0000');
		desenharFonteCentro("Teste", 300, 30, '#FF0000');
	};
	this.Controles = function(evento) {
		switch (evento.keyCode) {
			case tecla.ESC:
				menu.posicao = TELAS.AJUDA;
				tela = TELAS.MENU;
			break;
		}
	};
}

function Senha() {
	this.Texto = '';
	this.Desenhar = function() {
		menu.Desenhar();
		desenharJanelaTela();
		desenharFonteCentro("Editar Perguntas", 235, 30, '#FF0000');
		desenharFonteCentro(this.Texto, 300, 30, '#FF0000');
	};
	this.Controles = function(evento) {
		if (evento.keyCode === tecla.DEL) {
			evento.preventDefault();
			this.Texto = this.Texto.substring(0, senha.Texto.length-1);
		}
		else if (evento.keyCode === tecla.ENTER) {
			if (btoa(this.Texto) == 'YWRtaW4=') {
				$('#jogo').hide();
				$('#editarPerguntas').show();
			}
		}
		else {
			var digitado = String.fromCharCode(event.which);
			digitado = evento.shiftKey ? digitado.toUpperCase() : digitado.toLowerCase();
			this.Texto += digitado;
		}
	}
}

function Creditos() {
	this.Desenhar = function() {
		menu.Desenhar();
		desenharJanelaTela();
		desenharFonteCentro("Créditos", 235, 30, '#FF0000');
		desenharFonteCentro("Programação: Antonio Ruggiero Arcangelo", 300, 30, '#FF0000');
		desenharFonteCentro("Game Design: Diego Fernandes Resende", 350, 30, '#FF0000');
		desenharFonteCentro("Arte: Stephen Cralcev", 400, 30, '#FF0000');	
	};
	this.Controles = function(evento) {
		switch (evento.keyCode) {
			case tecla.ESC:
				menu.posicao = TELAS.CREDITOS;
				tela = TELAS.MENU;
			break;
		}
	};
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
		tela = TELAS.PERGUNTA;
		//setTimeout(function() { tela = TELAS.PERGUNTA}, 500);
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
			console.log(this.respostaCerta);
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
		A: { texto: 'A', valor: 1, altura: 255 },
		B: { texto: 'B', valor: 2, altura: 330 },
		C: { texto: 'C', valor: 3, altura: 405 },
		D: { texto: 'D', valor: 4, altura: 480 },
		E: { texto: 'E', valor: 5, altura: 560 },
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

function CarregarJogo() {
	somLigado = true;
	
	canvas = document.getElementById('jogo');
	
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
	switch (tela) {
		case TELAS.MENU:
			menu.Controles(evento);
		break;
		case TELAS.CONFIGURACOES:
			configuracoes.Controles(evento);
		break;
		case TELAS.CREDITOS:
			creditos.Controles(evento);
		break;
		case TELAS.AJUDA:
			ajuda.Controles(evento);
		break;
		case TELAS.SENHA:
			senha.Controles(evento);
	}
}

function Tocou(evento) {
	var rect = canvas.getBoundingClientRect();
	var x = evento.clientX - rect.left;
	var y = evento.clientY - rect.top;
	switch (tela) {
		case TELAS.MENU:
			//TrataToqueMenu(x, y);
			//tela = TELAS.ROLETA;
			break;
		case TELAS.ROLETA:
			GirarRoleta();
			break;
		case TELAS.PERGUNTA:
			VerificaResposta(x, y);
			break;
	}
}

function VerificaResposta(x, y) {	
	var rect = canvas.getBoundingClientRect();
	for (var p in pergunta.LETRAPERGUNTA) {
		var perguntaDaVez = pergunta.LETRAPERGUNTA[p];
		if (x >= pergunta.quadradoInicioX && x <= pergunta.quadradoLargura+pergunta.quadradoInicioX && y >= perguntaDaVez.altura+pergunta.distanciaFonteQuadrado && y <= pergunta.quadradoAltura+perguntaDaVez.altura+pergunta.distanciaFonteQuadrado) {
			roleta = new Roleta();
			if (perguntaDaVez.valor === pergunta.respostaCerta && somLigado) {
				somAcerto.play();
				tela = TELAS.ROLETA;
			}
			else {
				somErro.play();
				tela = TELAS.MENU;
			}
		}
	}
}

function GirarRoleta() {
	roleta.Girar(); //TODO VERIFICAR SE A ROLETA JA ESTA GIRANDO
}