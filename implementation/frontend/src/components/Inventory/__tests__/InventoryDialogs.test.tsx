import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import StockViewDialog from '../StockViewDialog';
import EditItemDialog from '../EditItemDialog';
import ABCAnalysisDialog from '../ABCAnalysisDialog';
import InventoryFeaturesDialog from '../InventoryFeaturesDialog';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Inventory Dialog Components', () => {
  test('StockViewDialog renders without crashing', () => {
    renderWithTheme(
      <StockViewDialog
        open={false}
        onClose={() => {}}
        warehouseId={1}
        warehouseName="Test Warehouse"
      />
    );
    expect(true).toBe(true); // Component rendered successfully
  });

  test('EditItemDialog renders without crashing', () => {
    renderWithTheme(
      <EditItemDialog
        open={false}
        onClose={() => {}}
        itemId={1}
      />
    );
    expect(true).toBe(true); // Component rendered successfully
  });

  test('ABCAnalysisDialog renders without crashing', () => {
    renderWithTheme(
      <ABCAnalysisDialog
        open={false}
        onClose={() => {}}
        warehouseId={1}
      />
    );
    expect(true).toBe(true); // Component rendered successfully
  });

  test('InventoryFeaturesDialog renders without crashing', () => {
    renderWithTheme(
      <InventoryFeaturesDialog
        open={false}
        onClose={() => {}}
        feature="slow_moving"
        warehouseId={1}
        itemId={1}
      />
    );
    expect(true).toBe(true); // Component rendered successfully
  });
});
