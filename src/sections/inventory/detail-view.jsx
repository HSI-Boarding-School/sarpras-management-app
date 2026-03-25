'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getInventoryItemById, deleteInventoryItem } from 'src/lib/db';
import { INVENTORY_BRANCHES } from 'src/_mock/_inventory';

// ----------------------------------------------------------------------

export function InventoryDetailView({ itemId }) {
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInventoryItemById(itemId);
        setItem(data);
      } catch (error) {
        console.error('Error fetching inventory item:', error);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  if (!item) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Barang tidak ditemukan
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push(paths.dashboard.inventory.list)}
              >
                Kembali ke Daftar Barang
              </Button>
            </>
          )}
        </Box>
      </Container>
    );
  }

  const getStatusColor = (status) => {
    return status === 'baik' ? 'success' : 'error';
  };

  const getStatusLabel = (status) => {
    return status === 'baik' ? 'Baik' : 'Rusak';
  };

  const getBranchLabel = (branchValue) => {
    // Handle both object (from database) and string (from mock data)
    if (typeof branchValue === 'object' && branchValue !== null) {
      return branchValue.name || 'Unknown';
    }
    const branch = INVENTORY_BRANCHES.find((b) => b.value === branchValue);
    return branch ? branch.label : branchValue;
  };

  const handleEdit = () => {
    router.push(paths.dashboard.inventory.edit(item.id));
  };

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      try {
        await deleteInventoryItem(item.id);
        router.push(paths.dashboard.inventory.list);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Gagal menghapus barang');
      }
    }
  };

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Detail Barang Inventaris
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="mdi:arrow-left" />}
            onClick={() => router.push(paths.dashboard.inventory.list)}
          >
            Kembali
          </Button>
        </Box>

        {/* Main Card with Image */}
        <Card sx={{ boxShadow: 3 }}>
          <Box
            sx={{
              width: '100%',
              paddingBottom: '75%',
              position: 'relative',
              backgroundColor: '#f5f5f5',
              overflow: 'hidden',
            }}
          >
            {(item.image_url || item.image) ? (
              <Box
                component="img"
                src={item.image_url || item.image}
                alt={item.name}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#e0e0e0',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Tidak ada gambar
                </Typography>
              </Box>
            )}
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Title */}
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              {item.name}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Information Grid */}
            <Grid container spacing={4} sx={{ mb: 3 }}>
              {/* Cabang */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                    Cabang
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {getBranchLabel(item.branch || item.branch_id)}
                  </Typography>
                </Box>
              </Grid>

              {/* Lokasi */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                    Lokasi Barang
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {item.location?.name || item.location}
                  </Typography>
                </Box>
              </Grid>

              {/* Jumlah */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                    Jumlah Barang
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {item.quantity} unit
                  </Typography>
                </Box>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                    Status Barang
                  </Typography>
                  <Chip
                    label={getStatusLabel(item.status)}
                    color={getStatusColor(item.status)}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Grid>

              {/* Tanggal Dibuat */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                    Tanggal Dibuat
                  </Typography>
                  <Typography variant="body1">
                    {new Date(item.created_at || item.createdAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            {item.description && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600 }}>
                  Deskripsi
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {item.description}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mdi:pencil" />}
                onClick={handleEdit}
                size="large"
              >
                Edit
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="mdi:trash" />}
                onClick={handleDelete}
                size="large"
              >
                Hapus
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
