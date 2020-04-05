angular.module("hackaton-stefanini").controller("PerfilIncluirAlterarController", PerfilIncluirAlterarController);
PerfilIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function PerfilIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {

    /**ATRIBUTOS DA TELA */
    vm = this;

    vm.perfil = {
         id: null,
         nome: "",
         descricao: "",
         dataHoraInclusao : "", 
         dataHoraAlteracao: ""
     };
   

    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";
    vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/";

    /**METODOS DE INICIALIZACAO */
    vm.init = function () {

        vm.tituloTela = "Cadastrar Perfil";
        vm.acao = "Cadastrar";
        console.log(vm.perfil);

        /**Recuperar a lista de perfil */
        vm.listar(vm.urlPerfil).then(
            function (response) {
                if (response !== undefined) {
                    vm.listaPerfil = response;
                    if ($routeParams.idPerfil) {
                        vm.tituloTela = "Editar Perfil";
                        vm.acao = "Editar";

                        vm.recuperarObjetoPorIDURL($routeParams.idPerfil, vm.urlPerfil).then(
                            function (perfilRetorno) {
                                if (perfilRetorno !== undefined) {
                                    perfilRetorno.dataHoraInclusao = vm.formataDataTela(perfilRetorno.dataHoraInclusao);
                                    perfilRetorno.dataHoraAlteracao = vm.formataDataTela(perfilRetorno.dataHoraAlteracao);
                                    vm.perfil = perfilRetorno;
                                   
                                }
                            }
                        );
                    }
                }
            }
        );
    };

    /**METODOS DE TELA */
    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

    vm.retornarTelaListagem = function () {
        $location.path("listarPerfis");
    };

    vm.abrirModal = function (perfil) {

        vm.perfilModal = vm.perfil;
        if (perfil !== undefined)
            vm.perfil = perfil;

        if (vm.perfil === 0)
            vm.perfil.push(vm.perfilModal);

        $("#modalPerfil").modal();
    };

    vm.limparTela = function () {
        $("#modalPerfil").modal("toggle");
        vm.endereco = undefined;
    };

    vm.incluir = function () {

        var objetoDados = angular.copy(vm.perfil);
        // if (vm.perfil !== null){

        //     var isNovoPerfil = true;
            
        //     angular.forEach(objetoDados.perfils, function (value, key) {
        //         if (value.id === vm.perfil.id) {
        //             isNovoPerfil = false;
        //         }
        //     });
        //     if (isNovoPerfil)
        //         objetoDados.perfils.push(vm.perfil);
        // }
        var data = vm.dataAtualFormatada();
        if (vm.acao == "Cadastrar") {
            objetoDados.dataHoraInclusao = data;
            objetoDados.dataHoraAlteracao = data;
            vm.salvar(vm.urlPerfil, objetoDados).then(
                function (perfilRetorno) {
                    vm.retornarTelaListagem();
                });
        } else if (vm.acao == "Editar") {
            objetoDados.dataHoraInclusao = vm.formataDataJava(objetoDados.dataHoraInclusao);
            objetoDados.dataHoraAlteracao = data;
            vm.alterar(vm.urlPerfil, objetoDados).then(
                function (perfilRetorno) {
                    vm.retornarTelaListagem();
                });
        }
    };

    vm.remover = function (objeto, tipo) {

        var url = vm.urlPerfil + objeto.id;
        vm.excluir(url).then(
            function (ojetoRetorno) {
                vm.retornarTelaListagem();
            });
    };

    /**METODOS DE SERVICO */
    vm.recuperarObjetoPorIDURL = function (id, url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listarId(url + id).then(
            function (response) {
                if (response.data !== undefined)
                    deferred.resolve(response.data);
                else
                    deferred.resolve(vm.enderecoDefault);
            }
        );
        return deferred.promise;
    };

    vm.listar = function (url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listar(url).then(
            function (response) {
                if (response.data !== undefined) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.salvar = function (url, objeto) {

        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.incluir(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.alterar = function (url, objeto) {

        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.alterar(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                    alert("Salvo com sucesso");
                }
            }
        );
        return deferred.promise;
    }

    vm.excluir = function (url, objeto) {

        var deferred = $q.defer();
        HackatonStefaniniService.excluir(url).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                    alert("Excluido com sucesso")
                }
            }
        );
        return deferred.promise;
    }

    /**METODOS AUXILIARES */
    vm.formataDataJava = function (data) {
        var dia = data.slice(0, 2);
        var mes = data.slice(2, 4);
        var ano = data.slice(4, 8);

        return ano + "-" + mes + "-" + dia+"T00:00:00";
    };

    vm.formataDataTela = function (data) {
        var ano = data.slice(0, 4);
        var mes = data.slice(5, 7);
        var dia = data.slice(8, 10);

        return dia + mes + ano;
    };
    vm.dataAtualFormatada = function (){
        var data = new Date(),
            dia  = data.getDate().toString(),
            diaF = (dia.length == 1) ? '0'+dia : dia,
            mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
            mesF = (mes.length == 1) ? '0'+mes : mes,
            anoF = data.getFullYear();
        return anoF+"-"+mesF+"-"+diaF+"T00:00:00";
    }

    vm.remover = function (id) {

        var liberaExclusao = window.confirm("Deseja excluir esse perfil?");
        if (liberaExclusao)
            HackatonStefaniniService.excluir(vm.urlPerfil + id).then(
                function (response) {
                        vm.init();
                      }
            );
    }

   

}
