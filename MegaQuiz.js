var screenWidth;
var screenHeight;
var canvas;
var context;

var desenharRoleta;
var roleta = new Roleta();
	  
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
		setInterval(function() { desenharRoleta = false}, 500);
	    this.materiaSelecionada = this.materias[index];
	}
  
	this.Transicao = function(t, b, c, d) {
		var ts = (t/=d)*t;
		var tc = ts*t;
		return b+c*(tc + -3*ts + 3*t);
	}
}

function LimparCanvas() {
	context.clearRect(0, 0, screenWidth, screenHeight);
}

function CarregarTudo() {
	//console.log(JSON.parse(data));
	
	canvas = document.getElementById('telaDeFundo');
	canvas.addEventListener("touchstart", Tocou, false);
	canvas.addEventListener("click", Tocou, false);
	context = canvas.getContext('2d');
	screenWidth = canvas.width;
	screenHeight = canvas.height;
	desenharRoleta = true;
	setInterval(GameLoop, 1000/60);
}

function GameLoop() {
	Update();
	Draw();
}

function Update() {
	
}

function Draw() {
	if (desenharRoleta) {
		roleta.Desenhar();
	}
	else {
		context.clearRect(0, 0, screenWidth, screenHeight);
		context.fillStyle = "#000000";
		context.fillRect(0, 0, screenWidth, screenHeight);
		
		context.fillStyle = "#FF0000";
		context.fillRect(50, 50, screenWidth - 100, 200);
		
		
		context.fillStyle = "#FF0000";
		context.fillRect(50, 275, screenWidth - 100, 50);
		
		context.fillStyle = "#FF0000";
		context.fillRect(50, 350, screenWidth - 100, 50);
		
		context.fillStyle = "#FF0000";
		context.fillRect(50, 425, screenWidth - 100, 50);
		
		context.fillStyle = "#FF0000";
		context.fillRect(50, 500, screenWidth - 100, 50);
		
		context.fillStyle = "#FFFFFF";
		context.font="30px Georgia";
		context.fillText(roleta.materiaSelecionada, 60, 90);
		
		context.font="20px Georgia";
		context.fillText("Resposta A!", 60, 305);
		
		context.font="20px Georgia";
		context.fillText("Resposta B!", 60, 380);
		
		context.font="20px Georgia";
		context.fillText("Resposta C!", 60, 455);
		
		context.font="20px Georgia";
		context.fillText("Resposta D!", 60, 530);
	}
}

function KeyPress(event) {
	if (event.keyCode == 13 && !roleta.girando) {
		roleta.Girar();
		roleta.girando = true;
	}
}

function Tocou() {
	if (!roleta.girando) {
		roleta.Girar();
		roleta.girando = true;
	}
}