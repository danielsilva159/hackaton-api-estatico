angular.module("hackaton-stefanini").controller("PessoaIncluirAlterarController", PessoaIncluirAlterarController);
PessoaIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function PessoaIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {

    /**ATRIBUTOS DA TELA */
    vm = this;

    vm.pessoa = {
        id: null,
        nome: "",
        email: "",
        dataNascimento: null,
        enderecos: [],
        perfils: [],
        situacao: false
    };
    
    vm.enderecoDefault = {
        id: null,
        idPessoa: null,
        cep: "",
        uf: "",
        localidade: "",
        bairro: "",
        logradouro: "",
        complemento: ""
    };

    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";
    vm.urlEnderecoPessoa = "http://localhost:8080/treinamento/api/enderecos/pessoa/";
    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";
    vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/";

    /**METODOS DE INICIALIZACAO */
    vm.init = function () {

        vm.tituloTela = "Cadastrar Pessoa";
        vm.acao = "Cadastrar";


        /**Recuperar a lista de perfil */
        vm.listar(vm.urlPerfil).then(
            function (response) {
                console.log('escop->'+$scope.$location);
                if (response !== undefined) {
                    vm.listaPerfil = response;
                    if ($routeParams.idPessoa) {
                        vm.tituloTela = "Editar Pessoa";
                        vm.acao = "Editar";

                        vm.recuperarObjetoPorIDURL($routeParams.idPessoa, vm.urlPessoa).then(
                            function (pessoaRetorno) {
                                if (pessoaRetorno !== undefined) {
                                    vm.pessoa = pessoaRetorno;
                                    vm.pessoa.dataNascimento = vm.formataDataTela(pessoaRetorno.dataNascimento);
                                    vm.pessoa.enderecos = vm.consultaEnderecos(pessoaRetorno.id);
                                    vm.perfil = vm.pessoa.perfil;
                                    alert(vm.perfil);
                                   
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
        $location.path("listarPessoas")
    };

    vm.retornarTelaListagem = function () {
       if(pessoa.id){
        vm.pessoa.dataNascimento = vm.formataDataTela(pessoaRetorno.dataNascimento);
        $location.path("EditarPessoas/"+pessoa.id);
       }else{
        $location.path("EditarPessoas/");
       }
        
    };

    vm.abrirModal = function (endereco) {
            if($routeParams.idPessoa){
                if(endereco.idPessoa){
                    //alterando endereço
                    $location.path("EditarEndereco/"+endereco.id);
                }else{
                    //Criando um novo endereço
                    $location.path("cadastrarEndereco/"+endereco.id);
                }
                
            }else{
                $location.path("cadastrarEndereco")
            }
        
        // vm.enderecoModal = vm.enderecoDefault;
        // if (endereco !== undefined)
        //     vm.enderecoModal = endereco;

        // if (vm.pessoa.enderecos.length === 0)
        //     vm.pessoa.enderecos.push(vm.enderecoModal);

        //$("#modalEndereco").modal();
    };

    vm.limparTela = function () {
        $("#modalEndereco").modal("toggle");
        vm.endereco = undefined;
    };

    vm.incluir = function () {
        console.log(vm.pessoa.dataNascimento);
        vm.pessoa.dataNascimento = vm.formataDataJava(vm.pessoa.dataNascimento);

        var objetoDados = angular.copy(vm.pessoa);
        var listaEndereco = [];
        angular.forEach(objetoDados.enderecos, function (value, key) {
            if (value.complemento.length > 0) {
                value.idPessoa = objetoDados.id;
                listaEndereco.push(angular.copy(value));
            }
        });

        objetoDados.enderecos = listaEndereco;
        if (vm.perfil !== null){

            var isNovoPerfil = true;
            
            angular.forEach(objetoDados.perfils, function (value, key) {
                if (value.id === vm.perfil.id) {
                    isNovoPerfil = false;
                }
            });
            if (isNovoPerfil)
            objetoDados.perfils.push(vm.idperfil);
        }
        console.log(objetoDados);
        if (vm.acao == "Cadastrar") {
            //objetoDados.perfils.push(objetoDados.perfil);
            vm.salvar(vm.urlPessoa, objetoDados).then(
                function (pessoaRetorno) {
                    vm.retornarTelaListagem();
                });
        } else if (vm.acao == "Editar") {
            vm.alterar(vm.urlPessoa, objetoDados).then(
                function (pessoaRetorno) {
                    alert("Perfil Alterado com sucesso");
                    vm.retornarTelaListagem();
                });
        }
    };

    vm.remover = function (objeto, tipo) {

        var url = vm.urlPessoa + objeto.id;
        if (tipo === "ENDERECO")
            url = vm.urlEndereco + objeto.id;
        var r = confirm("Você deseja excluir esse endereco ?");
        if(r == true){
        vm.excluir(url).then(
            function (ojetoRetorno) {
                location.reload(); 
            });
        }
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

    vm.consultaEnderecos = function(idPessoa){
        vm.recuperarObjetoPorIDURL(idPessoa, vm.urlEnderecoPessoa).then(
            function (response) {
                if (response !== undefined){
                    vm.pessoa.enderecos = response;
                }
            });
    }
   function incluirPerfil(perfilPessoa){
        console.log(perfilPessoa);
   }
    vm.imagemPessoa = function(imagem){
      
            console.log(imagem);
        
    }


}
