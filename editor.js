var categorias = {
	Geografia: { id: 1, categoria: 'Geografia'},
	Historia: { id: 2, categoria: 'História'},
	Matematica: { id: 3, categoria: 'Matemática'},
	Portugues: { id: 4, categoria: 'Português'},
	Biologia: { id: 5, categoria: 'Biologia'},
	Fisica: { id: 6, categoria: 'Física'},
	Quimica: { id: 7, categoria: 'Química'},
}

var Editor = {
	Iniciar: function() {
		this.Eventos.Vincular();
		this.htmlCategorias = Editor.Metodos.PreencherCategorias();
	},
	Eventos: {
		Vincular: function() {
			this.CarregarCategorias();
			this.AoMudarCategoria();
			this.AoSelecionarPergunta();
			this.AoClicarSalvar();
			this.AoClicarAdicionar();
			this.AoClicarRemover();
		},
		CarregarCategorias: function() {
			var inicio = '<option value="0">Selecione...</option>';
			var corpo = Editor.Metodos.PreencherCategorias();
			$('#ddlCategorias').append(inicio + corpo);
			$('#ddlCategoria').append(corpo);
		},
		AoMudarCategoria: function() {
			$('#ddlCategorias').on('change', function() {
				Editor.Metodos.AtualizarLista();
			});
		},
		AoSelecionarPergunta: function() {
			$('.lnPergunta').on('click', function() {	
				$('.lnPergunta.selecionado').removeClass('selecionado');
				$(this).addClass('selecionado');
				var perguntaId = eval($(this).attr('data-perguntaid'));
				
				var obj = _.where(perguntas, {id: perguntaId})[0];
				
				$('#txtEnunciado').val(obj.questao);
				$('#txtTempo').val(obj.tempo);
				$.each(obj.respostas, function(i, resposta) { $('#txtResposta' + (i+1)).val(resposta);});
				$('#rdbResposta' + obj.respostaCerta).attr('checked', 'checked');
				$('#ddlCategoria').val(obj.categoriaId);
				$('#spnRemove').css('visibility', 'visible');
			});
		},
		AoClicarAdicionar: function() {
			$('#spnAdd').on('click', function() {
				Editor.Metodos.LimparCampos();
			});
		},
		AoClicarRemover: function() {
			$('#spnRemove').on('click', function() {
				var perguntaId = eval($('.lnPergunta.selecionado').attr('data-perguntaid'));
				perguntas = _.without(perguntas, _.findWhere(perguntas, { id: perguntaId }));
				Editor.Metodos.LimparCampos();
				Editor.Metodos.AtualizarLista();
				$('#spnRemove').css('visibility', 'hidden');
			});
		},
		AoClicarSalvar: function() {
			$('#btnSalvar').on('click', function() {
				Editor.Metodos.saveTextAsFile();
			});
		}
	},
	Metodos: {
		LimparCampos: function() {
			$('#txtEnunciado').val('');
			$('#txtTempo').val('');
			$('.txtResposta').val('');
			$('[name="rdbResposta"]').attr('checked', false);
		},
		AtualizarLista: function() {
			var categoriaId = eval($('#ddlCategorias').val());
			var listaPerguntas = '';
			$('#groupPerguntas').empty();			
			$.each(perguntas, function( key, obj) {
				if (obj.categoriaId == categoriaId) {
					listaPerguntas += '<li  class="lnPergunta" data-perguntaid="' + obj.id + '">' + obj.questao + '</li>';
				}
			});
			$('#groupPerguntas').append(listaPerguntas);
			$('.lnPergunta').off();
			Editor.Eventos.AoSelecionarPergunta();
		},
		PreencherCategorias: function() {
			var html = '';
			$.each(categorias, function( key, obj) {
				html += '<option value="' + obj.id + '">' + obj.categoria + '</option>';
			});
			return html;
		},
		saveTextAsFile: function()
		{      
			var textToWrite = JSON.stringify(perguntas);
			var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
			var fileNameToSaveAs = "perguntas.json";
			var downloadLink = document.createElement("a");
			downloadLink.download = fileNameToSaveAs;
			downloadLink.innerHTML = "My Hidden Link";
			window.URL = window.URL || window.webkitURL;
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = Editor.Metodos.destroyClickedElement;
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
			downloadLink.click();
		},
		destroyClickedElement: function(event)
		{
			document.body.removeChild(event.target);
		}
	}
}