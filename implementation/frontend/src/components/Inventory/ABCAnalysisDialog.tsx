import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Close,
  Analytics,
  Download,
  Refresh,
  TrendingUp,
  AttachMoney,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { ABCAnalysis, InventoryItem } from '../../types/inventoryAnalytics';
import { ethiopianInventoryAnalyticsService } from '../../services/ethiopianInventoryAnalyticsService';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ABCAnalysisDialogProps {
  open: boolean;
  onClose: () => void;
  warehouseId?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`abc-tabpanel-${index}`}
      aria-labelledby={`abc-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ABCAnalysisDialog: React.FC<ABCAnalysisDialogProps> = ({
  open,
  onClose,
  warehouseId
}) => {
  const [abcAnalysis, setAbcAnalysis] = useState<ABCAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const fetchAbcAnalysis = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ethiopianInventoryAnalyticsService.getAbcAnalysis(warehouseId);
      setAbcAnalysis(data);
    } catch (err) {
      setError('Failed to load ABC analysis');
      console.error('Error fetching ABC analysis:', err);
    } finally {
      setLoading(false);
    }
  }, [warehouseId]);

  useEffect(() => {
    if (open) {
      fetchAbcAnalysis();
    }
  }, [open, fetchAbcAnalysis]);

  const handleExport = () => {
    console.log('Exporting ABC analysis');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const pieData = abcAnalysis ? [
    { name: 'A Items', value: abcAnalysis.analysis.aValuePercentage, count: abcAnalysis.aItems.length, color: '#ff6b6b' },
    { name: 'B Items', value: abcAnalysis.analysis.bValuePercentage, count: abcAnalysis.bItems.length, color: '#4ecdc4' },
    { name: 'C Items', value: abcAnalysis.analysis.cValuePercentage, count: abcAnalysis.cItems.length, color: '#45b7d1' }
  ] : [];

  const barData = abcAnalysis ? [
    {
      category: 'A Items',
      itemPercentage: abcAnalysis.analysis.aItemsPercentage,
      valuePercentage: abcAnalysis.analysis.aValuePercentage,
      count: abcAnalysis.aItems.length
    },
    {
      category: 'B Items',
      itemPercentage: abcAnalysis.analysis.bItemsPercentage,
      valuePercentage: abcAnalysis.analysis.bValuePercentage,
      count: abcAnalysis.bItems.length
    },
    {
      category: 'C Items',
      itemPercentage: abcAnalysis.analysis.cItemsPercentage,
      valuePercentage: abcAnalysis.analysis.cValuePercentage,
      count: abcAnalysis.cItems.length
    }
  ] : [];

  const renderItemsTable = (items: InventoryItem[], title: string, color: string) => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color, display: 'flex', alignItems: 'center', mb: 2 }}>
        <Analytics sx={{ mr: 1 }} />
        {title} ({items.length} items)
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Current Stock</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell align="right">Annual Usage</TableCell>
              <TableCell align="right">Turnover Rate</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Supplier</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {item.sku}
                  </Typography>
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    {item.currentStock}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  ${item.unitPrice.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    ${item.totalValue.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {item.annualUsage.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${item.turnoverRate.toFixed(1)}x`}
                    color={item.turnoverRate > 3 ? 'success' : item.turnoverRate > 1.5 ? 'warning' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{item.warehouseName}</TableCell>
                <TableCell>{item.supplierName || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
      PaperProps={{ sx: { height: '90vh' } }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Analytics sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6">ABC Analysis Report</Typography>
              <Typography variant="body2" color="textSecondary">
                Inventory classification by value and usage
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={fetchAbcAnalysis} disabled={loading}>
              <Refresh />
            </IconButton>
            <IconButton onClick={handleExport}>
              <Download />
            </IconButton>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : abcAnalysis ? (
          <>
            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: '#fff5f5', border: '1px solid #ff6b6b' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="#c53030" variant="h6" fontWeight="bold">
                          A Items (High Value)
                        </Typography>
                        <Typography variant="h4" color="#c53030">
                          {abcAnalysis.aItems.length}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {abcAnalysis.analysis.aValuePercentage.toFixed(1)}% of total value
                        </Typography>
                      </Box>
                      <TrendingUp sx={{ fontSize: 40, color: '#c53030' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: '#f0fdfa', border: '1px solid #4ecdc4' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="#0d9488" variant="h6" fontWeight="bold">
                          B Items (Medium Value)
                        </Typography>
                        <Typography variant="h4" color="#0d9488">
                          {abcAnalysis.bItems.length}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {abcAnalysis.analysis.bValuePercentage.toFixed(1)}% of total value
                        </Typography>
                      </Box>
                      <InventoryIcon sx={{ fontSize: 40, color: '#0d9488' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: '#eff6ff', border: '1px solid #45b7d1' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="#1d4ed8" variant="h6" fontWeight="bold">
                          C Items (Low Value)
                        </Typography>
                        <Typography variant="h4" color="#1d4ed8">
                          {abcAnalysis.cItems.length}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {abcAnalysis.analysis.cValuePercentage.toFixed(1)}% of total value
                        </Typography>
                      </Box>
                      <AttachMoney sx={{ fontSize: 40, color: '#1d4ed8' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Value Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Items vs Value Comparison
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="itemPercentage" fill="#8884d8" name="Item %" />
                        <Bar dataKey="valuePercentage" fill="#82ca9d" name="Value %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Analysis Insights */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analysis Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        A Items Strategy:
                      </Typography>
                      <Typography variant="body2">
                        Focus on tight inventory control, frequent reviews, and strong supplier relationships. 
                        These items drive most of your inventory value.
                      </Typography>
                    </Alert>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        B Items Strategy:
                      </Typography>
                      <Typography variant="body2">
                        Maintain moderate control with periodic reviews. 
                        Good candidates for automated reordering systems.
                      </Typography>
                    </Alert>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Alert severity="success">
                      <Typography variant="body2" fontWeight="bold">
                        C Items Strategy:
                      </Typography>
                      <Typography variant="body2">
                        Simple controls are sufficient. Consider bulk ordering and 
                        longer review cycles to reduce administrative costs.
                      </Typography>
                    </Alert>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Alert severity="error">
                      <Typography variant="body2" fontWeight="bold">
                        Ethiopian Context:
                      </Typography>
                      <Typography variant="body2">
                        Consider import duties, lead times, and foreign exchange 
                        availability when managing A-class items.
                      </Typography>
                    </Alert>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Detailed Items Tables */}
            <Paper sx={{ width: '100%' }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="abc tabs">
                <Tab label={`A Items (${abcAnalysis.aItems.length})`} sx={{ color: '#c53030' }} />
                <Tab label={`B Items (${abcAnalysis.bItems.length})`} sx={{ color: '#0d9488' }} />
                <Tab label={`C Items (${abcAnalysis.cItems.length})`} sx={{ color: '#1d4ed8' }} />
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                {renderItemsTable(abcAnalysis.aItems, 'A Items - High Value/High Usage', '#c53030')}
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                {renderItemsTable(abcAnalysis.bItems, 'B Items - Medium Value/Medium Usage', '#0d9488')}
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                {renderItemsTable(abcAnalysis.cItems, 'C Items - Low Value/Low Usage', '#1d4ed8')}
              </TabPanel>
            </Paper>
          </>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleExport} startIcon={<Download />}>
          Export Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ABCAnalysisDialog;
