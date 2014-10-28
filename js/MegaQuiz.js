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
var fim = {};

var TELAS = {
	ROLETA: 0,
	CONFIGURACOES: 1,
	AJUDA: 2,
	CREDITOS: 3,
	MENU: 4,
	PERGUNTA: 5,
	SENHA: 6,
	FIM: 7,
	GANHOU: 8
};

var pontos = 0;

var tela = 0;

var somIntro;
var somPergunta;
var somAcerto;
var somRoleta;
var somErro;
var somLigado;
var somContagem;

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
var imgPergunta = new Image();
var imgFisica = new Image();
var imgBiologia = new Image();
var imgHistoria = new Image();
var imgQuimica = new Image();
var imgGeografia = new Image();
var imgPortugues = new Image();
var imgMatematica = new Image();

var cores = [];
var materias = [];
var arco = 0;

var pontosMaximos = [];
var pontosJogador = [];

var bkpPerguntas = [];

function CarregarJogo() {
	if (location.hash == "#editor") {
		EntrarEditor();
	}
	
	somLigado = true;
	
	bkpPerguntas = perguntas;
	
	canvas = document.getElementById('jogo');
	
	document.addEventListener("keydown", KeyPress);
	canvas.addEventListener("touchstart", Tocou, false);
	canvas.addEventListener("click", Tocou, false);
	context = canvas.getContext('2d');
		
	fundo.src = "conteudo/img/fundo.png";
	certo.src = "conteudo/img/certo.png";
	errado.src = "conteudo/img/errado.png";
	intro.src = "conteudo/img/intro.png";
	imgPergunta.src = "conteudo/img/pergunta.png"
	opcoes.src = "conteudo/img/opcoes.png";
	imgFisica.src = "conteudo/img/fisica.png";
	imgBiologia.src = "conteudo/img/biologia.png";
	imgHistoria.src = "conteudo/img/historia.png";
	imgQuimica.src = "conteudo/img/quimica.png";
	imgGeografia.src = "conteudo/img/geografia.png";
	imgPortugues.src = "conteudo/img/biologia.png";
	imgMatematica.src = "conteudo/img/biologia.png";
	
	screenWidth = canvas.width;
	screenHeight = canvas.height;
	
	ReiniciarJogo();
	setInterval(Atualizar, 1000/60);
}

