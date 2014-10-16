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
		},
		AoClicarSalvar: function() {
			$('#btnSalvar').on('click', function() {
				Editor.Metodos.saveTextAsFile();
				// var data = JSON.stringify(perguntas);
				// var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
				// window.open(url);
				// window.focus();
				//window.open("data:text/json;charset=utf-8," + JSON.stringify(perguntas));
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
		},
		saveTextAsFile: function()
		{      
		// grab the content of the form field and place it into a variable
			var textToWrite = JSON.stringify(perguntas);
		//  create a new Blob (html5 magic) that conatins the data from your form feild
			var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
		// Specify the name of the file to be saved
			var fileNameToSaveAs = "perguntas.json";
			
		// Optionally allow the user to choose a file name by providing 
		// an imput field in the HTML and using the collected data here
		// var fileNameToSaveAs = txtFileName.text;
		
		// create a link for our script to 'click'
			var downloadLink = document.createElement("a");
		//  supply the name of the file (from the var above).
		// you could create the name here but using a var
		// allows more flexability later.
			downloadLink.download = fileNameToSaveAs;
		// provide text for the link. This will be hidden so you
		// can actually use anything you want.
			downloadLink.innerHTML = "My Hidden Link";
			
		// allow our code to work in webkit & Gecko based browsers
		// without the need for a if / else block.
			window.URL = window.URL || window.webkitURL;
				
		// Create the link Object.
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		// when link is clicked call a function to remove it from
		// the DOM in case user wants to save a second file.
			downloadLink.onclick = Editor.Metodos.destroyClickedElement;
		// make sure the link is hidden.
			downloadLink.style.display = "none";
		// add the link to the DOM
			document.body.appendChild(downloadLink);
			
		// click the new link
			downloadLink.click();
		},
		destroyClickedElement: function(event)
		{
		// remove the link from the DOM
			document.body.removeChild(event.target);
		}
		// EOF
	}
}