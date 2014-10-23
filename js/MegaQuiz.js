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

var somIntro;
var somPergunta;
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

var intro = new Image();
var opcoes = new Image();
var fundo = new Image();
var certo = new Image();
var errado = new Image();
var imgFisica = new Image();
var imgBiologia = new Image();

function CarregarJogo() {
	if (location.hash == "#editor") {
		EntrarEditor();
	}
	somLigado = true;
	
	canvas = document.getElementById('jogo');
	
	document.addEventListener("keydown", KeyPress);
	canvas.addEventListener("touchstart", Tocou, false);
	canvas.addEventListener("click", Tocou, false);
	context = canvas.getContext('2d');
	
	somIntro = new Audio("conteudo/sfx/Intro.mp3");;
	somPergunta = new Audio("conteudo/sfx/Pergunta.mp3");
	somAcerto = new Audio("conteudo/sfx/Acerto.mp3");
	somRoleta = new Audio("conteudo/sfx/Roleta.mp3");
	somErro = new Audio("conteudo/sfx/Erro.mp3");	
	
	fundo.src = "conteudo/img/fundo.png";
	certo.src = "conteudo/img/certo.png";
	errado.src = "conteudo/img/errado.png";
	intro.src = "conteudo/img/intro.png";
	opcoes.src = "conteudo/img/opcoes.png";
	imgFisica.src = "conteudo/img/fisica.png";
	imgBiologia.src = "conteudo/img/biologia.png";
	
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

function Perdeu() {
	pergunta.respondeu = true;
	pergunta.acertou = false;
	somErro.play();
	pontos = 0;
	setTimeout(function() { tela = TELAS.MENU; }, 2000);
}

function EntrarEditor() {
	$('#jogo').hide();
	$('#editarPerguntas').show();
	window.location.hash='editor';
	if (somIntro !== undefined) {
		somIntro.pause();
		somIntro.currentTime = 0;
	}
	Editor.Iniciar();
}

function QuebrarTexto(texto, x, y, larguraMaxima, alturaLinha) {
	var palavras = texto.split(' ');
	var linha = '';
	for(var n = 0; n < palavras.length; n++) {
		var linhaTeste = linha + palavras[n] + ' ';
		var metricas = context.measureText(linhaTeste);
		var larguraTeste = metricas.width;
		if (larguraTeste > larguraMaxima && n > 0)
		{
			context.font="30px Georgia";
			context.fillText(linha, x, y);
			linha = palavras[n] + ' ';
			y += alturaLinha;
		}
		else 
		{
			linha = linhaTeste;
		}
	}
	context.font="30px Georgia";
	context.fillText(linha, x, y);
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

function LimparCanvas() {
	context.clearRect(0, 0, screenWidth, screenHeight);
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
	this.posicao = 0;
	this.Desenhar = function() {
		if (somLigado) {
			somPergunta.pause();
			if (somPergunta.currentTime !== 0) somPergunta.currentTime = 0.0;
			somIntro.play();
		}
		LimparCanvas();
		context.drawImage(intro, 0,0);
		var corTitulo = '';
		
		desenharFonteCentro("Jogar", 420, 30, this.posicao == 0 ? "#FF0000" : "#000000");
		desenharFonteCentro("Configurações", 465, 30, this.posicao == 1 ? "#FF0000" : "#000000");
		desenharFonteCentro("Ajuda", 510, 30, this.posicao == 2 ? "#FF0000" : "#000000");
		desenharFonteCentro("Créditos", 555, 30, this.posicao == 3 ? "#FF0000" : "#000000");
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
		context.drawImage(opcoes, 0, 0);
		var textoSom = somLigado ? "LIGADO" : "DESLIGADO";
		desenharFonteCentro("Configurações", 160, 30, '#000000');
		desenharFonteCentro("Som < " + textoSom + " >", 250, 30, this.posicao == 1 ? '#FF0000' : '#000000');
		desenharFonteCentro("Editor de Perguntas", 300, 30, this.posicao == 2 ? '#FF0000' : '#000000');
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
				if (this.posicao == 1) this.ConfigurarSom();
			break;
			case tecla.ESQUERDA:
				if (this.posicao == 1) this.ConfigurarSom();
			break;
			case tecla.BAIXO:
				if (this.posicao < 2) this.posicao++;
			break;
			case tecla.CIMA:
				if (this.posicao > 1) this.posicao--;
			break;
		};
	};
	this.ConfigurarSom = function() {
		somLigado = !somLigado;
		if (somLigado) {
			somIntro.play();
		}
		else {
			somIntro.pause();
			if (somIntro.currentTime !== 0) somIntro.currentTime = 0;
			somPergunta.pause();
			if (somPergunta.currentTime !== 0) somPergunta.currentTime = 0;
			somAcerto.pause();
			if (somAcerto.currentTime !== 0) somAcerto.currentTime = 0;
			somErro.pause();
			if (somErro.currentTime !== 0) somErro.currentTime = 0;
			somRoleta.pause();
			if (somRoleta.currentTime !== 0) somRoleta.currentTime = 0;
		}
	};
}

function Senha() {
	this.Texto = '';
	this.frames = 0;
	this.pipe = ' ';
	this.Desenhar = function() {
		this.frames++;
		context.drawImage(opcoes, 0, 0);
		desenharFonteCentro("Editor de Perguntas", 160, 30, '#000000');
		if (this.frames > 0 && this.frames < 30) {
			this.pipe = '|';
		}
		else {
			this.pipe = ' ';
			if (this.frames > 60) this.frames = 0;
		}
		desenharFonteCentro("Digite a senha previamente cadastrada", 250, 30, '#000000');
		desenharFonteCentro(this.Texto+this.pipe, 300, 30, '#000000');
		
	};
	this.Controles = function(evento) {
		if (evento.keyCode === tecla.DEL) {
			evento.preventDefault();
			this.Texto = this.Texto.substring(0, senha.Texto.length-1);
		}
		else if (evento.keyCode === tecla.ENTER) {
			if (btoa(this.Texto) == 'YWRtaW4=') {
				EntrarEditor();
				$('#jogo').hide();
				$('#editarPerguntas').show();
			}
		}
		else if (evento.keyCode === tecla.ESC) {			
			configuracoes.posicao = 2;
			tela = TELAS.CONFIGURACOES;
		}
		else if (evento.keyCode > 64 && evento.keyCode < 123) {
			var digitado = String.fromCharCode(evento.which);
			digitado = evento.shiftKey ? digitado.toUpperCase() : digitado.toLowerCase();
			this.Texto += digitado;
		}
	}
}

function Ajuda() {
	this.Desenhar = function() {
		context.drawImage(opcoes, 0, 0);
		desenharFonteCentro("Ajuda", 160, 30, '#000000');
		var texto = "Gire a roleta e boa sorte! Seu objetivo é responder as perguntas de acordo com a matéria, e não se esqueça do tempo! Cada resposta certa acumulará pontos e no final será dado o Rank! Errou alguma resposta? não fique triste, daremos um link para você acessar e ficar por dentro daquele assunto!"
		QuebrarTexto(texto, 120, 230, 600, 30);
		
		var bonsEstudos = "Bons estudos!";
		context.font= "30 px Georgia";
		context.fillStyle = "#000000";
		context.fillText(bonsEstudos, screenWidth/2 - context.measureText(bonsEstudos).width/2, 465);	
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

function Creditos() {
	this.Desenhar = function() {
		context.drawImage(opcoes, 0, 0);
		desenharFonteCentro("Créditos", 160, 30, '#000000');
		desenharFonteCentro("Programação: Antonio Ruggiero Arcangelo", 250, 30, '#000000');
		desenharFonteCentro("Game Design: Diego Fernandes Resende", 300, 30, '#000000');
		desenharFonteCentro("Arte: Stephen Cralcev", 350, 30, '#000000');	
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
	this.parada = false;
	this.cores = ["#B8D430", "#3AB745", "#029990", "#3501CB", "#2E2C75", "#673A7E", "#CC0071"];
	this.materias = ["Geografia", "História", "Matemática", "Português", "Biologia", "Física", "Química"];
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
		if (somLigado) {
			somIntro.pause();
			somIntro.currentTime = 0.0;
			somPergunta.play();
		}
		LimparCanvas();
		if (this.parada) {
			context.drawImage(imgBiologia, 0, 0);
		}
		else {
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
		}
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
		
		var materiaId =  _.findWhere(categorias, { categoria: this.materias[index] }).id;
		var perguntasParaSortear =  _.where(perguntas, {categoriaId: materiaId});
		
		pergunta = new Pergunta(perguntasParaSortear[Math.floor(Math.random() * perguntasParaSortear.length)]);
		setTimeout(function() { tela = TELAS.PERGUNTA}, 2000);
		this.parada = true;
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
	this.frames = 0;
	this.DesenharHUD = function() {
		if (this.tempo <= 0) Perdeu();
		if (perguntaSelecionada !== undefined) {
			this.frames++;
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
		QuebrarTexto(materia + ' - ' + enunciado, 60, 50, 400, 50)
		if (this.frames >= 60) {
			this.tempo -= 1;
			this.frames = 0;
		}
		context.font="20px Georgia";
		context.fillText(this.tempo + (this.tempo == 1 ? " segundo" : " segundos"), 630, 150);
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
		this.tempo = perguntaSelecionada.tempo;
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
					Perdeu();
				}
			}
		}
	}
}