
(function($) {
  "use strict";

  var loadSlides = function() {
    var url = localStorage.getItem('painelweb.url');
    var unidade = localStorage.getItem('painelweb.unidade');
    apiRequest(url + '/api/slides', {
        data: {
          unidade: unidade.id,
        },
        success: function(slides) {
           var slide = $('.rslides');

            slides.map(item => {
              var row = $(`
              <li>
                <img src="/sga/public${item.caminho}" alt="imge"/>
              </li>`)
              slide.append(row);
            });

            $(".rslides").responsiveSlides({
              timeout: 10000
            });
        },
    });
  };
    
  var apiRequest = function(url, args) {
    $.ajax({
        url: url,
        dataType: 'json',
        data: args.data || {},
        success: function(response) {
            if (typeof(args.success) === 'function') {
                args.success(response);
            }
        },
        error: function() {
            if (typeof(args.error) === 'function') {
                args.error();
            }
        },
        complete: function(response) {
            if (typeof(args.complete) === 'function') {
                args.complete(response);
            }
        }
    });
};

loadSlides();

})(jQuery);