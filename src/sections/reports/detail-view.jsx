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
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getReportById, deleteReport } from 'src/lib/db';

// ----------------------------------------------------------------------

export function ReportsDetailView({ reportId }) {
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReportById(reportId);
        setReport(data);
      } catch (error) {
        console.error('Error fetching report:', error);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportId]);

  if (!report) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Laporan tidak ditemukan
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push(paths.dashboard.reports.root)}
              >
                Kembali ke Daftar Laporan
              </Button>
            </>
          )}
        </Box>
      </Container>
    );
  }

  const handleDownload = () => {
    // Simulasi download
    console.log('Download:', report.file_url);
    alert(`Mengunduh: ${report.title}`);
  };

  const handleEdit = () => {
    router.push(paths.dashboard.reports.edit(report.id));
  };

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await deleteReport(report.id);
        router.push(paths.dashboard.reports.root);
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Gagal menghapus laporan');
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Detail Laporan
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="mdi:arrow-left" />}
            onClick={() => router.push(paths.dashboard.reports.root)}
          >
            Kembali
          </Button>
        </Box>

        {/* Main Card */}
        <Card>
          <CardContent>
            {/* Title */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              {report.title}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Metadata */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Dibuat pada:
                </Typography>
                <Typography variant="body2">
                  {new Date(report.created_at || report.createdAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Diperbarui pada:
                </Typography>
                <Typography variant="body2">
                  {new Date(report.updated_at || report.updatedAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                Deskripsi:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {report.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mdi:download" />}
                onClick={handleDownload}
              >
                Unduh Laporan
              </Button>

              <Button
                variant="outlined"
                startIcon={<Iconify icon="mdi:pencil" />}
                onClick={handleEdit}
              >
                Edit
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="mdi:trash" />}
                onClick={handleDelete}
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
