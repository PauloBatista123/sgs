/**
 * Novo SGA - Unidades
 * @author Rogerio Lino <rogeriolino@gmail.com>
 */

var SGA = SGA || {};

SGA.Unidades = {
  deletarImagens: function(id, caminho, unidade){
    Swal.fire({
      icon: 'warning',
      title: 'Deseja deletar a imagem?',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        SGA.ajax({
          url: SGA.url('excluir_slide'),
          type: 'get',
          data: {id, caminho, unidade},
          success: function(response) {
            Swal.fire({
              icon: 'success',
              title: 'Legal!',
              text: 'Sua imagem foi deletada com sucesso!',
            }).then((result) => {
              window.location.reload();
            })
          }
      });
      }
    });
  return false;
  },

  ajaxFile: function(arg) {
    $('#ajax-loading').show();
    var data = arg.data || {};
    data.ts = (new Date()).getTime();
    $.ajax({
        url: arg.url,
        data: data,
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        success: function(response) {
            if (response && response.success) {
                var fn = arg.success;
                if (fn && typeof(fn) === 'function') {
                    fn(response);
                }
            } else {
                // checking session
                if (response.inactive || response.invalid) {
                    SGA.paused = true;
                    var message; 
                    if (response.inactive) {
                        message = SGA.inactiveSession;
                    } else {
                        message = SGA.invalidSession;
                    }
                    SGA.dialogs.error.create({
                        message: message, 
                        close: SGA.reload
                    });
                } else {
                    SGA.dialogs.error.create({
                        message: response.message,
                        close: arg.error
                    });
                }
            }
            if (response.time) {
                SGA.Clock.update(response.time);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var fn = arg.error;
            if (fn && typeof(fn) === 'function') {
                fn(jqXHR, textStatus, errorThrown);
            }
        },
        complete: function(jqXHR, textStatus) {
            $('#ajax-loading').hide();
            var fn = arg.complete;
            if (fn && typeof(fn) === 'function') {
                fn(jqXHR, textStatus);
            }
        }
    });
},

addImagens: function(){

  var formdata = new FormData();
  formdata.append('imagem', $('#imagem')[0].files[0]);
  formdata.append('unidade_id', $('#unidade_id').val());
  
  SGA.Unidades.ajaxFile({
    url: SGA.url('salvar_slide'),
    data: formdata,
    success: function(response) {
      $('#dialog-add-slide').modal('hide');
      var row = $(`
        <tr>
          <td class="imagem"></td>
          <td class="action"></td>
        </tr>
      `);
      
      row.find('.imagem').append(`
          <img src="${window.location.origin}/sga/public/${response.data.caminho}" alt="imagem" width="200">
      `);
      row.find('.action').append(`
        <a href="javascript:void(0)"
        class="btn btn-danger btn-lg"
        onclick="SGA.Unidades.deletarImagens('${response.data.id}', '${response.data.caminho}', '${response.data.unidade}')" 
        title="{% trans %}Deletar{% endtrans %}">Deletar</a>
      `);
      $('#table-slides tbody').append(row);

      Swal.fire({
        icon: 'success',
        title: 'Enviado!',
        text: 'Sua imagem foi enviada com sucesso!',
      })
    }
  });
},
}