function ReiniciarJogo() {
	if (somPergunta !== undefined) somPergunta.src = '';
	somIntro = new Audio("conteudo/sfx/Intro.mp3");;
	somPergunta = new Audio("conteudo/sfx/Pergunta.mp3");
	somAcerto = new Audio("conteudo/sfx/Acerto.mp3");
	somRoleta = new Audio("conteudo/sfx/Roleta.mp3");
	somErro = new Audio("conteudo/sfx/Erro.mp3");	
	somContagem = new Audio("conteudo/sfx/Contagem.mp3");
	
	cores = ["#B8D430", "#3AB745", "#029990", "#3501CB", "#2E2C75", "#673A7E", "#CC0071"];
	materias = ["Geografia", "História", "Matemática", "Português", "Biologia", "Física", "Química"];
	arco = Math.PI / (materias.length/2);
	
	pontosMaximos = {
		Geografia: { id: 1, pontuacao: 0},
		Historia: { id: 2, pontuacao: 0},
		Matematica: { id: 3, pontuacao: 0},
		Portugues: { id: 4, pontuacao: 0},
		Biologia: { id: 5, pontuacao: 0},
		Fisica: { id: 6, pontuacao: 0},
		Quimica: { id: 7, pontuacao: 0}
	}
	
	pontosJogador = {
		Geografia: { id: 1, pontuacao: 0, porcentagemResposta : 0, respondidas: 0, perdeu: false},
		Historia: { id: 2, pontuacao: 0, porcentagemResposta : 0, respondidas: 0, perdeu: false},
		Matematica: { id: 3, pontuacao: 0, porcentagemResposta : 0, respondidas: 0, perdeu: false},
		Portugues: { id: 4, pontuacao: 0, porcentagemResposta : 0, respondidas: 0, perdeu: false},
		Biologia: { id: 5, pontuacao: 0, porcentagemResposta : 0, respondidas: 0, perdeu: false},
		Fisica: { id: 6, pontuacao: 0, porcentagemResposta : 0, respondidas: 0, perdeu: false},
		Quimica: { id: 7, pontuacao: 0, porcentagemResposta : 0, respondidas: 0, perdeu: false}
	}
	
	menu = new Menu();
	roleta = new Roleta();
	pergunta = new Pergunta();
	configuracoes = new Configuracoes();
	ajuda = new Ajuda();
	creditos = new Creditos();
	senha = new Senha();
	fim = new Fim();
	ganhou = new Ganhou();
	
	perguntas = bkpPerguntas;
	
	tela = TELAS.MENU;
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

function QuebrarTexto(texto, x, y, larguraMaxima, alturaLinha, tamanhoFonte) {
	var palavras = texto.split(' ');
	var linha = '';
	for(var n = 0; n < palavras.length; n++) {
		var linhaTeste = linha + palavras[n] + ' ';
		var metricas = context.measureText(linhaTeste);
		var larguraTeste = metricas.width;
		if (larguraTeste > larguraMaxima && n > 0)
		{
			context.font= tamanhoFonte + "px Georgia";
			context.fillText(linha, x, y);
			linha = palavras[n] + ' ';
			y += alturaLinha;
		}
		else 
		{
			linha = linhaTeste;
		}
	}
	context.font= tamanhoFonte + "px Georgia";
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
		case TELAS.FIM:
			fim.Controles(evento);
		break;
		case TELAS.GANHOU:
			ganhou.Controles(evento);
		break;
	}
}

function Tocou(evento) {
	var rect = canvas.getBoundingClientRect();	
	var x = evento.clientX - rect.left;
	var y = evento.clientY - rect.top;
	switch (tela) {
		case TELAS.MENU:
			menu.Clique(x,y);
		break;
		case TELAS.CONFIGURACOES:
			configuracoes.Clique(x,y);
		break;
		case TELAS.SENHA:
			senha.Clique(x,y);
		break;
		case TELAS.AJUDA:
			ajuda.Clique(x,y);
		break;
		case TELAS.CREDITOS:
			creditos.Clique(x,y);
		break;
		case TELAS.ROLETA:
			roleta.Girar();
		break;
		case TELAS.PERGUNTA:
			pergunta.VerificaResposta(x, y);
		break;
		case TELAS.FIM:
			fim.Clique(x,y);
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
		case TELAS.FIM:
			fim.Desenhar();
		break;
		case TELAS.GANHOU:
			ganhou.Desenhar();
		break;
	}
}

function LimparCanvas() {
	context.clearRect(0, 0, screenWidth, screenHeight);
}

function DesenharFonteCentro(texto, y, tamanhoFonte, cor, borda) {
	context.font= tamanhoFonte + "px Georgia";
	context.fillStyle = cor;
	var x = screenWidth/2 - context.measureText(texto).width/2;
	context.fillText(texto, x, y);	
	if (borda !== undefined && borda) {
		context.strokeStyle = '#000000';
		context.lineWidth = 1;
		context.strokeText(texto, x, y);
	}
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
		
		DesenharFonteCentro("Jogar", 420, 30, this.posicao == 0 ? "#FF0000" : "#000000");
		DesenharFonteCentro("Configurações", 465, 30, this.posicao == 1 ? "#FF0000" : "#000000");
		DesenharFonteCentro("Ajuda", 510, 30, this.posicao == 2 ? "#FF0000" : "#000000");
		DesenharFonteCentro("Créditos", 555, 30, this.posicao == 3 ? "#FF0000" : "#000000");
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
	this.Clique = function(x, y) {
		if (x >= 360 && x <= 440 && y >= 398 && y <= 430) {
			tela = TELAS.ROLETA;
		}
		else if (x >= 305 && x <= 495 && y >= 440 && y <= 472) {
			tela = TELAS.CONFIGURACOES;
		}
		else if (x >= 360 && x <= 440 && y >= 488 && y <= 520) {
			tela = TELAS.AJUDA;
		}
		else if (x >= 340 && x <= 455 && y >= 530 && y <= 555) {
			tela = TELAS.CREDITOS;
		}
	};
}

