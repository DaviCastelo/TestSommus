# SommusDengue - Sistema de Monitoramento de Dengue

Este projeto é uma aplicação para monitoramento de casos de dengue em Belo Horizonte, utilizando dados da API AlertaDengue.

## Tecnologias Utilizadas

### Backend
- .NET 7.0
- Entity Framework Core
- MySQL
- Swagger para documentação da API

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- Recharts para visualização de dados
- Axios para requisições HTTP

## Pré-requisitos

1. .NET SDK 7.0
   ```bash
   # Verifique a instalação com
   dotnet --version
   ```

2. MySQL Server 8.0 ou superior
   - Instale o MySQL Server
   - Mantenha as credenciais de acesso (usuário e senha)

3. Node.js 16+ e npm
   ```bash
   # Verifique as instalações com
   node --version
   npm --version
   ```

## Configuração do Ambiente

### 1. Banco de Dados

1. Abra o MySQL Workbench ou o terminal MySQL e execute:
   ```sql
   CREATE DATABASE DengueDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Atualize a string de conexão em `SommusDengue.API/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=DengueDB;User=seu_usuario;Password=sua_senha;"
     }
   }
   ```

### 2. Backend (API)

1. Navegue até a pasta da API:
   ```bash
   cd SommusDengue.API
   ```

2. Restaure os pacotes:
   ```bash
   dotnet restore
   ```

3. Execute o projeto:
   ```bash
   dotnet run
   ```

A API estará disponível em `http://localhost:5190`

### 3. Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd sommus-dengue-web
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o projeto:
   ```bash
   npm run dev
   ```

O frontend estará disponível em `http://localhost:5173`

## Testando a Aplicação

### 1. Dados de Teste

Execute os seguintes comandos SQL para inserir dados de teste:

```sql
USE DengueDB;

INSERT INTO DengueAlerts 
(SemanaEpidemiologica, DataIniSETimestamp, CasosEstimados, CasosEstimadosMin, CasosEstimadosMax, 
CasosNotificados, ProbabilidadeRt1, IncidenciaPor100k, NivelAlerta, NumeroReprodutivoEfetivo, 
Populacao, Receptividade, Transmissao, NivelIncidencia, NotificacoesAcumuladasAno)
VALUES 
-- Semana atual (14)
(14, 1712534400000, 45.5, 35, 55, 42, 0.75, 15.2, 2, 0.95, 2523794, 1, 1, 1, 150),

-- Semana anterior (13)
(13, 1711929600000, 38.2, 30, 48, 35, 0.68, 12.8, 1, 0.88, 2523794, 1, 1, 1, 115),

-- Duas semanas atrás (12)
(12, 1711324800000, 52.8, 42, 65, 48, 0.82, 17.5, 2, 1.05, 2523794, 2, 1, 2, 85);
```

### 2. Testando a API

Você pode testar a API de três maneiras:

1. **Usando o Swagger**
   - Acesse `http://localhost:5190/swagger`
   - Teste os endpoints diretamente pela interface do Swagger

2. **Usando o cURL**
   ```bash
   # Buscar últimas 3 semanas
   curl -X GET "http://localhost:5190/api/dengue/last-three-weeks"

   # Buscar semana específica
   curl -X GET "http://localhost:5190/api/dengue/week?ew=14&ey=2024"

   # Sincronizar dados com a API AlertaDengue
   curl -X GET "http://localhost:5190/api/dengue/sync"
   ```

3. **Usando o Postman ou similar**
   - Importe a coleção de endpoints (disponível em `/docs/postman-collection.json`)
   - Execute as requisições pela interface do Postman

### 3. Endpoints Disponíveis

1. `GET /api/dengue/sync`
   - Sincroniza dados dos últimos 6 meses da API AlertaDengue
   - Resposta: Mensagem de sucesso

2. `GET /api/dengue/week?ew={semana}&ey={ano}`
   - Retorna dados de uma semana específica
   - Parâmetros:
     - `ew`: Semana epidemiológica (1-53)
     - `ey`: Ano (ex: 2024)
   - Exemplo de requisição:
     ```
     GET /api/dengue/week?ew=14&ey=2024
     ```
   - Exemplo de resposta:
     ```json
     {
       "semana_epidemiologica": "2024-14",
       "casos_est": 45.5,
       "casos_notificados": 42,
       "nivel_alerta": 2
     }
     ```

3. `GET /api/dengue/last-three-weeks`
   - Retorna dados das últimas 3 semanas
   - Exemplo de resposta:
     ```json
     [
       {
         "semana_epidemiologica": "2024-14",
         "casos_est": 45.5,
         "casos_notificados": 42,
         "nivel_alerta": 2
       },
       {
         "semana_epidemiologica": "2024-13",
         "casos_est": 38.2,
         "casos_notificados": 35,
         "nivel_alerta": 1
       },
       {
         "semana_epidemiologica": "2024-12",
         "casos_est": 52.8,
         "casos_notificados": 48,
         "nivel_alerta": 2
       }
     ]
     ```

Níveis de Alerta:
- 1: Verde (Normal)
- 2: Amarelo (Atenção)
- 3: Laranja (Alerta)
- 4: Vermelho (Emergência)

### 4. Testando o Frontend

1. Acesse `http://localhost:5173` no navegador
2. Verifique se os dados estão sendo exibidos corretamente:
   - Gráfico de evolução dos casos
   - Cards com informações das últimas 3 semanas
   - Indicadores visuais de nível de alerta

## Estrutura do Projeto

```
SommusDengue/
├── SommusDengue.API/           # Backend
│   ├── Controllers/            # Controladores da API
│   ├── Models/                 # Modelos de dados
│   ├── Services/              # Serviços
│   └── Data/                  # Contexto e repositórios
│
└── sommus-dengue-web/         # Frontend
    ├── src/
    │   ├── components/        # Componentes React
    │   ├── services/         # Serviços de API
    │   └── types/           # Tipos TypeScript
    └── public/              # Arquivos estáticos
```

## Solução de Problemas

1. **Erro de CORS**
   - Verifique se o backend está rodando na porta correta
   - Confirme se as configurações de CORS estão corretas no `Program.cs`

2. **Erro de Conexão com Banco**
   - Verifique se o MySQL está rodando
   - Confirme as credenciais em `appsettings.json`
   - Verifique se o banco de dados foi criado

3. **Erro 500 na API**
   - Verifique os logs do backend
   - Confirme se a tabela foi criada corretamente
   - Verifique se há dados no banco

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. # TestSommus
