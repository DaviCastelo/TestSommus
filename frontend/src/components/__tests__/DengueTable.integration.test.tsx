import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DengueTable from '../DengueTable';
import { DengueData } from '../../types/dengue';
import { fetchDengueData } from '../../services/dengueService';

// Mock the fetchDengueData function
jest.mock('../../services/dengueService');

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

describe('DengueTable Integration Tests', () => {
  beforeEach(() => {
    (fetchDengueData as jest.Mock).mockReset();
  });

  it('displays alert notification when high alert level is detected', async () => {
    render(<DengueTable data={mockData} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Alerta: 1 semana\(s\) com nível de alerta alto/i)).toBeInTheDocument();
    });
  });

  it('filters data correctly when searching', async () => {
    render(<DengueTable data={mockData} />);
    
    const searchInput = screen.getByRole('textbox', { name: /buscar/i });
    fireEvent.change(searchInput, { target: { value: '2023-40' } });
    
    await waitFor(() => {
      expect(screen.getByText('2023-40')).toBeInTheDocument();
      expect(screen.queryByText('2023-39')).not.toBeInTheDocument();
      expect(screen.queryByText('2023-38')).not.toBeInTheDocument();
    });
  });

  it('sorts data correctly when clicking column headers', async () => {
    render(<DengueTable data={mockData} />);
    
    const header = screen.getByText('Semana Epidemiológica');
    fireEvent.click(header);
    
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('2023-38');
    });
  });

  it('exports data correctly when clicking export button', async () => {
    render(<DengueTable data={mockData} />);
    
    const exportButton = screen.getByRole('button', { name: /exportar/i });
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      const downloadLink = document.querySelector('a[download]');
      expect(downloadLink).toBeInTheDocument();
      expect(downloadLink).toHaveAttribute('download', expect.stringContaining('.csv'));
    });
  });

  it('displays chart with correct data', async () => {
    render(<DengueTable data={mockData} />);
    
    await waitFor(() => {
      const chart = screen.getByRole('img', { name: /evolução dos casos/i });
      expect(chart).toBeInTheDocument();
    });
  });
}); 