function Configuracoes() {
	this.posicao = 1;
	this.Desenhar = function() {	
		context.drawImage(opcoes, 0, 0);
		var textoSom = somLigado ? "LIGADO" : "DESLIGADO";
		DesenharFonteCentro("Configurações", 160, 30, '#000000');
		DesenharFonteCentro("Som < " + textoSom + " >", 250, 30, this.posicao == 1 ? '#FF0000' : '#000000');
		DesenharFonteCentro("Editor de Perguntas", 300, 30, this.posicao == 2 ? '#FF0000' : '#000000');
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
			somContagem.pause();
			if (somContagem.currentTime !== 0) somContagem.currentTime = 0;
		}
	};
	this.Clique = function(x, y) {
		if ((x < 75 || x > 710) || (y < 120 || y > 495)) {
			menu.posicao = TELAS.CONFIGURACOES;
			tela = TELAS.MENU;
		}
		else if (somLigado && x >= 280 && x <= 515 && y >= 225 && y <= 250) {
			somLigado = false;
		}
		else if (!somLigado && x >= 250 && x <= 550 && y >= 225 && y <= 250) {
			somLigado = true;
		}
		else if (x >= 270 && x <= 530 && y >= 275 && y <= 305) {
			tela = TELAS.SENHA;
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
		DesenharFonteCentro("Editor de Perguntas", 160, 30, '#000000');
		if (this.frames > 0 && this.frames < 30) {
			this.pipe = '|';
		}
		else {
			this.pipe = ' ';
			if (this.frames > 60) this.frames = 0;
		}
		DesenharFonteCentro("Digite a senha previamente cadastrada", 250, 30, '#000000');
		DesenharFonteCentro(this.Texto+this.pipe, 300, 30, '#000000');
		
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
	};
	this.Clique = function(x, y) {
		if ((x < 75 || x > 710) || (y < 120 || y > 495)) {
			configuracoes.posicao = 2;
			tela = TELAS.CONFIGURACOES;
		}
	};
}

