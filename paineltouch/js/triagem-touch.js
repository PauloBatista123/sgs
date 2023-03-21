/**
 * SGA TriagemTouch
 * @author rogeriolino
 */
;(function() {
    'use strict'

    var app = angular.module('TriagemTouch', []);

    app.controller('TriagemCtrl', function($http) {
        var ctrl = this;

        ctrl.conta = "";
        ctrl.urlLogo = 'images/novalogo.png';

        ctrl.meIdentificar = 'images/correto.png';
        ctrl.naoIdentificar = 'images/incorreto.png';
        ctrl.imgAtendimento = 'images/atendimento.png';
        ctrl.imgCheque = 'images/cheque.png';
        ctrl.imgDinheiro = 'images/saco_dinheiro.png';
        ctrl.imgCodigo = 'images/codigo.png';
        ctrl.imgGerente = 'images/gerente.png';
        ctrl.imgSemPreferencia = 'images/sem_preferencia.png';

        ctrl.cadeirante = 'images/cadeirante.png';
        ctrl.autismo = 'images/autismo.png';
        ctrl.gravida = 'images/gravidas.png';
        ctrl.cegos = 'images/cegos.png';
        ctrl.surdos = 'images/surdo.png';
        ctrl.idosos = 'images/idosos.png';
        ctrl.mae = 'images/mae.png';
        ctrl.prioritario = 'images/prioritario.png';
        ctrl.convencional = 'images/convencional.png';

        ctrl.url = Storage.get('url');
        ctrl.unidade = Storage.get('unidade');
        ctrl.usuario = Storage.get('usuario');
        ctrl.senha = Storage.get('senha');
        ctrl.clientId = Storage.get('clientId');
        ctrl.clientSecret = Storage.get('clientSecret');
        ctrl.unidades = [];
        ctrl.servicos = [];
        ctrl.prioridades = [];
        ctrl.gerentes = [];
        ctrl.gerente = {
            id: ''
        }
        ctrl.cliente = {
            nome: '',
            conta: '',
        };
        ctrl.atendimento = {};
        
        ctrl.changeServico = function(servico) {
            servico.hide = !servico.show;
        };
        
        ctrl.changeUnidade = function() {
            ctrl.loadServicos();
        };

        ctrl.loadUnidades = function() {
            ctrl.unidades = [];
            if (ctrl.url) {
                $http({ method: 'GET', url: ctrl.url + '/api/unidades' }).
                success(function(data) {
                    ctrl.unidades = data;
                });
            }
        };

        ctrl.iteratorGerentes = function() {
            return ctrl.gerentes;
        }

        ctrl.selecionaGerente = function(gerente) {
            ctrl.gerente.id = gerente.id;
            ctrl.gotoPage('#prioridades');
        }

        ctrl.loadServicos = function() {
            if (ctrl.url && ctrl.unidade > 0) {
                $http({ method: 'GET', url: ctrl.url + '/api/servicos/' + ctrl.unidade }).
                success(function(data) {
                    ctrl.servicos = data;
                    var servicosHabilitados = [];
                    var desabilitados = JSON.parse(Storage.get('desabilitados') || '[]');
                    for (var i = 0; i < ctrl.servicos.length; i++) {
                        var servico = ctrl.servicos[i];
                        servico.hide = false;
                        for (var j = 0; j < desabilitados.length; j++) {
                            if (servico.id === desabilitados[j]) {
                                servico.hide = true;
                            }
                        }
                        servico.show = !servico.hide;
                        if (servico.show) {
                            servicosHabilitados.push(servico);
                        }
                    }
                    ctrl.paginator = new Paginator(servicosHabilitados, ctrl.interface.pageSize);
                });
            }
        };

        ctrl.loadPrioridades = function() {
            if (ctrl.url) {
                $http({ method: 'GET', url: ctrl.url + '/api/prioridades' }).
                success(function(data) {
                    ctrl.prioridades = data;
                });
            }
        };

        ctrl.loadGerentes = function() {
            if (ctrl.url) {
                $http({ method: 'GET', url: ctrl.url + '/api/usuarios/gerencia' }).
                success(function(data) {
                    ctrl.gerentes = data;
                });
            }
        };

        ctrl.layoutLoaded = function () {
            ctrl.inicio();
        };

        ctrl.save = function() {
            Storage.set('url', ctrl.url);
            Storage.set('unidade', ctrl.unidade);
            Storage.set('usuario', ctrl.usuario);
            Storage.set('senha', ctrl.senha);
            Storage.set('clientId', ctrl.clientId);
            Storage.set('clientSecret', ctrl.clientSecret);
            
            Storage.set('interface.layout', ctrl.interface.layout);
            Storage.set('interface.title', ctrl.interface.title);
            Storage.set('interface.subtitle', ctrl.interface.subtitle);
            Storage.set('interface.columns', ctrl.interface.columns);
            Storage.set('interface.pageSize', ctrl.interface.pageSize);
            Storage.set('interface.blocked', ctrl.interface.blocked ? '1' : '0');
            Storage.set('interface.unblockKey', ctrl.interface.unblockKey);
            Storage.set('interface.print', ctrl.interface.print ? '1' : '0');
            
            var desabilitados = [];
            for (var i = 0; i < ctrl.servicos.length; i++) {
                if (ctrl.servicos[i].hide) {
                    desabilitados.push(ctrl.servicos[i].id);
                }
            }
            Storage.set('desabilitados', JSON.stringify(desabilitados));
            
            ctrl.load();
            $('#config').modal('hide');
            
            blockedMenu = ctrl.interface.blocked;
            unblockKey = ctrl.interface.unblockKey;
        };

        ctrl.load = function() {
            ctrl.loadUnidades();
            ctrl.loadServicos();
            ctrl.loadPrioridades();
            ctrl.loadGerentes();
            
            ctrl.interface = {
                layout: Storage.get('interface.layout') || 'default.html',
                title: Storage.get('interface.title') || 'Triagem touch',
                subtitle: Storage.get('interface.subtitle') || 'Escolha abaixo o serviço que deseja atendimento',
                columns: Storage.get('interface.columns') || '2',
                pageSize: Storage.get('interface.pageSize') || '12',
                blocked: Storage.get('interface.blocked') === '1',
                unblockKey: Storage.get('interface.unblockKey'),
                print: Storage.get('interface.print') === '1' || Storage.get('interface.print') === null,
            };
            
            if (ctrl.url && ctrl.usuario && ctrl.senha && ctrl.clientId) {
                // primeiro verifica se ja possui um token valido para evitar criar token atoa
                OAuth2.url = ctrl.url + '/api';
                OAuth2.accessToken = Storage.get('access_token');
                OAuth2.refreshToken = Storage.get('refresh_token');
                OAuth2.expireTime = Storage.get('expire_time');
                OAuth2.clientId = ctrl.clientId;
                OAuth2.clientSecret = ctrl.clientSecret;
                OAuth2.user = ctrl.usuario;
                OAuth2.pass = ctrl.senha;
                OAuth2.check();
            }
            
            blockedMenu = ctrl.interface.blocked;
            unblockKey = ctrl.interface.unblockKey;
        };

        ctrl.gotoPage = function(page, waitTime) {
            // default is 15 seconds to go back to start page
            waitTime = waitTime || 15;
            

            $('#error').modal('hide');
            $('.page, .page-buttons .buttons').hide();
            var $page = $(page).show();
            $("[data-target='#" + $page.attr('id') + "']").show();
            
            clearInterval(resetInterval);
            if (!$page.hasClass('first')) {
                // volta para a tela inicial quando ocioso
                resetInterval = setTimeout(function () {
                    window.location.reload();
                }, waitTime * 1000);
            }

            ctrl.step(page);
        };

        ctrl.step = function(page){
            const prioridades = $('#prioridades-step');
            const senhas = $('#printing-step');
            const servicos = $('#servicos-step');
            const identificarCooperado = $('#identificarCooperado-step');
            const home = $('#identificacao-step');
            const print = $('#printing-step');

            switch(page){
                case '.page.first':
                    prioridades.hasClass('active') ? prioridades.removeClass('active completed') : '';
                    servicos.hasClass('active') ? servicos.removeClass('active completed') : '';
                    senhas.hasClass('active') ? senhas.removeClass('active completed') : '';
                    identificarCooperado.hasClass('active') || identificarCooperado.hasClass('completed') ? identificarCooperado.removeClass('active completed') : '';
                    home.hasClass('completed') ? home.removeClass('completed').addClass('active') : '';
                break
                case '#identificarCooperado':
                    !identificarCooperado.hasClass('active') ? identificarCooperado.addClass('active') : '';
                    prioridades.hasClass('active') ? prioridades.removeClass(['active', 'completed']) : '';
                    servicos.hasClass('active') ? servicos.removeClass(['active', 'completed']): '';
                    senhas.hasClass('active') ? senhas.removeClass(['active', 'completed']): '';
                    home.hasClass('active') ? home.removeClass('active').addClass('completed') : '';
                break
                case '#servicos':
                    servicos.hasClass('completed') ? servicos.removeClass('completed').addClass('active') : servicos.addClass('active');
                    !identificarCooperado.hasClass('completed') ? identificarCooperado.addClass('completed') : '';
                    !home.hasClass('completed') ? home.addClass('completed') : '';
                    prioridades.hasClass('active') || prioridades.hasClass('completed') ? prioridades.removeClass('active completed') : '';
                    senhas.hasClass('active') ? senhas.removeClass(['active', 'completed']): '';
                    identificarCooperado.hasClass('active') ? identificarCooperado.removeClass('active').addClass('completed') : '';
                break
                case '#prioridades':
                    $(`${page}-step`).toggleClass('active');
                    servicos.hasClass('active') ? servicos.removeClass('active').addClass('completed') : '';
                    senhas.hasClass('active') ?? senhas.removeClass(['active', 'completed']);
                break
                case '#printing':
                    !print.hasClass('active') ? print.addClass('active') : print.removeClass('completed');
                    prioridades.hasClass('active') ? prioridades.removeClass('active').addClass('completed') : '';
                break
            }
        }

        ctrl.inicio = function() {
            ctrl.atendimento = {};
            ctrl.setarCooperado(undefined, undefined);

            ctrl.gotoPage('.page.first');
            if (ctrl.paginator) {
                ctrl.paginator.goto(0);
            }
        };

        ctrl.tipoAtendimento = function(servico) {
            ctrl.servico = servico;
            if(servico == 2) {
                ctrl.gotoPage('#gerentes');
            }else{
                ctrl.gotoPage('#prioridades');
            }
        };

        ctrl.tipoPrioridade = function() {
            ctrl.gotoPage('#prioridades');
        };

        ctrl.distribuiNormal = function() {
            ctrl.distribuiSenha(1);
        };

        ctrl.identificar = function(identificar) {
            if(identificar){
                ctrl.gotoPage('#identificarCooperado');
            }else{
                ctrl.gotoPage('#servicos');
            }
        };

        ctrl.setarCooperado = function(nome, conta) {
            if(!nome && !conta){
                return ctrl.cliente = {
                    nome: '',
                    conta: ''
                }
            }

            ctrl.cliente.nome = nome;
            ctrl.cliente.conta = conta;
        };

        ctrl.buscarCooperado = function(){
            var url = `http://10.54.56.236:3000/conta/${ctrl.conta}`;

            $http({
                method: 'GET',
                url: url,
            }).then(
                function(response){
                    if(response.data.error){
                        ctrl.cliente.error = true;
                        ctrl.cliente.showError = response.data.message;
                        ctrl.gotoPage('#identificarCooperado');
                        return;
                    }
                    ctrl.setarCooperado(response.data.nome, response.data.contacorrente);
                    ctrl.gotoPage('#servicos');
            },
            function(response){
                showError(response.data.error);
            })
        }

        ctrl.distribuiSenha = function(prioridade) {
            var url = ctrl.url + '/api/distribui',
                data = {
                    unidade: parseInt(ctrl.unidade),
                    servico: ctrl.servico,
                    prioridade: prioridade,
                    nome_cliente: ctrl.cliente.nome,
                    doc_cliente: ctrl.cliente.documento,
                    usuario_preference: ctrl.gerente.id != '' ? ctrl.gerente.id : '',
                };

            $http({
                method: 'POST',
                url: url,
                data: $.param(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + OAuth2.accessToken,
                }
            }).then(
                function (response) {
                    if (response.data.error) {
                        showError(response.data.error);
                    } else {
                        ctrl.atendimento = response.data;

                        if (ctrl.interface.print) {
                            Impressao.imprimir(ctrl.atendimento);
                        }
                    }
                    ctrl.gotoPage('#printing', 5);
                }, 
                function (response) {
                    showError(response.data.error);
                }
            );
        };

        ctrl.itemStyleClass = function(index, items) {
            var num = 12 / ctrl.interface.columns,
                styleClass = {};
            
            styleClass['col-xs-12'] = true;
            
            return styleClass;
        };

        ctrl.load();
    });

    var OAuth2 = {

        debug: false,
        accessToken: '',
        refreshToken: '',
        expireTime: null,
        intervalId: 0,
        url: '',
        user: '',
        pass: '',
        clientId: '',
        clientSecret: '',
        
        check: function() {
            $.ajax({
                url: OAuth2.url + '/check',
                data: {
                    access_token: OAuth2.accessToken
                },
                dataType: 'json',
                success: function(response) {
                    if (response.error) {
                        showError(response.error_description);
                    } else {
                        // monitora o token atual
                        OAuth2.listen();
                    }
                },
                error: function() {
                    // solicita um novo token
                    OAuth2.request();
                }
            });
        },
        
        token: function(data, fn) {
            data = data || {};
            data.client_id = OAuth2.clientId;
            data.client_secret = OAuth2.clientSecret;
            $.ajax({
                url: OAuth2.url + '/token',
                type: 'post',
                data: data,
                success: function(response) {
                    if (response.error) {
                        showError(response.error_description);
                    } else {
                        OAuth2.accessToken = response.access_token;
                        var now = new Date().getTime() / 1000;
                        OAuth2.expireTime = now + response.expires_in;
                        if (response.refresh_token) {
                            OAuth2.refreshToken = response.refresh_token;
                        }
                        if (typeof(fn) === 'function') {
                            fn(response);
                        }
                        Storage.set('access_token', OAuth2.accessToken);
                        Storage.set('refresh_token', OAuth2.refreshToken);
                        Storage.set('expire_time', OAuth2.expireTime);
                    }
                },
                error: function(xhr) {
                    var response = $.parseJSON(xhr.responseText);
                    showError(response.error);
                }
            });
        },
        
        request: function() {
            OAuth2.token({
                grant_type: "password",
                username: OAuth2.user,
                password: OAuth2.pass
            }, OAuth2.listen);
        },

        refresh: function() {
            OAuth2.token({
                grant_type: "refresh_token",
                refresh_token: OAuth2.refreshToken
            });
        },

        listen: function() {
            clearInterval(OAuth2.intervalId);
            OAuth2.intervalId = setInterval(function() {
                // pega um token novo 5 minutos antes de expirar
                var now = new Date().getTime() / 1000 + (5 * 60);
                if (now >= OAuth2.expireTime) {
                    OAuth2.refresh();
                }
            }, 60 * 1000);
        }
    };

    var Storage = {
        
        prefix: 'triagemtouch.',

        set: function(name, value) {
            name = this.prefix + name;
            if (localStorage) {
                localStorage.setItem(name, value);
            } else {
                // cookie
                document.cookie = name + "=" + value + "; path=/";
            }
        },
                
        get: function(name) {
            name = this.prefix + name;
            if (localStorage) {
                return localStorage.getItem(name);
            } else {
                // cookie
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for(var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1,c.length);
                    }
                    if (c.indexOf(nameEQ) === 0) {
                        return c.substring(nameEQ.length, c.length);
                    }
                }
            }
            return null;
        }

    };
    
    var Paginator = function(array, pageSize) {
        var items = [];
        
        this.goto = function(pageIndex) {
            if (pageIndex < 0 || pageIndex >= this.totalPages) {
                return;
            }
            this.pageIndex = pageIndex;
            items = [];
            for (var i = this.pageSize * pageIndex, j = 0; j < this.pageSize && i < this.array.length; i++, j++) {
                items.push(array[i]);
            }
        };
        
        this.next = function() {
            this.goto(this.pageIndex + 1);
        };
        
        this.hasNext = function() {
            return this.totalPages > 0 && this.pageIndex < this.totalPages - 1;
        };
        
        this.prev = function() {
            this.goto(this.pageIndex - 1);
        };
        
        this.hasPrev = function() {
            return this.pageIndex > 0;
        };
        
        this.items = function() {
            return items;
        };
        
        // init
        this.array = array || [];
        this.pageSize = pageSize || 12;
        this.totalPages = Math.ceil(this.array.length / this.pageSize);
        this.goto(0);
    };
    
    var Impressao = {
        
        iframeId: 'frame-impressao',
        
        imprimir: function(atendimento) {
            var iframe = document.getElementById(this.iframeId);
            iframe.src = Storage.get('url') + '/print/' + atendimento.id + '/' + atendimento.hash;
        }
        
    };

    var showError = function(msg) {
        $('#error').modal('show').find('.modal-body').html('<p>' + msg + '</p>');
    };
    
    var Menu = {
        
        config: function() {
            $('#config').modal('show');
        },
    
        fullscreen: function() {
            var elem = document.body;
            if (elem.requestFullScreen) {
                elem.requestFullScreen();
            }
            if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen();
            }
            if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            }
            if (elem.msRequestFullScreen) {
                elem.msRequestFullScreen();
            }
        }
    };

    var resetInterval = 0,
        blockedMenu = true,
        unblockKey = 27,
        menu = $('#menu');
        
    menu.find('[data-action]').on('click', function() {
        if (blockedMenu) {
            return;
        }
        var action = $(this).data('action');
        Menu[action]();
    });

    // ocultando e adicionando animacao ao menu
    setTimeout(function() {
        menu.fadeTo("slow", 0, function() {
            menu.hover(
                function() {
                    if (!blockedMenu) {
                        menu.fadeTo("fast", 1);
                    }
                }, 
                function() {
                    menu.fadeTo("slow", 0);
                }
            );
        });
    }, 3000);
    
    $(window).on('keydown', function(e) {
        if (e.keyCode == unblockKey) {
            blockedMenu = false;
            alert('Menu desbloqueado');
        }
    });

})();
