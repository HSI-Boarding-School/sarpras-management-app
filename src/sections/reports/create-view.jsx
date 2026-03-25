'use client';

import { useState } from 'react';
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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Form, Field } from 'src/components/hook-form';
import { createReport, getBranches } from 'src/lib/db';
import { INVENTORY_BRANCHES } from 'src/_mock/_inventory';

// ----------------------------------------------------------------------

const CreateReportSchema = zod.object({
  branch: zod.string().min(1, { message: 'Cabang wajib dipilih!' }),
  title: zod.string().min(1, { message: 'Judul laporan wajib diisi!' }),
  description: zod.string().min(1, { message: 'Deskripsi laporan wajib diisi!' }),
});

// ----------------------------------------------------------------------

export function ReportsCreateView() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');

  const defaultValues = {
    branch: 'sukabumi',
    title: '',
    description: '',
  };

  const methods = useForm({
    resolver: zodResolver(CreateReportSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
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
      const reportData = {
        branch_id: selectedBranch.id,
        title: data.title,
        description: data.description,
      };

      console.log('Submitting report data:', reportData);

      // Save to Supabase
      await createReport(reportData);
      
      // Reset form
      reset();
      
      setSuccessMessage('Laporan berhasil dibuat!');
      
      setTimeout(() => {
        router.push(paths.dashboard.reports.root);
      }, 1500);
    } catch (error) {
      console.error('Error creating report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal membuat laporan. Silakan coba lagi.';
      setSuccessMessage(errorMessage);
    }
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          Buat Laporan Inventaris
        </Typography>

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
                    Buat Laporan
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push(paths.dashboard.reports.root)}
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
