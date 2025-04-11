# Sistema de Monitoramento de Dengue - Sommus

Sistema de monitoramento de casos de dengue para Belo Horizonte, desenvolvido como parte do teste técnico para a Sommus Sistemas.

## 🚀 Funcionalidades

- **Coleta de Dados**: Captura automática de dados da API AlertaDengue para Belo Horizonte
- **Visualização de Dados**: 
  - Tabela interativa com filtros e ordenação
  - Gráficos de evolução dos casos
  - Cards informativos por semana epidemiológica
- **Alertas**: Sistema de notificações para níveis de alerta alto
- **Exportação**: Exportação de dados em formato CSV
- **Cache**: Sistema de cache para melhorar a performance
- **Responsividade**: Interface adaptável para diferentes dispositivos

## 🛠️ Tecnologias Utilizadas

### Backend
- .NET 6.0
- C#
- MySQL
- Entity Framework Core
- Swagger/OpenAPI

### Frontend
- React 18
- TypeScript
- Material UI
- Recharts
- Jest e React Testing Library

### Infraestrutura
- Docker
- Docker Compose

## 📋 Pré-requisitos

- .NET 6.0 SDK
- Node.js 16+
- MySQL 8.0
- Docker e Docker Compose (opcional)

## 🔧 Configuração do Ambiente

### Usando Docker (Recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/sommus-dengue.git
cd sommus-dengue
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Inicie os containers:
```bash
docker-compose up -d
```

4. Acesse a aplicação:
- Frontend: http://localhost:5173/
- Backend: http://localhost:5190
- Swagger: http://localhost:5190/swagger/index.html

### Configuração Manual

#### Backend

1. Execute a aplicação:
```bash
cd SommusDengue.API
dotnet build
dotnet run
```

#### Frontend

1. Instale as dependências:
```bash
cd frontend
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Execute a aplicação:
```bash
npm run dev
```

## 📊 Estrutura do Projeto

```
sommus-dengue/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Serviços e APIs
│   │   ├── types/          # Definições de tipos TypeScript
│   │   └── __tests__/      # Testes
│   └── package.json
├── SommusDengue.API/        # API .NET
│   ├── Controllers/         # Controladores da API
│   ├── Services/            # Serviços de negócio
│   ├── Repositories/        # Camada de acesso a dados
│   └── Models/              # Modelos de dados
├── scripts/                 # Scripts Python para coleta de dados
└── docker-compose.yml       # Configuração Docker
```

## 🧪 Testes

### Backend (.NET)

1. **Estrutura de Testes**
```bash
cd SommusDengue.API
dotnet new xunit -n SommusDengue.Tests
```

2. **Exemplo de Teste para o Serviço de Dengue**
```csharp
using Xunit;
using Moq;
using SommusDengue.API.Services;
using SommusDengue.API.Models;

public class DengueServiceTests
{
    private readonly Mock<IDengueRepository> _mockRepository;
    private readonly DengueService _service;

    public DengueServiceTests()
    {
        _mockRepository = new Mock<IDengueRepository>();
        _service = new DengueService(_mockRepository.Object);
    }

    [Fact]
    public async Task GetDengueDataByWeek_ShouldReturnData_WhenWeekExists()
    {
        // Arrange
        var expectedData = new DengueAlert
        {
            SemanaEpidemiologica = 1,
            CasosEstimados = 100,
            NivelAlerta = 2
        };
        _mockRepository.Setup(r => r.GetByWeek(1, 2024))
            .ReturnsAsync(expectedData);

        // Act
        var result = await _service.GetDengueDataByWeek(1, 2024);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedData.SemanaEpidemiologica, result.SemanaEpidemiologica);
        Assert.Equal(expectedData.CasosEstimados, result.CasosEstimados);
    }
}
```

### Frontend (React/TypeScript)

1. **Testando Componentes**
```typescript
// DengueTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DengueTable } from '../DengueTable';
import { DengueData } from '../types/dengue';

describe('DengueTable', () => {
    const mockData: DengueData[] = [
        {
            semanaEpidemiologica: 1,
            casosEstimados: 100,
            nivelAlerta: 2,
            dataIniSETimestamp: 1234567890
        }
    ];

    it('should render table with data', () => {
        render(<DengueTable data={mockData} />);
        
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });
});
```

2. **Testando Serviços**
```typescript
// dengueService.test.ts
import { fetchDengueData, getCachedData } from '../services/dengueService';

describe('dengueService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should fetch data from API', async () => {
        const mockResponse = {
            semanaEpidemiologica: 1,
            casosEstimados: 100
        };
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const result = await fetchDengueData(1, 2024);
        
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/dengue/week/1/2024')
        );
    });
});
```

### Executando os Testes

1. **Backend (.NET)**
```bash
cd SommusDengue.API
dotnet test
```

2. **Frontend (React)**
```bash
cd frontend
npm test
```

Para ver a cobertura de testes:
```bash
npm run test:coverage
```

### Boas Práticas para Testes

1. **Arrange-Act-Assert (AAA)**
   - Arrange: Prepare os dados e condições necessárias
   - Act: Execute a ação que está sendo testada
   - Assert: Verifique se o resultado é o esperado

2. **Nomes Descritivos**
   - Use nomes que descrevam o que está sendo testado
   - Exemplo: `should_return_error_when_invalid_week_provided`

3. **Isolamento**
   - Cada teste deve ser independente
   - Use mocks para dependências externas
   - Limpe o estado entre os testes

4. **Cobertura**
   - Teste casos de sucesso e erro
   - Teste edge cases
   - Mantenha uma boa cobertura de código

5. **Manutenção**
   - Mantenha os testes atualizados
   - Refatore testes quando o código muda
   - Use helpers e fixtures para código repetitivo

### Ferramentas Úteis

1. **Backend**
   - xUnit: Framework de testes
   - Moq: Biblioteca para mocking
   - FluentAssertions: Melhora a legibilidade das asserções

2. **Frontend**
   - Jest: Framework de testes
   - React Testing Library: Biblioteca para testar componentes React
   - MSW: Mock Service Worker para simular chamadas API

## 🔄 Melhorias Recentes

- **Sistema de Cache**: Implementado cache local para melhorar a performance
- **Notificações**: Adicionado sistema de alertas para níveis de dengue alto
- **Testes**: Expandidos testes unitários e de integração
- **UI/UX**: Melhorias na interface e experiência do usuário
- **Performance**: Otimizações de renderização e carregamento de dados

## 📝 Documentação da API

A documentação completa da API está disponível através do Swagger em:
```
http://localhost:5000/swagger
```

### Endpoints Principais

- `GET /api/dengue/week/{ew}/{ey}`: Consulta dados por semana epidemiológica
- `GET /api/dengue/latest`: Retorna dados das últimas 3 semanas
- `GET /api/dengue/export`: Exporta dados em formato CSV

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request


## 👥 Autores

- Davi Gomes Castelo - davicastelo230800@gmail.com

## 🙏 Agradecimentos

- API AlertaDengue pela disponibilização dos dados
- Sommus Sistemas pelo teste técnico desafiador