function Fim() {
	this.Desenhar = function() {
		context.drawImage(fundo, 0, 0);
		DesenharFonteCentro("Você perdeu! :(", 50, 40, '#FF0000');
		DesenharFonteCentro("Não fique triste! Confira abaixo as matérias que você teve mais dificuldade:", 90, 20, '#000000');
		
		var porcentagemTotal = 0;
		var contagemTotal = 0;
		
		$.each(pontosJogador, function(i, obj) {
			if (obj.perdeu) {
				obj.porcentagemResposta = 1.00;
				obj.respondidas = 1;
			}
			porcentagemTotal += obj.porcentagemResposta;
			contagemTotal += obj.respondidas;
		});
		
		var porcTotal = this.ObterDificuldade(porcentagemTotal/contagemTotal);
		var porcGeografia = this.ObterDificuldade(pontosJogador.Geografia.porcentagemResposta/pontosJogador.Geografia.respondidas, pontosJogador.Geografia.perdeu);
		var porcHistoria = this.ObterDificuldade(pontosJogador.Historia.porcentagemResposta/pontosJogador.Historia.respondidas, pontosJogador.Historia.perdeu);
		var porcMatematica = this.ObterDificuldade(pontosJogador.Matematica.porcentagemResposta/pontosJogador.Matematica.respondidas, pontosJogador.Matematica.perdeu);
		var porcPortugues = this.ObterDificuldade(pontosJogador.Portugues.porcentagemResposta/pontosJogador.Portugues.respondidas, pontosJogador.Portugues.perdeu);
		var porcBiologia = this.ObterDificuldade(pontosJogador.Biologia.porcentagemResposta/pontosJogador.Biologia.respondidas, pontosJogador.Biologia.perdeu);
		var porcFisica = this.ObterDificuldade(pontosJogador.Fisica.porcentagemResposta/pontosJogador.Fisica.respondidas, pontosJogador.Fisica.perdeu);
		var porcQuimica = this.ObterDificuldade(pontosJogador.Quimica.porcentagemResposta/pontosJogador.Quimica.respondidas, pontosJogador.Quimica.perdeu);
		
		this.DesenhaGrafico("Geral", porcTotal, 120, '#0000FF');
		this.DesenhaGrafico("Geografia", porcGeografia, 160, '#B8D430');
		this.DesenhaGrafico("História", porcHistoria, 200, '#3AB745');
		this.DesenhaGrafico("Matemática", porcMatematica, 240, '#029990');
		this.DesenhaGrafico("Português", porcPortugues, 280, '#3501CB');
		this.DesenhaGrafico("Biologia", porcBiologia, 320, '#2E2C75');
		this.DesenhaGrafico("Física", porcFisica, 360, '#673A7E');
		this.DesenhaGrafico("Química", porcQuimica, 400, '#CC0071');
		
		DesenharFonteCentro("Para mais informações sobre a pergunta que você errou acesse:", 500, 20, '#000000');
		DesenharFonteCentro(pergunta.linkAjuda, 550, 20, '#0000FF');
	};
	this.DesenhaGrafico = function(materia, percentual, y, corGrafico) {
		var porcentagemMaxima = 650;
		porcentagem = porcentagemMaxima * percentual;
		context.fillStyle = corGrafico;
		context.fillRect(50, y, porcentagem, 40);
		context.fillRect(porcentagemMaxima+50, y, 5, 40);
		context.font= "30px Georgia";
		context.fillStyle = '#FFFFFF';
		context.fillText(materia, 60, y+30);
		context.fillStyle = '#000000';
		context.fillText(percentual*100 + "%", 710, y+30);
	};
	this.Clique = function(x, y) {
		if (y >= 525 && y <= 560) {
			window.open(pergunta.linkAjuda, "_blank");
		}
		else {
			ReiniciarJogo();
		}
	}
	this.Controles = function(evento) {
		if (evento.keyCode === tecla.ENTER || evento.keyCode === tecla.ESC) {
			ReiniciarJogo();
		}
	};
	this.ObterDificuldade = function(numero, perdeu) {
		if (numero === NaN || numero === "NaN" || isNaN(numero)) return 0.00;
		if (numero === 1) return 1;
		numero = (numero - 1) * -1;
		return numero.toFixed(2);
	};
}

function Ganhou() {
	this.Desenhar = function() {
		context.drawImage(fundo, 0, 0);
		DesenharFonteCentro("Você ganhou o jogo! :D", 250, 40, '#FF0000');
		DesenharFonteCentro("Não existem mais perguntas a serem respondidas!", 300, 30, '#000000');
	};
	this.Controles = function(evento) {
		if (evento.keyCode === tecla.ENTER || evento.keyCode === tecla.ESC) {
			ReiniciarJogo();
		}
	}
}

function Ajuda() {
	this.Desenhar = function() {
		context.drawImage(opcoes, 0, 0);
		DesenharFonteCentro("Ajuda", 160, 30, '#000000');
		var texto = "Gire a roleta e boa sorte! Seu objetivo é responder as perguntas de acordo com a matéria, e não se esqueça do tempo! Cada resposta certa acumulará pontos e no final será dado o Rank! Errou alguma resposta? não fique triste, daremos um link para você acessar e ficar por dentro daquele assunto!"
		QuebrarTexto(texto, 120, 230, 600, 30, 30);
		
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
			case tecla.ENTER:
				menu.posicao = TELAS.AJUDA;
				tela = TELAS.MENU;
			break;
		};
	};
	this.Clique = function(x, y) {
		if ((x < 75 || x > 710) || (y < 120 || y > 495)) {
			menu.posicao = TELAS.AJUDA;
			tela = TELAS.MENU;
		}
	};
}

