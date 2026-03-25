'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getInventoryItems, deleteInventoryItem } from 'src/lib/db';

// ----------------------------------------------------------------------

export function InventoryListView() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteInventoryItem(deleteId);
      setItems(items.filter((item) => item.id !== deleteId));
      setOpenDialog(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Gagal menghapus barang');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  const getStatusColor = (status) => {
    return status === 'baik' ? 'success' : 'error';
  };

  const getStatusLabel = (status) => {
    return status === 'baik' ? 'Baik' : 'Rusak';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Daftar Inventaris
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.dashboard.inventory.create)}
          >
            Tambah Barang
          </Button>
        </Box>

        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : items.length === 0 ? (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                Belum ada barang. Tambahkan barang baru untuk memulai.
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Nama Barang</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Lokasi</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        Jumlah
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="center">
                        Aksi
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.location?.name || item.location}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(item.status)}
                            color={getStatusColor(item.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => router.push(paths.dashboard.inventory.detail(item.id))}
                            title="Lihat Detail"
                          >
                            <Iconify icon="mdi:eye" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => router.push(paths.dashboard.inventory.edit(item.id))}
                            title="Edit"
                          >
                            <Iconify icon="mdi:pencil" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(item.id)}
                            title="Hapus"
                            sx={{ color: 'error.main' }}
                          >
                            <Iconify icon="mdi:trash" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus barang ini? Tindakan ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
