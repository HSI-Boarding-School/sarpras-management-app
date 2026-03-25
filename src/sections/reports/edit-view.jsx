'use client';

import { useState, useEffect, useMemo } from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Form, Field } from 'src/components/hook-form';

import { getReportById, updateReport, getBranches } from 'src/lib/db';
import { INVENTORY_BRANCHES } from 'src/_mock/_inventory';

// ----------------------------------------------------------------------

const EditReportSchema = zod.object({
  branch: zod.string().min(1, { message: 'Cabang wajib dipilih!' }),
  title: zod.string().min(1, { message: 'Judul laporan wajib diisi!' }),
  description: zod.string().min(1, { message: 'Deskripsi laporan wajib diisi!' }),
});

// ----------------------------------------------------------------------

export function ReportsEditView({ reportId }) {
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Compute default values using useMemo
  const defaultValues = useMemo(() => ({
    branch: report?.branch_id || report?.branch || 'sukabumi',
    title: report?.title || '',
    description: report?.description || '',
  }), [report]);

  // Initialize form with useMemo to prevent hook order issues
  const methods = useForm({
    resolver: zodResolver(EditReportSchema),
    defaultValues,
  });

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

  // Update form when report data changes
  useEffect(() => {
    if (report) {
      methods.reset(defaultValues);
    }
  }, [report, defaultValues, methods]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Fetch branches from database to get the UUID
      const branches = await getBranches();
      
      // Find branch by code
      const branchCode = data.branch;
      const selectedBranch = branches.find((b) => b.code === branchCode);
      
      if (!selectedBranch) {
        throw new Error(`Cabang dengan kode ${branchCode} tidak ditemukan di database`);
      }

      // Prepare data for Supabase
      const updateData = {
        branch_id: selectedBranch.id,
        title: data.title,
        description: data.description,
      };

      console.log('Submitting report update:', updateData);

      // Update in Supabase
      await updateReport(reportId, updateData);
      
      setSuccessMessage('Laporan berhasil diperbarui!');
      
      setTimeout(() => {
        router.push(paths.dashboard.reports.detail(reportId));
      }, 1500);
    } catch (error) {
      console.error('Error updating report:', error);
      setSuccessMessage('Gagal memperbarui laporan. Silakan coba lagi.');
    }
  });

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Laporan tidak ditemukan
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push(paths.dashboard.reports.root)}
          >
            Kembali ke Daftar Laporan
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Edit Laporan
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push(paths.dashboard.reports.detail(reportId))}
          >
            Kembali
          </Button>
        </Box>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Form methods={methods} onSubmit={onSubmit}>
              <Stack spacing={3}>
                <Field.Select
                  name="branch"
                  label="Cabang"
                  options={INVENTORY_BRANCHES}
                />

                <Field.Text
                  name="title"
                  label="Judul Laporan"
                  placeholder="Masukkan judul laporan"
                />

                <Field.Text
                  name="description"
                  label="Deskripsi Laporan"
                  placeholder="Masukkan deskripsi laporan"
                  multiline
                  rows={6}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Simpan Perubahan
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push(paths.dashboard.reports.detail(reportId))}
                  >
                    Batal
                  </Button>
                </Box>
              </Stack>
            </Form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
