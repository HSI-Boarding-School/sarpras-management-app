'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getInventoryItems } from 'src/lib/db';
import { INVENTORY_BRANCHES } from 'src/_mock/_inventory';

// ----------------------------------------------------------------------

const ITEMS_PER_PAGE = 9;

export function InventoryCardView() {
  const router = useRouter();
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInventoryItems();
        setAllItems(data || []);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter items berdasarkan search term
  const filteredItems = allItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.location?.name || item.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung total pages
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  // Hitung start dan end index
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Get items untuk halaman saat ini
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset ke halaman 1 saat search
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  if (loading) {
    return (
      <Box sx={{ width: '100%', py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', px: 0, py: 4 }}>
      <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Detail Inventaris
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.dashboard.inventory.create)}
          >
            Tambah Barang
          </Button>
        </Box>

        {/* Search Bar */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Cari barang berdasarkan nama atau lokasi..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="mdi:magnify" />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        {/* Results Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Menampilkan {paginatedItems.length > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, filteredItems.length)} dari {filteredItems.length} barang
          </Typography>
        </Box>

        {/* Grid of Cards */}
        {paginatedItems.length > 0 ? (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {paginatedItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => router.push(paths.dashboard.inventory.detail(item.id))}
                  >
                    {/* Image */}
                    <Box
                      sx={{
                        width: '100%',
                        paddingBottom: '70%',
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

                    {/* Content */}
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Name */}
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, noWrap: true }}>
                        {item.name}
                      </Typography>

                      {/* Location */}
                      <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Cabang
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {getBranchLabel(item.branch)}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Lokasi
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.location?.name || item.location}
                          </Typography>
                        </Box>

                        {/* Quantity */}
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Jumlah
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.quantity} unit
                          </Typography>
                        </Box>

                        {/* Status */}
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Status
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Chip
                              label={getStatusLabel(item.status)}
                              color={getStatusColor(item.status)}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>

                    {/* Actions */}
                    <CardActions sx={{ pt: 0, p: 2.5, gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<Iconify icon="mdi:eye" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(paths.dashboard.inventory.detail(item.id));
                        }}
                        fullWidth
                      >
                        Detail
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Iconify icon="mdi:pencil" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(paths.dashboard.inventory.edit(item.id));
                        }}
                        fullWidth
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Iconify icon="mdi:magnify-off" sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              Barang tidak ditemukan
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Coba ubah kata kunci pencarian Anda
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
