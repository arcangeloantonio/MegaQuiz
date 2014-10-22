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

var pontos = 0;

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

var fundo = new Image();
var certo = new Image();
var errado = new Image();

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
		};
	};
}

function Configuracoes() {
	this.posicao = 1;
	this.Desenhar = function() {
		menu.Desenhar();
		desenharJanelaTela();		
		var textoSom = somLigado ? "LIGADO" : "DESLIGADO";
		desenharFonteCentro("Configurações", 235, 30, '#FF0000');
		desenharFonteCentro("Som < " + textoSom + " >", 300, 30, this.posicao == 1 ? '#FF0000' : '#FFFFFF');
		desenharFonteCentro("Editor de Perguntas", 350, 30, this.posicao == 2 ? '#FF0000' : '#FFFFFF');
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
			case tecla.BAIXO:
				if (this.posicao < 2) this.posicao++;
			break;
			case tecla.CIMA:
				if (this.posicao > 1) this.posicao--;
			break;
		};
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
		};
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
		else if (evento.keyCode === tecla.ESC) {			
			configuracoes.posicao = 2;
			tela = TELAS.CONFIGURACOES;
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
		};
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
      
		context.drawImage(fundo, 0, 0);
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
		context.font = 'bold 30px sans-serif';
		context.fillStyle = "#FF0000";
		var pontuacao = "Pontos: " + pontos;
		context.fillText(pontuacao, screenWidth-context.measureText(pontuacao).width-10, screenHeight-10);
	};
	
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
	};
	
	this.Girar = function()  {
		this.anguloGiroInicio = Math.random() * 10 + 15;
		this.tempoGiroTotal = Math.random() * 3 + 4 * 1000;
		this.GirarRoleta();
	};
  
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
	};
  
	this.PararDeGirarRoleta = function() {
		var graus = this.anguloInicio * 180 / Math.PI + 90;
		var arcd = this.arco * 180 / Math.PI;
		var index = Math.floor((360 - graus % 360) / arcd);
		pergunta = new Pergunta(perguntas[Math.floor(Math.random() * perguntas.length)]);
		tela = TELAS.PERGUNTA;
		setTimeout(function() { tela = TELAS.PERGUNTA}, 500);
	    this.materiaSelecionada = this.materias[index];
		if (somLigado) { 
			somRoleta.pause();
			somRoleta.currentTime = 0.0;
		}
	};
  
	this.Transicao = function(t, b, c, d) {
		var ts = (t/=d)*t;
		var tc = ts*t;
		return b+c*(tc + -3*ts + 3*t);
	};
	
	this.Controles = function(evento) {
		switch (evento.keyCode) {
			case (tecla.ENTER):
				this.Girar();
			break;
		};
	};
}

function Pergunta(perguntaSelecionada) {
	this.respondeu = false;
	this.acertou = false;
	this.DesenharHUD = function() {
		if (perguntaSelecionada !== undefined) {
			LimparCanvas();
			context.drawImage(fundo, 0, 0);
			
			if (this.respondeu) {
				if (this.acertou) {
					context.drawImage(certo, 0, 0);
				}
				else {
					context.drawImage(errado, 0, 0);
				}
			}
			else {
				this.DesenharCabecalho(roleta.materiaSelecionada, perguntaSelecionada.questao);
				this.DesenharPergunta(this.LETRAPERGUNTA.A, perguntaSelecionada.respostas[0]);
				this.DesenharPergunta(this.LETRAPERGUNTA.B, perguntaSelecionada.respostas[1]);
				this.DesenharPergunta(this.LETRAPERGUNTA.C, perguntaSelecionada.respostas[2]);
				this.DesenharPergunta(this.LETRAPERGUNTA.D, perguntaSelecionada.respostas[3]);
				this.DesenharPergunta(this.LETRAPERGUNTA.E, perguntaSelecionada.respostas[4]);
			}
			console.log(this.respostaCerta);
		}
	};
	
	this.DesenharCabecalho = function(materia, enunciado) {
		context.fillStyle = "#000000";
		context.fillRect(50, 10, screenWidth - 100, 150);
		context.fillStyle = "#FFFFFF";
		context.font="30px Georgia";
		context.fillText(materia + ' - ' + enunciado, 60, 40);
	};
	
	this.quadradoInicioX = 50;
	this.quadradoAltura = 70;
	this.quadradoLargura = screenWidth - 100;
	this.distanciaFonteQuadrado = -30
	
	this.LETRAPERGUNTA = {
		A: { texto: 'A', valor: 1, altura: 210 },
		B: { texto: 'B', valor: 2, altura: 295 },
		C: { texto: 'C', valor: 3, altura: 380 },
		D: { texto: 'D', valor: 4, altura: 465 },
		E: { texto: 'E', valor: 5, altura: 550 },
	};
	
	if (perguntaSelecionada !== undefined) {
		this.respostaCerta = perguntaSelecionada.respostaCerta;
	};
	
	this.DesenharPergunta = function(letraPergunta, texto) {
		context.fillStyle = "#000000";
		context.fillRect(this.quadradoInicioX, letraPergunta.altura+this.distanciaFonteQuadrado, this.quadradoLargura, this.quadradoAltura);
		
		context.fillStyle = "#FFFFFF";
		context.font="20px Georgia";
		context.fillText(texto, 60, letraPergunta.altura);
	};
	
	this.VerificaResposta = function(x, y) {	
		var rect = canvas.getBoundingClientRect();
		for (var p in this.LETRAPERGUNTA) {
			var perguntaDaVez = this.LETRAPERGUNTA[p];
			if (x >= this.quadradoInicioX && x <= this.quadradoLargura+this.quadradoInicioX && y >= perguntaDaVez.altura+this.distanciaFonteQuadrado && y <= this.quadradoAltura+perguntaDaVez.altura+this.distanciaFonteQuadrado) {
				roleta = new Roleta();
				if (perguntaDaVez.valor === this.respostaCerta && somLigado) {
					somAcerto.play();
					this.respondeu = true;
					this.acertou = true;
					pontos += 10;
					setTimeout(function() { tela = TELAS.ROLETA; }, 2000);
				}
				else {
					this.respondeu = true;
					this.acertou = false;
					somErro.play();
					pontos = 0;
					setTimeout(function() { tela = TELAS.MENU; }, 2000);
				}
			}
		}
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
	
	fundo.src = "img/fundo.png";
	certo.src = "img/certo.png";
	errado.src = "img/errado.png";
	
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
	setInterval(Atualizar, 1000/60);
}

function Atualizar() {
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
		break;
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
		case TELAS.ROLETA:
			roleta.Controles(evento);
		break;
		case TELAS.SENHA:
			senha.Controles(evento);
		break;
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
			roleta.Girar();
		break;
		case TELAS.PERGUNTA:
			pergunta.VerificaResposta(x, y);
		break;
	}
}