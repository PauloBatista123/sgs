
(function($) {
  "use strict";

  var loadSlides = function() {
    var url = localStorage.getItem('painelweb.url');
    var unidade = JSON.parse(localStorage.getItem('painelweb.unidade'));
    apiRequest(`${url}/api/slides/${unidade.id}`, {
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

function refreshAt(hours, minutes, seconds) {
  var now = new Date();
  var then = new Date();

  if(now.getHours() > hours ||
      (now.getHours() == hours && now.getMinutes() > minutes) ||
      now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
      then.setDate(now.getDate() + 1);
  }
  then.setHours(hours);
  then.setMinutes(minutes);
  then.setSeconds(seconds);

  var timeout = (then.getTime() - now.getTime());
  setTimeout(function() { window.location.reload(true); }, timeout);
}
loadSlides();
refreshAt("17","08","30");

})(jQuery);

