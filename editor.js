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
		},
		CarregarCategorias: function() {
			var inicio = '<option value="0">Selecione...</option>';
			var corpo = Editor.Metodos.PreencherCategorias();
			$('#ddlCategorias').append(inicio + corpo);
			$('#ddlCategoria').append(corpo);
		},
		AoMudarCategoria: function() {
			$('#ddlCategorias').on('change', function() {
				var categoriaId = $(this).val();
				var listaPerguntas = '';
				$('#groupPerguntas').empty();
				$.each(perguntas, function( key, obj) {
					if (obj.categoria.id == categoriaId) {
						listaPerguntas += '<li  class="lnPergunta" data-perguntaid="' + obj.id + '">' + obj.questao + '</li>';
					}
				});
				$('#groupPerguntas').append(listaPerguntas);
				$('.lnPergunta').off()
				Editor.Eventos.AoSelecionarPergunta();
			});
		},
		AoSelecionarPergunta: function() {
			$('.lnPergunta').on('click', function() {	
				$('.lnPergunta.selecionado').removeClass('selecionado');
				$(this).addClass('selecionado');
				var perguntaId = $(this).attr('data-perguntaid');
				$.each(perguntas, function(key, obj) {
					if (obj.id == perguntaId) {
						$('#txtEnunciado').val(obj.questao);
						$('#txtTempo').val(obj.tempo);
						$.each(obj.respostas, function(i, resposta) {
							$('#txtResposta' + (i+1)).val(resposta);
						});
						$('#rdbResposta' + obj.respostaCerta).attr('checked', 'checked');
						$('#ddlCategoria').val(obj.categoria.id);
					}
				});
			});
		}
	},
	Metodos: {
		PreencherCategorias: function() {
			var html = '';
			$.each(categorias, function( key, obj) {
				html += '<option value="' + obj.id + '">' + obj.categoria + '</option>';
			});
			return html;
		}
	}
}