import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DengueTable from '../DengueTable';
import { DengueData } from '../../types/dengue';

const mockData: DengueData[] = [
  {
    semana_epidemiologica: '2023-40',
    casos_est: 45,
    casos_notificados: 38,
    nivel_alerta: 2
  },
  {
    semana_epidemiologica: '2023-39',
    casos_est: 50,
    casos_notificados: 42,
    nivel_alerta: 2
  },
  {
    semana_epidemiologica: '2023-38',
    casos_est: 55,
    casos_notificados: 47,
    nivel_alerta: 3
  }
];

describe('DengueTable Component', () => {
  beforeEach(() => {
    render(<DengueTable data={mockData} />);
  });

  it('renders data correctly', () => {
    expect(screen.getByText('2023-40')).toBeInTheDocument();
    expect(screen.getByText('2023-39')).toBeInTheDocument();
    expect(screen.getByText('2023-38')).toBeInTheDocument();
  });

  it('handles sorting', () => {
    const header = screen.getByText('Semana Epidemiológica');
    fireEvent.click(header);
    
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('2023-38'); // First data row should be 2023-38 after sorting
  });

  it('handles search', () => {
    const searchInput = screen.getByRole('textbox', { name: /buscar/i });
    fireEvent.change(searchInput, { target: { value: '2023-40' } });
    
    expect(screen.getByText('2023-40')).toBeInTheDocument();
    expect(screen.queryByText('2023-39')).not.toBeInTheDocument();
  });

  it('exports data when export button is clicked', () => {
    const exportButton = screen.getByRole('button', { name: /exportar/i });
    fireEvent.click(exportButton);
    
    expect(document.querySelector('a[download]')).toBeInTheDocument();
  });
}); 