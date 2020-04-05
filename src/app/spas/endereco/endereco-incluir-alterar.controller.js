angular.module("hackaton-stefanini").controller("EnderecoIncluirAlterarController", EnderecoIncluirAlterarController);
EnderecoIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function EnderecoIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {

    /**ATRIBUTOS DA TELA */
    vm = this;
    
   
    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";
    vm.urlEnderecoCep = "http://localhost:8080/treinamento/api/enderecos/cep/";
    vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/";

    /**METODOS DE INICIALIZACAO */
    vm.init = function () {

        vm.tituloTelaEndereco = "Cadastrar Endereço";
        vm.acao = "Cadastrar Endereco";

        vm.listar(vm.urlEndereco).then(
            function (response) {
                if (response !== undefined) {
                    vm.listaEndereco = response;
                        if ($routeParams.idEndereco) {
                        vm.tituloTelaEndereco = "Editar Endereco";
                        vm.acao = "Editar Endereco";
                        vm.recuperarObjetoPorIDURL($routeParams.idEndereco, vm.urlEndereco).then(
                            function(enderecoRetorno){
                                if(enderecoRetorno.id!== null){
                                    vm.endereco = enderecoRetorno;
                                }else{
                                    enderecoRetorno.idPessoa = $routeParams.idPessoa;
                                    vm.endereco = enderecoRetorno;
                                }
                            }  
                        );
                    }
                }        
            }
        );
    }

    /**METODOS DE TELA */
    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

    vm.retornarTelaListagem = function () {
        $location.path("EditarPessoas/"+vm.endereco.idPessoa);
    };

    vm.limparTela = function () {
        $("#modalEndereco").modal("toggle");
        vm.endereco = undefined;
    };

    vm.incluir = function (endereco) {
        if(vm.endereco.complemento == ""){
            vm.endereco.complemento = "Sem Complemento";
        } 
        var objetoDados = angular.copy(endereco);
        if (vm.acao == "Cadastrar Endereco") {

            vm.salvar(vm.urlEndereco, objetoDados).then(
                function (pessoaRetorno) {
                    vm.retornarTelaListagem();
                });
        } else if (vm.acao == "Editar Endereco") {
            vm.alterar(vm.urlEndereco, objetoDados).then(
                function (pessoaRetorno) {
                    vm.retornarTelaListagem();
                });
        }
    };

    vm.remover = function (objeto, tipo) {

        var url = vm.urlPessoa + objeto.id;
        if (tipo === "ENDERECO")
            url = vm.urlEndereco + objeto.id;

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
                }
            }
        );
        return deferred.promise;
    }
    vm.consultaCEP = function(cep){
        vm.recuperarObjetoPorIDURL(cep, vm.urlEnderecoCep).then(
            function (response) {
                if (response.cep){
                  vm.endereco.bairro = response.bairro;
                   vm.endereco.cep = response.cep;
                   vm.endereco.logradouro = response.logradouro;
                   vm.endereco.complemento = response.complemento;
                   vm.endereco.uf = response.uf;
                  vm.endereco.localidade = response.localidade;
                  if(!vm.endereco.idPessoa){vm.endereco.idPessoa = $routeParams.idPessoa;}
                }else{
                    alert("Esse CEP não existe");
                    vm.endereco.cep = null; 
                    focus(vm.endereco.cep);
                }
            }
        )}
       //endereco = $location.path(vm.urlEndereco+"cep/"+cep);

    vm.listaUF = [
        { "id": "RO", "desc": "RO" },
        { "id": "AC", "desc": "AC" },
        { "id": "AM", "desc": "AM" },
        { "id": "RR", "desc": "RR" },
        { "id": "PA", "desc": "PA" },
        { "id": "AP", "desc": "AP" },
        { "id": "TO", "desc": "TO" },
        { "id": "MA", "desc": "MA" },
        { "id": "PI", "desc": "PI" },
        { "id": "CE", "desc": "CE" },
        { "id": "RN", "desc": "RN" },
        { "id": "PB", "desc": "PB" },
        { "id": "PE", "desc": "PE" },
        { "id": "AL", "desc": "AL" },
        { "id": "SE", "desc": "SE" },
        { "id": "BA", "desc": "BA" },
        { "id": "MG", "desc": "MG" },
        { "id": "ES", "desc": "ES" },
        { "id": "RJ", "desc": "RJ" },
        { "id": "SP", "desc": "SP" },
        { "id": "PR", "desc": "PR" },
        { "id": "SC", "desc": "SC" },
        { "id": "RS", "desc": "RS" },
        { "id": "MS", "desc": "MS" },
        { "id": "MT", "desc": "MT" },
        { "id": "GO", "desc": "GO" },
        { "id": "DF", "desc": "DF" }
    ];

}
