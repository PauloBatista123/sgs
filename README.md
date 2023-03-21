# Sistema gerenciador de senhas

Sistema desenvolvido com base na biblioteca opensource NovoSGA ([Github](https://github.com/novosga/novosga "Github")).

### Contribuintes:

<img src="https://avatars.githubusercontent.com/u/43703065?v=4" width="30"/> Walisson Alves
 <img src="https://avatars.githubusercontent.com/u/54727394?s=96&v=4" width="30"/> Paulo Batista
  <img src="https://avatars.githubusercontent.com/u/116644406?v=4" width="30"/> Gabriel Moreira

### Versão:

| Versão  | Data de lançamento  |
| :------------: | :------------: |
| 3.0  |  22/03/2022 |

### Tecnologias

- Bootstrap v5
- FontAwasome v5 (ícones)
- PHP v5.4
- Symfony v2.*
- Doctrine (banco de dados)
- Twig (front)
- Jquery
- Angular v2

# Documentação técnica

O sistema está dividido em três partes: 

**Painel Web**
**Triagem (totem)**
**Administração**

A documentação abaixo será detalhada para fins de consulta da unidade de TI ou envolvidos. Nenhuma alteração deverá ser realizada sem conhecimentos específicos ou autorização de alçada superior.

Quaisquer dúvidas poderão ser sanadas por meio de chamado via GLPI.

## LOGIN

O login deverá ser realizado com base nos usuários cadastrados no AD (LDAP) no servidor `10.54.56.8`. Por padrão após o primeiro login realizado, o sistema irá cadastrar um usuário no banco de dados para vincular aos atendimentos.

A autenticação poderá ser configurada no caminho:
**Administração > Sistema > Autenticação**

### Importante
<span style="color: red; : bold;">As instruções deverão ser executadas por usuário com perfil de acesso com nível de Administrador.</span>

Para o primeiro acesso do usuário, deverá ser vinculado um perfil de acesso no caminho:
**Usuários > Editar > Acesso**
Obrigatório informar Lotação e Perfil de Atendimento.

> Não é possível realizar o reset de senha através do sistema, visto que por padrão está configurado no servidor LDAP.

## USUÁRIOS 


O cadastro poderá ser realizado no módulo específico de **Usuários**.  Após o cadastro de um novo usuário é obrigatório o vinculo na aba **Acesso** com Lotação e Serviços de Atendimento.

##### Exclusão
Exclusão de usuários vinculados com atendimentos ou serviços não é possível.

##### Editar
<span style="text-transform: uppercase; color: red;">**Não é recomendado a edição do nome de usuário vinculado ao AD**. </span>Os demais campos poderão ser editados conforme necessidade. O campo status é habiltado após o primeiro cadastro.

## UNIDADES 

Cadastro das unidade de atendimento do sistema. Unidade de atendimento é o local físico aonde os atendimentos são executados (PA's).

#### CADASTRO

É obrigatório informar todos os campos para cadastrar uma unidade. O campo grupo está vinculado ao módulo **Grupos** e só exibirá grupos que não possuem unidades vinculadas.

#### EDITAR

Não existem restrições.

#### EXCLUIR

Exclusão só é permitida para unidades que não tenham registros vinculados.

## SERVIÇOS 

Cadastro dos serviços que são realizados no sistema. O serviço é um cadastro global, podendo estar disponível ou não nas unidades cadastradas. Um mesmo serviço pode ser atendido em mais de uma unidade (PA).

#### CADASTRO
É obrigatório informar todos os campos, exceto, o campo MACRO. O campo macro se refere ao serviço pai, ou seja, só deverá ser selecionado quando estiver cadastrando um sub-serviço (Ex: Atendimento Macro: Caixa, Sub-serviço: Desconto de Cheque).

#### EDITAR

Não existem restrições.

#### EXCLUIR

Exclusão só é permitida para unidades que não tenham registros vinculados.

##PRIORIDADES 

Cadastro das prioridades de atendimento. Por padrão existem duas prioridades cadastradas: `Sem prioridade` e `Prioridade`. A prioridade possui um campo de peso que influencia na ordem da fila. Sendo por padrão **Sem prioridade** peso 0 e **Prioridade** peso 1.

##MÓDULOS

<span style="color: red; font-size: 24px;">**NÃO DEVE SER REALIZADO ALTERAÇÕES**</span>

##LOCAIS

Cadastro dos locais aonde o atendente realiza o seu atendimento. O local serve para orientar o cliente para que ele saiba para onde se dirigir quando for chamado. Por exemplo: Guichê, sala, mesa.

##GRUPOS

Cadastro dos grupos que serão vinculados às unidades.

##ESTATISTICAS

Módulo responsável por emitir os relatórios do sistema.

##CARGOS

Cadastro dos perfis de acesso ao sistema. Um perfil define quais módulos os usuários poderão acessar. O relacionamento do perfil com o usuário se dar através da lotação, que é a configuração de acesso de um usuário à uma unidade pelo perfil escolhido.

As permissões serão definidas na aba `Permissões` dentro do cadastro do perfil.

##ADMINISTRAÇÃO

Módulo que deverá ser restrito aos usuários com perfil de administrador.

Contém as informações de acesso ao banco de dados e configurações do LDAP. 

Na aba `Triagem` o usuário poderá reiniciar as senhas.

Na aba `API` o usuário terá acesso as configurações de comunicação dos clientes `painel` e `triagem`. Ao realizar o cadastro de um cliente, ficará responsável por realizar a configuração nas partes do sistema. 

<span style="color: red">**IMPORTANTE**</span>
Ao realizar o cadastro de um cliente (PainelTv ou Totem), o redirect URI deverá ser a raiz de acesso ao sistema de administração. No cenário atual: `http://localhost/sga/public`

##TROCAR UNIDADE

Seleção de unidades disponíveis no sistema para atendimento das filas.

##CONFIGURAÇÃO

Módulo para gerenciamento da unidade selecionada pelo usuário. Na aba `Serviços` poderá ser configurado os serviços disponíveis e o local de cada atendimento. Na aba `Triagem` poderá ser reinicializado as senhas de atendimento.

##TRIAGEM

Módulo responsável por gerenciamento de senhas da unidade. 
O usuário poderá selecionar os serviços disponíveis no botão `Configuração`.
No botão `Consultar senha` poderá ser visualizado os detalhes da senha.
Para emitir uma senha manual o usuário deverá selecionar qual tipo de atendimento e a prioridade, ficando opcional o nome e conta do cooperado.

##MONITOR

Módulo para gerenciar as senhas aguardando atendimento. 
As senhas aguaradando serão listadas de acordo com o serviço escolhido. O usuário poderá clicar na senha selecionada para visualizar os detalhes e opções de gerenciamento. 

Serão disponibilizadas as opções `Transferir / Alterar Senha` e `Cancelar Senha`.

<span style="color: red">**IMPORTANTE**</span>: Caso usuário escolha a opção `Cancelar Senha`, o sistema irá disponibilizar a opção de reativação de senha na aba Triagem > consultar senha.

##ATENDIMENTO

Módulo responsável por realizar o atendimento das senhas na unidade.

O primeiro acesso do usuário o sistema irá disponibilizar um botão para seleção do guichê (número). 

####Minha fila

O sistema realiza uma consulta na base de dados para buscar as informações de senhas aguardando atendimento. O usuário não precisará realizar nenhuma ação para atualizar sua fila.

As senhas serão listadas com informações básicas para identificação do atendimento: `Usuário Preferencial`, `Prioridade`, `Serviço`, `Tempo de espera`, `Número da senha` e `Identificação do cooperado`.

As senhas serão ordenadas por peso e tempo de espera. Os pesos serão configurados no módulo **`Prioridades`**.

<span style="color: red">**IMPORTANTE**</span>: Caso haja necessidade de atendimento fora da fila de espera, o usuário poderá clicar na senha desejada e será aberto um modal de detalhes, disponibilizando a opção `Chamar Senha`. 

#### Chamar senha

No canto inferior direito da tela o usuário deverá clicar no botão `Chamar próximo` para iniciar o atendimento da próxima senha (automático). Ao clicar na opção será aberto o painel de atendimento para iniciar ou cancelar o atendimento.

#### Painel de Atendimento
Será exibido o painel com as informações da senha chamada.

`Chamar novamente`: Será emitido alerta no painel com uma nova chamada.
`Iniciar atendimento`: Início do atendimento.
`Não compareceu`: A senha será cancelada.

#### Início do atendimento

Após iniciar o atendimento irá disponibilizar a data de chegada e emissão da senha e as novas opções de:

`Erro de triagem`: O sistema irá disponibilizar o redirecionamento para um outro serviço que o usuário não seja capaz de realizar.
`Encerrar atendimento`: Ao clicar na opção será finalizado o atendimento com as opções de seleção dos serviços realizados. 

