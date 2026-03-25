'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
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

import { getReports, deleteReport } from 'src/lib/db';

// ----------------------------------------------------------------------

export function ReportsListView() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReports();
        setReports(data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setReports([]);
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
      await deleteReport(deleteId);
      setReports(reports.filter((report) => report.id !== deleteId));
      setOpenDialog(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Gagal menghapus laporan');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  const handleDownload = (report) => {
    // Simulasi download
    console.log('Download:', report.file_url);
    alert(`Mengunduh: ${report.title}`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Daftar Laporan
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.dashboard.reports.create)}
          >
            Buat Laporan
          </Button>
        </Box>

        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : reports.length === 0 ? (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                Belum ada laporan. Buat laporan baru untuk memulai.
              </Typography>
            ) : (
              <List>
                {reports.map((report) => (
                  <ListItem
                    key={report.id}
                    divider
                    onClick={() => router.push(paths.dashboard.reports.detail(report.id))}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <ListItemText
                      primary={report.title}
                      secondary={`Dibuat: ${new Date(report.created_at).toLocaleDateString('id-ID')}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(report);
                        }}
                        title="Unduh"
                        sx={{ mr: 1 }}
                      >
                        <Iconify icon="mdi:download" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(paths.dashboard.reports.edit(report.id));
                        }}
                        title="Edit"
                        sx={{ mr: 1 }}
                      >
                        <Iconify icon="mdi:pencil" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(report.id);
                        }}
                        title="Hapus"
                        sx={{ color: 'error.main' }}
                      >
                        <Iconify icon="mdi:trash" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.
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
