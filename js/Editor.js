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
			this.AoClicarVoltar();
			this.CarregarCategorias();
			this.AoMudarCategoria();
			this.AoSelecionarPergunta();
			this.AoClicarSalvar();
			this.AoClicarAdicionar();
			this.AoClicarRemover();
			this.AoClicarBotaoAdicionar();
		},
		AoClicarVoltar: function() {
			$('#btnVoltar').on('click', function() {
				window.location.href = document.location.href.split("#")[0];
				window.reload();
			});
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
				
				$('#containerPerguntas').attr('data-idPergunta', perguntaId);
				$('#txtEnunciado').val(obj.questao);
				$('#txtLink').val(obj.linkAjuda);
				$.each(obj.respostas, function(i, resposta) { $('#txtResposta' + (i+1)).val(resposta);});
				$('#rdbResposta' + obj.respostaCerta).prop('checked', 'checked');
				$('#ddlCategoria').val(obj.categoriaId);
				$('#btnRemove').css('visibility', 'visible');
				$('#btnAdicionar').html('Editar Pergunta');
			});
		},
		AoClicarAdicionar: function() {
			$('#btnNovaPergunta').on('click', function() {
				Editor.Metodos.LimparCampos();
			});
		},
		AoClicarRemover: function() {
			$('#btnRemove').on('click', function() {
				var perguntaId = eval($('.lnPergunta.selecionado').attr('data-perguntaid'));
				perguntas = _.without(perguntas, _.findWhere(perguntas, { id: perguntaId }));
				Editor.Metodos.LimparCampos();
				Editor.Metodos.AtualizarLista();
				$('#btnRemove').css('visibility', 'hidden');
			});
		},
		AoClicarSalvar: function() {
			$('#btnSalvar').on('click', function() {
				Editor.Metodos.saveTextAsFile();
			});
		},
		AoClicarBotaoAdicionar: function() {
			$('#btnAdicionar').on('click', function() {
				var enunciado = $('#txtEnunciado').val();
				var categoriaId = eval($('#ddlCategoria').val());
				var dificuldade = $('#ddlDificuldade').val();
				var link = $('#txtLink').val();
				var resposta1 = $('#txtResposta1').val();
				var resposta2 = $('#txtResposta2').val();
				var resposta3 = $('#txtResposta3').val();
				var resposta4 = $('#txtResposta4').val();
				var resposta5 = $('#txtResposta5').val();
				
				var respostaCerta = $('[name="rdbResposta"]:checked').attr('id');
				
				if (enunciado.length === 0) return alert('Digite um enunciado');
				if (resposta1.length === 0) return alert('Digite a resposta A');
				if (resposta2.length === 0) return alert('Digite a resposta B');
				if (resposta3.length === 0) return alert('Digite a resposta C');
				if (resposta4.length === 0) return alert('Digite a resposta D');
				if (resposta5.length === 0) return alert('Digite a resposta E');
				if (respostaCerta === undefined) return alert('Selecione uma resposta certa!');
				
				var respostaCerta = respostaCerta.split('rdbResposta')[1];

				var perguntaId = eval($('#containerPerguntas').attr('data-idPergunta'));
				
				var novaPergunta = {
						id: perguntaId === undefined ? Metodos.ObterProximoId() : perguntaId,
						questao: enunciado,
						respostas: [resposta1, resposta2, resposta3, resposta4, resposta5],
						respostaCerta: eval(respostaCerta),
						linkAjuda: link,
						categoriaId: categoriaId,
						respondida: false
				};
				
				if (perguntaId !== undefined) {
					perguntas = _.without(perguntas, _.findWhere(perguntas, { id: perguntaId }));
				}
				perguntas.push(novaPergunta);
				
				Editor.Metodos.LimparCampos();
				Editor.Metodos.AtualizarLista();
				alert('Pergunta adicionada com sucesso!');
			});
		}
	},
	Metodos: {
		ObterProximoId: function() {
			return _.sortBy(_.filter(perguntas, function(pergunta) { return pergunta.id }), function (id) {return id}).pop().id+1;
		},
		LimparCampos: function() {
			$('#txtEnunciado').val('');
			$('#txtLink').val('');
			$('.txtResposta').val('');
			$('[name="rdbResposta"]').removeAttr('checked');
			$('#containerPerguntas').removeAttr('data-idPergunta');
			$('#ddlDificuldade').val(1);
			$('#btnAdicionar').html('Adicionar Pergunta');
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
			var textToWrite = 'var perguntas = ' + JSON.stringify(perguntas);
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