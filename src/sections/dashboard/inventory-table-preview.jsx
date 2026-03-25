'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

// ----------------------------------------------------------------------

export function InventoryTablePreview({ items }) {
  const getStatusColor = (status) => {
    return status === 'baik' ? 'success' : 'error';
  };

  const getStatusLabel = (status) => {
    return status === 'baik' ? 'Baik' : 'Rusak';
  };

  return (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
