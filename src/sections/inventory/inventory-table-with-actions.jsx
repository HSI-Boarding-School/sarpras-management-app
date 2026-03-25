'use client';

import { useState } from 'react';

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
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { INVENTORY_BRANCHES } from 'src/_mock/_inventory';
import { deleteInventoryItem } from 'src/lib/db';

export function InventoryTableWithActions({ items, onDelete }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteInventoryItem(deleteId);
      if (onDelete) {
        onDelete(deleteId);
      }
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

  const getBranchLabel = (branchValue) => {
    // Handle both object (from database) and string (from mock data)
    if (typeof branchValue === 'object' && branchValue !== null) {
      return branchValue.name || 'Unknown';
    }
    const branch = INVENTORY_BRANCHES.find((b) => b.value === branchValue);
    return branch ? branch.label : branchValue;
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Nama Barang</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cabang</TableCell>
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
                <TableCell>{getBranchLabel(item.branch)}</TableCell>
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
    </>
  );
}