function Creditos() {
	this.Desenhar = function() {
		context.drawImage(opcoes, 0, 0);
		DesenharFonteCentro("Créditos", 160, 30, '#000000');
		DesenharFonteCentro("Programação: Antonio Ruggiero Arcangelo", 250, 30, '#000000');
		DesenharFonteCentro("Game Design: Diego Fernandes Resende", 300, 30, '#000000');
		DesenharFonteCentro("Arte: Stephen Cralcev", 350, 30, '#000000');	
	};
	this.Controles = function(evento) {
		switch (evento.keyCode) {
			case tecla.ESC:
				menu.posicao = TELAS.CREDITOS;
				tela = TELAS.MENU;
			break;
			case tecla.ENTER:
				menu.posicao = TELAS.CREDITOS;
				tela = TELAS.MENU;
			break;
		};
	};
	this.Clique = function(x, y) {
		if ((x < 75 || x > 710) || (y < 120 || y > 495)) {
			menu.posicao = TELAS.CREDITOS;
				tela = TELAS.MENU;
		}
	};
}

function Roleta() {
	this.parada = false;
	this.materiaSelecionada = "";
	this.anguloInicio = 0;
	this.anguloGiroInicio = 0;
	this.acabarTempoGiro = null;
	
	this.girando = false;
	this.semPerguntas = false;
	
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
			switch (this.materiaSelecionada) {
				case "Geografia":	
				context.drawImage(imgGeografia, 0, 0);
				break;
				case "História":
				context.drawImage(imgHistoria, 0, 0);
				break;
				case "Matemática":
				context.drawImage(imgMatematica, 0, 0);
				break;
				case "Português":
				context.drawImage(imgPortugues, 0, 0);
				break;
				case "Biologia":
				context.drawImage(imgBiologia, 0, 0);
				break;
				case "Física":
				context.drawImage(imgFisica, 0, 0);
				break;
				case "Química":
				context.drawImage(imgQuimica, 0, 0);
				break;
			}			
		}
		else {
			context.drawImage(fundo, 0, 0);
			context.strokeStyle = "#000000";
			context.lineWidth = 2;
			context.font = 'bold 12px sans-serif';
			for(var i = 0; i < materias.length; i++) {
				var angulo = this.anguloInicio + i * arco;
				context.fillStyle = cores[i];
			
				context.beginPath();
				context.arc(400, 300, this.raioFora, angulo, angulo + arco, false);
				context.arc(400, 300, this.raioDentro, angulo + arco, angulo, true);
				context.stroke();
				context.fill();
			
				context.save();
				context.fillStyle = "#FFFFFF";
				context.font = '20px sans-serif';
				context.translate(400 + Math.cos(angulo + arco / 2) * this.raioTexto, 300 + Math.sin(angulo + arco / 2) * this.raioTexto);
				context.rotate(angulo + arco / 2 + Math.PI / 2);
				var text = materias[i];
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
		this.girando = true;
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
		var arcd = arco * 180 / Math.PI;
		var index = Math.floor((360 - graus % 360) / arcd);
		
		var materiaId =  _.findWhere(categorias, { categoria: materias[index] }).id;
		
		pergunta = pergunta.SortearPergunta(materiaId);
		setTimeout(function() { tela = TELAS.PERGUNTA}, 1000);
		this.parada = true;
		this.girando = false;
		this.materiaSelecionada = materias[index];
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
				if (!this.girando) this.Girar();
			break;
		};
	};
}

