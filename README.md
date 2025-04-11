# Sistema de Monitoramento de Dengue - BH

Este projeto consiste em um sistema de monitoramento de casos de dengue em Belo Horizonte, com coleta automática de dados do InfoDengue e visualização através de uma interface web moderna.

## Estrutura do Projeto

O projeto é dividido em três partes principais:

1. **Coletor de Dados** (Python)
   - Script que coleta dados da API do InfoDengue
   - Armazena os dados em um banco MySQL
   - Atualiza automaticamente os dados das últimas semanas

2. **API Backend** (C# / .NET)
   - Fornece endpoints REST para acesso aos dados
   - Gerencia a sincronização com o banco de dados
   - Implementa lógica de negócios e transformação de dados
   - Documentação Swagger disponível em: http://localhost:5190/swagger

3. **Interface Web** (React / TypeScript)
   - Visualização interativa dos dados
   - Gráficos e tabelas dinâmicas
   - Interface responsiva e moderna

## Pré-requisitos

- Python 3.8 ou superior
- .NET 7.0 SDK
- Node.js 18 ou superior
- MySQL 8.0 ou superior
- Git

## Configuração do Ambiente

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/sommus-dengue.git
cd sommus-dengue
```

2. **Configure o banco de dados MySQL**
```sql
CREATE DATABASE denguedb;
USE denguedb;

CREATE TABLE denguealerts (
    Id BIGINT PRIMARY KEY AUTO_INCREMENT,
    SemanaEpidemiologica INT NOT NULL,
    DataIniSETimestamp BIGINT NOT NULL,
    CasosEstimados DECIMAL(10,2) NOT NULL,
    CasosEstimadosMin DECIMAL(10,2) NOT NULL,
    CasosEstimadosMax DECIMAL(10,2) NOT NULL,
    CasosNotificados INT NOT NULL,
    ProbabilidadeRt1 DECIMAL(10,2) NOT NULL,
    IncidenciaPor100k DECIMAL(10,2) NOT NULL,
    NivelAlerta INT NOT NULL,
    NumeroReprodutivoEfetivo DECIMAL(10,2) NOT NULL,
    Populacao INT NOT NULL,
    Receptividade INT NOT NULL,
    Transmissao INT NOT NULL,
    NivelIncidencia INT NOT NULL,
    NotificacoesAcumuladasAno INT NOT NULL,
    CONSTRAINT UK_SemanaAno UNIQUE (SemanaEpidemiologica, DataIniSETimestamp)
);
```

3. **Configure o Coletor de Dados (Python)**
```bash
cd python
# Crie um ambiente virtual
python -m venv venv
# Ative o ambiente virtual
# No Windows:
venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente no arquivo .env
MYSQL_HOST=localhost
MYSQL_USER=seu_usuario
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=denguedb
```

4. **Configure a API Backend (.NET)**
```bash
cd SommusDengue.API
# Restaure os pacotes
dotnet restore
# Atualize o arquivo appsettings.json com a string de conexão do banco
```

5. **Configure a Interface Web (React)**
```bash
cd sommus-dengue-web
# Instale as dependências
npm install
```

## Executando o Projeto

1. **Inicie o Coletor de Dados**
```bash
cd python
# Ative o ambiente virtual se ainda não estiver ativo
python dengue_data_collector.py
```

2. **Inicie a API Backend**
```bash
cd SommusDengue.API
dotnet run
```

3. **Inicie a Interface Web**
```bash
cd sommus-dengue-web
npm start
```

## Uso

1. Acesse a interface web em `http://localhost:3000`
2. Clique no botão "SINCRONIZAR DADOS" para atualizar os dados do InfoDengue
3. Visualize os dados através dos diferentes componentes:
   - Gráfico de evolução dos casos
   - Cards com informações das últimas 3 semanas
   - Tabela detalhada com todos os dados

## Funcionalidades

- **Visualização de Dados**
  - Gráfico de linha mostrando a evolução dos casos estimados e notificados
  - Cards informativos com dados resumidos das últimas semanas
  - Tabela detalhada com todas as informações coletadas

- **Sincronização Automática**
  - Botão para sincronização manual dos dados
  - Coleta automática de dados do InfoDengue
  - Atualização do banco de dados sem duplicatas

- **Indicadores**
  - Nível de alerta por semana
  - Casos estimados e notificados
  - Índices de transmissão e receptividade
  - Número reprodutivo efetivo
  - Incidência por 100 mil habitantes

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das mudanças (`git commit -am 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
