'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getInventoryItems } from 'src/lib/db';

import { InventoryTablePreview } from './inventory-table-preview';

// ----------------------------------------------------------------------

export function DashboardView() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInventoryItems();
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateSummary = () => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const damagedItems = items.filter((item) => item.status === 'rusak').length;

    return {
      totalItems: Number(totalItems) || 0,
      totalQuantity: Number(totalQuantity) || 0,
      damagedItems: Number(damagedItems) || 0,
      goodItems: Number(totalItems - damagedItems) || 0,
    };
  };

  const summary = calculateSummary();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Dashboard Inventaris HSI Boarding School
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Total Barang', value: summary.totalItems, color: '#1976d2' },
            { title: 'Total Jumlah', value: summary.totalQuantity, color: '#388e3c' },
            { title: 'Barang Baik', value: summary.goodItems, color: '#0288d1' },
            { title: 'Barang Rusak', value: summary.damagedItems, color: '#d32f2f' },
          ].map((card, index) => (
            <Grid key={index} xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: card.color,
                      fontSize: '2rem',
                    }}
                  >
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Inventory Preview Table */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Data Barang Terbaru
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push(paths.dashboard.inventory.list)}
              >
                Lihat Semua
              </Button>
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <InventoryTablePreview items={items.slice(0, 5)} />
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