function Pergunta(perguntaSelecionada) {
	this.respondeu = false;
	this.acertou = false;
	this.contando = false;
	this.frames = 0;
	this.DesenharHUD = function() {
		if (this.tempo <= 0) this.ErrouResposta();
		if (perguntaSelecionada !== undefined) {
			this.frames++;
			LimparCanvas();
			context.drawImage(imgPergunta, 0, 0);
			if (this.respondeu) {
				if (this.acertou) {
					context.drawImage(certo, 0, 0);
				}
				else {
					context.drawImage(errado, 0, 0);
				}
			}
			else {
				this.DesenharCabecalho(perguntaSelecionada.questao);
				this.DesenharPergunta(this.LETRAPERGUNTA.A, perguntaSelecionada.respostas[0]);
				this.DesenharPergunta(this.LETRAPERGUNTA.B, perguntaSelecionada.respostas[1]);
				this.DesenharPergunta(this.LETRAPERGUNTA.C, perguntaSelecionada.respostas[2]);
				this.DesenharPergunta(this.LETRAPERGUNTA.D, perguntaSelecionada.respostas[3]);
				this.DesenharPergunta(this.LETRAPERGUNTA.E, perguntaSelecionada.respostas[4]);
			}
		}
	};
	
	this.DesenharCabecalho = function(enunciado) {
		context.fillStyle = "#000000";		
		QuebrarTexto(enunciado, 50, 45, 650, 25, 20);
		if (this.frames >= 60) {
			this.tempo -= 1;
			this.frames = 0;
		}
		context.font="20px Georgia";
		
		if (this.tempo <= 10) context.fillStyle = "#FF0000";
		if (this.tempo <= 10 && !this.contando) this.contando = true;
		if (this.contando && somLigado) somContagem.play();
		context.fillText(this.tempo + (this.tempo == 1 ? " segundo" : " segundos"), 630, 145);
	};
	
	this.quadradoInicioX = 50;
	this.quadradoAltura = 80;
	this.quadradoLargura = screenWidth - 100;
	this.distanciaFonteQuadrado = 0;
	
	this.LETRAPERGUNTA = {
		A: { texto: 'A', valor: 1, altura: 165 },
		B: { texto: 'B', valor: 2, altura: 250 },
		C: { texto: 'C', valor: 3, altura: 335 },
		D: { texto: 'D', valor: 4, altura: 420 },
		E: { texto: 'E', valor: 5, altura: 505 },
	};
	
	if (perguntaSelecionada !== undefined) {
		this.respostaCerta = perguntaSelecionada.respostaCerta;
		this.tempo = (perguntaSelecionada.dificuldade * 10) + 10;
		this.categoriaId = perguntaSelecionada.categoriaId;
		this.linkAjuda = perguntaSelecionada.linkAjuda;
		
		if (!(/^www/).test(this.linkAjuda) && !(/^http:/).test(this.linkAjuda)) this.linkAjuda = 'http://www.' + this.linkAjuda;
		if ((/^www/).test(this.linkAjuda)) this.linkAjuda = 'http://' + this.linkAjuda;
	};
	
	this.DesenharPergunta = function(letraPergunta, texto) {
		context.fillStyle = "#000000";
		QuebrarTexto(letraPergunta.texto + ". " + texto, 60, letraPergunta.altura+20, 680, 25, 20);
	};
	
	this.SortearPergunta = function(materiaId) {
		var porcDificuldade = Math.floor((Math.random() * 10) + 1);
		if (porcDificuldade <= 50) {
			dificuldadeSorteada = Math.floor((Math.random() * 3) + 1);
		}
		else if (porcDificuldade > 50 && porcDificuldade <= 85) {
			dificuldadeSorteada = 4;
		}
		else {
			dificuldadeSorteada = 5;
		}
		
		var perguntasParaSortear = _.where(perguntas, {categoriaId: materiaId, respondida: false, dificuldade: dificuldadeSorteada});
		
		if (perguntasParaSortear.length === 0) perguntasParaSortear = _.where(perguntas, {categoriaId: materiaId, respondida: false});
		return new Pergunta(perguntasParaSortear[Math.floor(Math.random() * perguntasParaSortear.length)]);
	};
	
	this.ObterTempoTotalPergunta = function(dificuldade) {
		return (perguntaSelecionada.dificuldade * 10) + 10;
	}
	
	this.ObterPontuacaoPelaDificuldade = function(perguntaSemPontuacao) {
		switch (perguntaSemPontuacao.dificuldade) {
			case 1:
				return 25;
			break;
			case 2:
				return 50;
			break;
			case 3:
				return 100;
			break;
			case 4:
				return 200;
			break;
			case 5:
				return 500;
			break;
		}
	}
	
	this.VerificaResposta = function(x, y) {	
		var rect = canvas.getBoundingClientRect();
		for (var p in this.LETRAPERGUNTA) {
			var perguntaDaVez = this.LETRAPERGUNTA[p];
			if (x >= this.quadradoInicioX && x <= this.quadradoLargura+this.quadradoInicioX && y >= perguntaDaVez.altura+this.distanciaFonteQuadrado && y <= this.quadradoAltura+perguntaDaVez.altura+this.distanciaFonteQuadrado) {
				roleta = new Roleta();
				if (perguntaDaVez.valor === this.respostaCerta) {
					this.AcertouResposta();
				}
				else {
					this.ErrouResposta();
				}
			}
		}
	};
	
	this.AcertouResposta = function() {
		if (somLigado) somAcerto.play();
		_.findWhere(perguntas, { id: perguntaSelecionada.id }).respondida = true;
		var perguntasDaCategoria = _.where(perguntas, { categoriaId: perguntaSelecionada.categoriaId, respondida: false });
		if (perguntasDaCategoria.length == 0) {
			var materiaTirar = _.findWhere(categorias, { id: perguntaSelecionada.categoriaId }).categoria;
			materias = _.without(materias, materiaTirar);
			arco = Math.PI / (materias.length/2);
		}
		this.respondeu = true;
		this.acertou = true;
		
		var pontuacaoMaximaPossivel = this.ObterPontuacaoPelaDificuldade(perguntaSelecionada);
		var tempoTotalPergunta = this.ObterTempoTotalPergunta(perguntaSelecionada.dificuldade);
		
		 _.findWhere(pontosMaximos, { id: perguntaSelecionada.categoriaId }).pontuacao += pontuacaoMaximaPossivel;
		 
		 var pontoMateria = _.findWhere(pontosJogador, { id: perguntaSelecionada.categoriaId });
		 if (this.tempo > tempoTotalPergunta * 0.5) {
			pontoMateria.pontuacao += pontuacaoMaximaPossivel;
		 }
		 else if (this.tempo >= tempoTotalPergunta * 0.5 && this.tempo > tempoTotalPergunta * 0.75) {
			pontoMateria.pontuacao += pontuacaoMaximaPossivel * 0.75;
		 }
		 else {
			pontoMateria.pontuacao += pontuacaoMaximaPossivel * 0.5;
		 }
		 
		 var porcentagemTempoResposta = (this.tempo/tempoTotalPergunta).toFixed(2);
		 pontoMateria.porcentagemResposta += parseFloat(porcentagemTempoResposta);
		 pontoMateria.respondidas += 1;
		 
		 var totalDePontos = 0;
		 
		 $.each(pontosJogador, function(i, obj) {totalDePontos += obj.pontuacao;});
		 
		 pontos = totalDePontos;
		
		if (materias.length == 0)  {
			setTimeout(function() { tela = TELAS.GANHOU; }, 1000);
		}
		else {
			setTimeout(function() { tela = TELAS.ROLETA; }, 1000);
		}
	};
	
	this.ErrouResposta = function() {
		pergunta.respondeu = true;
		pergunta.acertou = false;
		
		somContagem.pause();
		if (somContagem.currentTime !== 0) somContagem.currentTime = 0;
		if (somLigado) somErro.play();
		pontos = 0;
		_.findWhere(pontosJogador, { id: perguntaSelecionada.categoriaId }).perdeu = true;
		setTimeout(function() { tela = TELAS.FIM; }, 1000);
	};
}